import UserRepository from '../../Repositories/user/userRepositories.mjs';
import UserWalletRepository from '../../Repositories/user/userWalletRepositories.mjs';

class BuyMembershipController {

    static async buyMembership(req, res) {
        try {
            const userTokenData = req.user;
            const adminUserId = await UserRepository.getAdminUserId();
            let userWallet = await UserWalletRepository.findWalletByUserId(userTokenData.userId);

            let adminWallet = await UserWalletRepository.findWalletByUserId(adminUserId);
            const amountToAdd = req.body.amount;

            if (!userWallet || Number(userWallet.balance) < amountToAdd) {
                return res.status(400).json({
                    message: "Insufficient wallet balance. Please top-up your wallet.",
                    userBalance: userWallet ? Number(userWallet.balance) : 0,
                    required: amountToAdd
                });
            }

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

            const userRemainingBalance = userWallet.balance = Number(userWallet.balance) - amountToAdd;
            await userWallet.save();
            // 🧾 1. User Wallet History Entry (DEBIT)
            await UserWalletRepository.createWalletHistory({
                userId: userTokenData.userId,
                amount: amountToAdd,
                type: "debit",
                transactionType: "membership",
                source: "wallet",
                balanceAfter: userRemainingBalance, // if user wallet exists, fill actual balance after debit
                status: "completed",
            });

            // 🧾 2. Admin Wallet History Entry (CREDIT)
            await UserWalletRepository.createWalletHistory({
                userId: adminUserId,
                amount: amountToAdd,
                type: "credit",
                transactionType: "membership",
                source: "wallet",
                balanceAfter: finalAdminWallet.balance,
                status: "completed",
            });
            await BuyMembershipController.activateMembership(userTokenData.userId);

            res.status(200).json({
                message: "Membership purchased and wallet histories updated..",
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
}


export default BuyMembershipController;
