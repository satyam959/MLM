import cron from "node-cron";
import WalletModel from "../Models/WalletModels.mjs";
import UserModel from "../Models/UserModels.mjs";
import UserWalletRepository from "../Repositories/user/userWalletRepositories.mjs";
import userRepository from "../Repositories/user/userRepositories.mjs";

class WalletTopupCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) return;
    console.log("✅ WalletTopupCron started");

    // Run every minute for testing purposes
    this.task = cron.schedule("* * * * *", async () => {
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

          if (istNow >= istEndDate) {
            if (!user.membership.payoutCompleted) {
              user.membership.payoutCompleted = 1;
              await user.save();
              console.log(`✅ payoutCompleted set to 1 and top-up stopped for userId ${wallet.userId}`);
            }
            continue;
          }

          const lastTopupDate = wallet.lastTopupDate ? new Date(wallet.lastTopupDate) : null;
          let missedMinutes = [];

          if (lastTopupDate) {
            let pointer = new Date(lastTopupDate);
            pointer.setMinutes(pointer.getMinutes() + 1);

            while (pointer < istNow) {
              missedMinutes.push(new Date(pointer));
              pointer.setMinutes(pointer.getMinutes() + 1);
            }
          }

          for (const missedTime of missedMinutes) {
            await UserWalletRepository.createWalletHistory({
              userId: wallet.userId,
              amount: 0,
              type: "credit",
              transactionType: "dailyPayout",
              source: "wallet",
              balanceAfter: wallet.balance,
              status: "failed",
              createdAt: missedTime,
              note: "Missed daily top-up due to downtime"
            });

            await UserWalletRepository.createWalletHistory({
              userId: adminUserId,
              amount: 0,
              type: "debit",
              transactionType: "dailyPayout",
              source: "wallet",
              balanceAfter: adminWallet.balance,
              status: "failed",
              createdAt: missedTime,
              note: "Missed daily top-up due to downtime"
            });

            console.log(`⚠️ Missed top-up logged for ${missedTime.toISOString()} for userId ${wallet.userId}`);
          }

          // Perform current minute's top-up
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