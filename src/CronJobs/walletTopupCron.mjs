import cron from "node-cron";
import WalletModel from "../Models/WalletModels.mjs";
import UserModel from "../Models/UserModels.mjs";
import UserWalletRepository from "../Repositories/user/userWalletRepositories.mjs"; // Adjust path
import { Types } from "mongoose";

const ADMIN_USER_ID = 355470;

class WalletTopupCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      // console.log('⏳ Cron already running');
      return;
    }

    // console.log('✅ Starting Wallet Topup Cron');

    this.task = cron.schedule('* * * * *', async () => {
      try {
        console.log('\n🕐 Cron Running: Checking eligible wallets...');

        const now = new Date();
        const adminWallet = await WalletModel.findOne({ userId: ADMIN_USER_ID });

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

          // Log IST and UTC for debugging
          console.log(`🔍 userId ${wallet.userId}`);
          console.log(`   ➤ Now (UTC): ${now.toISOString()}`);
          console.log(`   ➤ Now (IST): ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
          console.log(`   ➤ EndDate (UTC): ${endDate.toISOString()}`);
          console.log(`   ➤ EndDate (IST): ${endDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);

          if (now.getTime() >= endDate.getTime()) {
            console.log(`⛔ End date and time passed for userId ${wallet.userId} - Skipping top-up`);
            continue;
          }

          // Proceed with daily top-up
          const amountToAdd = 1;
          const userRemainingBalance = wallet.balance + amountToAdd;
          const adminRemainingBalance = adminWallet.balance - amountToAdd;

          // 💰 Update balances
          wallet.balance = userRemainingBalance;
          wallet.dailyTopupsCount = (wallet.dailyTopupsCount || 0) + 1;
          wallet.lastTopupDate = now;
          user.membership.lastPayoutDate = now;
          adminWallet.balance = adminRemainingBalance;

          await wallet.save();
          await user.save();
          await adminWallet.save();

          // 🧾 Create history entries
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
            userId: ADMIN_USER_ID,
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
        // console.error('❌ Error in Wallet Topup Cron:', error.message);
      }
    });
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      // console.log('⏹️ Wallet Topup Cron stopped');
    } else {
      /// console.log('ℹ️ Cron is not running');
    }
  }

  isRunning() {
    return this.task !== null;
  }
}

export default new WalletTopupCron();
