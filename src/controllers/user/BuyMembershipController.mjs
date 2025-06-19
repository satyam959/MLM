import UserRepository from '../../Repositories/user/userRepositories.mjs';
import UserWalletRepository from '../../Repositories/user/userWalletRepositories.mjs';
import EmailService from '../../utils/emailService.mjs';
import { fileURLToPath } from 'url'
import path from 'path';
import fs from 'fs';


// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to fixed PDF file
const pdfPath = path.join(__dirname, '../../utils/eBook/dummy.pdf');
const pdfBuffer = fs.readFileSync(pdfPath);


class BuyMembershipController {
    static async buyMembership(req, res) {
        try {
         
            const userTokenData = req.user;
            const amountToAdd = req.body.amount;

            // Get admin and user wallet
            const adminUserId = await UserRepository.getAdminUserId();
            const userWallet = await UserWalletRepository.findWalletByUserId(userTokenData.userId);
            let adminWallet = await UserWalletRepository.findWalletByUserId(adminUserId);

            if (!userWallet || Number(userWallet.balance) < amountToAdd) {
                return res.status(400).json({
                    message: "Insufficient wallet balance. Please top-up your wallet.",
                    userBalance: userWallet ? Number(userWallet.balance) : 0,
                    required: amountToAdd
                });
            }

            // Admin wallet update
            let finalAdminWallet;
            if (adminWallet) {
                adminWallet.balance = Number(adminWallet.balance) + amountToAdd;
                finalAdminWallet = await adminWallet.save();
            } else {
                finalAdminWallet = await UserWalletRepository.createWallet({
                    userId: adminUserId,
                    balance: amountToAdd,
                });
            }

            // User wallet update
            const userRemainingBalance = userWallet.balance = Number(userWallet.balance) - amountToAdd;
            await userWallet.save();

            // User Wallet History - DEBIT
            await UserWalletRepository.createWalletHistory({
                userId: userTokenData.userId,
                amount: amountToAdd,
                type: "debit",
                transactionType: "membership",
                source: "wallet",
                balanceAfter: userRemainingBalance,
                status: "completed",
            });

            // Admin Wallet History - CREDIT
            await UserWalletRepository.createWalletHistory({
                userId: adminUserId,
                amount: amountToAdd,
                type: "credit",
                transactionType: "membership",
                source: "wallet",
                balanceAfter: finalAdminWallet.balance,
                status: "completed",
            });

            // Activate membership
            await BuyMembershipController.activateMembership(userTokenData.userId);

            // Get user info (receipt generation & email ke liye)
            const user = await UserRepository.findUserById(userTokenData.userId);

            // Send receipt email
            await BuyMembershipController.sendMembershipReceiptEmail({
                username: user.name,
                email: user.email,
                amount: amountToAdd,
            });

            res.status(200).json({
                message: "eBook purchased successfully. Receipt emailed.",
                adminWallet: finalAdminWallet,
            });

        } catch (error) {
            console.error("Error in buyMembership:", error);
            res.status(500).json({
                message: "Error processing membership purchase",
                error: error.message,
            });
        }
    }

    static async activateMembership(userId) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30); // 30-day membership

        const membershipDetails = {
            type: 1, // Premium
            startDate,
            endDate,
            lastPayoutDate: null
        };

        await UserRepository.updateUserMembership(userId, { membership: membershipDetails });
    }

    

static async sendMembershipReceiptEmail({ username, email }) {
    try {
        // Path to your fixed PDF file (update the path as needed)
        const pdfPath = pdfBuffer;

        await EmailService.sendReceiptEmail(
            email,
            "Your Membership Receipt",
            `Hi ${username},\n\nThank you for purchasing a membership. Please find your receipt attached.`,
            pdfPath
        );

        console.log("Receipt emailed successfully to:", email);
    } catch (error) {
        console.error("Failed to send membership receipt email:", error.message);
    }
}

// Testing ke liye sirf membership activate aur receipt bhejne wala function
static async sendMembershipReceiptForUser(req, res) {
    try {
      
    //   const user = await UserRepository.findUserById(userId);
      await BuyMembershipController.sendMembershipReceiptEmail({
        username: "Rahul", // user.name
        email: "satyam@scriza.in", //user.email
      });

      res.status(200).json({ message: "Membership activated and receipt sent successfully" });

    } catch (error) {
      console.error("Error in sendMembershipReceiptForUser:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
  // Controller method
  static async rewardReferrerFromAdmin(req, res) {
    try {
      const adminUserId = await UserRepository.getAdminUserId();
  
      // Step 1: Find users who have membership and a referrer
      const usersWithMembership = await UserWalletRepository.findUsersWithMembershipAndReferrer();
  
      console.log("Total users with membership and referrer found:", usersWithMembership.length);
  
      for (const user of usersWithMembership) {
        const referrerUserId = user.referredBy;
        if (!referrerUserId) continue;
  
        console.log(`Processing Bonus for referrerId: ${referrerUserId} from user: ${user._id}`);
  
        // Fetch admin wallet
        const adminWallet = await UserWalletRepository.findWalletByUserId(adminUserId);
        if (!adminWallet || adminWallet.balance < 200) {
          console.warn("Admin wallet has insufficient balance.");
          continue;
        }
  
        // Fetch or create referrer's wallet
        let referrerWallet = await UserWalletRepository.findWalletByUserId(referrerUserId);
        if (!referrerWallet) {
          console.log("Creating wallet for referrer:", referrerUserId);
          referrerWallet = await UserWalletRepository.createWallet({ userId: referrerUserId, balance: 0 });
        }
  
        // Deduct ₹200 from admin wallet
        adminWallet.balance -= 200;
        await adminWallet.save();
  
        // Add ₹200 to referrer wallet
        referrerWallet.balance += 200;
        const updatedReferrerWallet = await referrerWallet.save();
  
        console.log(`₹200 transferred from Admin (${adminUserId}) to Referrer (${referrerUserId})`);
  
        // Admin Wallet History - debit
        try {
          await UserWalletRepository.createWalletHistory({
            userId: adminUserId,
            amount: 200,
            type: "debit",
            transactionType: "referralBonus",
            source: "adminRewardCron",
            balanceAfter: adminWallet.balance,
            status: "completed",
          });
          console.log("Admin wallet history saved.");
        } catch (error) {
          console.error("Failed to create admin wallet history:", error.message);
        }
  
        // Referrer Wallet History - credit
        try {
          await UserWalletRepository.createWalletHistory({
            userId: referrerUserId,
            amount: 200,
            type: 'credit',
            transactionType: 'referralBonus',
            source: 'adminWallet',
            balanceAfter: updatedReferrerWallet.balance,
            status: 'completed',
          });
          console.log("Referrer wallet history saved for:", referrerUserId);
        } catch (error) {
          console.error("Failed to create wallet history for referrer:", error.message);
        }
      }
  
      res.status(200).json({
        statusCode:200,
        success:true,
        message: "Referral Bonus distributed successfully."
      });
  
    } catch (error) {
      console.error("Referral Bonus distribution failed:", error.message);
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
  
  
}

export default BuyMembershipController;