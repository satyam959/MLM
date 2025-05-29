import cron from "node-cron";
import WalletModel from "../Models/WalletModels.mjs";
import UserModel from "../Models/UserModels.mjs";
import UserWalletRepository from "../Repositories/user/userWalletRepositories.mjs"; // Adjust path
import userRepository from "../Repositories/user/userRepositories.mjs";
import { Types } from "mongoose";



class WalletTopupCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) return;
    console.log("✅ WalletTopupCron started");
    
    // Schedule to run every day at 12:05 AM IST
    this.task = cron.schedule('* * * * *', async () => {
      try {
        const now = new Date(); 
        const adminUserId = await userRepository.getAdminUserId();

        const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

        console.log('\n🕐 Cron Running (IST): Checking eligible wallets...');
        console.log(`📅 Current IST Time: ${istNow.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);

        const adminWallet = await WalletModel.findOne({ userId: adminUserId });

        if (!adminWallet || adminWallet.balance < 1) {
          console.log('❌ Admin wallet not found or insufficient balance');
          return;
        }

        const wallets = await WalletModel.find();

        for (const wallet of wallets) {
          const user = await UserModel.findOne({ userId: wallet.userId });

          if (!user || !user.membership || user.membership.type !== 1) {
            continue;
          }

          const endDate = new Date(user.membership.endDate);
          const istEndDate = new Date(endDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

          console.log(`🔍 userId ${wallet.userId}`);
          console.log(`   ➤ Now (IST): ${istNow.toISOString()}`);
          console.log(`   ➤ EndDate (IST): ${istEndDate.toISOString()}`);

          // Mark payoutCompleted = 1 if now has reached or passed endDate
          if (istNow >= istEndDate) {
            if (!user.membership.payoutCompleted) {
              user.membership.payoutCompleted = 1;
              await user.save();
              console.log(`✅ payoutCompleted set to 1 and top-up stopped for userId ${wallet.userId}`);
            } else {
              console.log(`⛔ End date passed for userId ${wallet.userId} - Skipping top-up`);
            }
            continue;
          }
          

          const amountToAdd = 1;
          const userRemainingBalance = wallet.balance + amountToAdd;
          const adminRemainingBalance = adminWallet.balance - amountToAdd;

          wallet.balance = userRemainingBalance;
          wallet.dailyTopupsCount = (wallet.dailyTopupsCount || 0) + 1;
          wallet.lastTopupDate = istNow;

          user.membership.lastPayoutDate = istNow;
          adminWallet.balance = adminRemainingBalance;

          await wallet.save();
          await user.save();
          await adminWallet.save();

          await UserWalletRepository.createWalletHistory({
            userId: wallet.userId,
            amount: amountToAdd,
            type: "credit",
            transactionType: "dailyPayout",
            source: "wallet",
            balanceAfter: userRemainingBalance,
            status: "completed",
          });

          await UserWalletRepository.createWalletHistory({
            userId: adminUserId,
            amount: amountToAdd,
            type: "debit",
            transactionType: "dailyPayout",
            source: "wallet",
            balanceAfter: adminRemainingBalance,
            status: "completed",
          });

          console.log(`💰 ₹${amountToAdd} transferred to userId ${wallet.userId}`);
        }

      } catch (error) {
        console.error('❌ Error in Wallet Topup Cron:', error.message);
      }
    });
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
  }

  isRunning() {
    return this.task !== null;
  }
}

export default new WalletTopupCron();