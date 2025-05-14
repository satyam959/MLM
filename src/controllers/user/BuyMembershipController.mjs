import UserRepository from '../../Repositories/user/userRepositories.mjs';
import UserWalletRepository from '../../Repositories/user/userWalletRepositories.mjs';

class BuyMembershipController {

    static async buyMembership(req, res) {
        try {
            const userTokenData = req.user;
            const userDetails = await UserRepository.getUserDetails(userTokenData.userId);
            const adminUserId = await UserRepository.getAdminUserId();
            let adminWallet = await UserWalletRepository.findWalletByUserId(adminUserId);

            const amountToAdd = req.body.amount;
            let finalAmount = 0
            // if (adminWallet) {
            //     // ✅ Update existing wallet
            //     adminWallet.balance += amountToAdd;
            //     finalAmount = await adminWallet.save();
            // } else {
            //     // ✅ Create new wallet
            //     finalAmount = await UserWalletRepository.createWallet({
            //         userId: userTokenData.userId,
            //         balance: amountToAdd,
            //     });
            // }
            if (adminWallet) {
                // Ensure balance is a number
                adminWallet.balance = Number(adminWallet.balance) + amountToAdd;
                finalAmount = await adminWallet.save();
            } else {
                // Create new wallet for admin
                finalAmount = await UserWalletRepository.createWallet({
                    userId: adminUserId, // fix: this was mistakenly set to userTokenData.userId earlier
                    balance: amountToAdd,
                });
            }
            const walletHistoryData = {

                userId: userTokenData.userId,
                amount: amountToAdd,
                type: "debit",
                transactionType: "membership",
                source: "wallet",
                balanceAfter: finalAmount
            }
            console.log(walletHistoryData);
            // await UserWalletRepository.createWalletHistory(walletHistoryData)
            res.status(200).json({
                message: "Membership purchased and admin wallet updated.",
                adminWallet,
            });
        } catch (error) {
            console.error("Error in buyMembership:", error.message);
            res.status(500).json({
                message: "Error processing membership purchase",
                error: error.message,
            });
        }
    }
}


export default BuyMembershipController;
