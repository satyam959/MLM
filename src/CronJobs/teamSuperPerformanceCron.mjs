import cron from "node-cron";
import WalletModel from "../Models/WalletModels.mjs";
import UserModel from "../Models/UserModels.mjs";
import RankModel from "../Models/RankModels.mjs";
import UserWalletRepository from "../Repositories/user/userWalletRepositories.mjs";
import userRepository from "../Repositories/user/userRepositories.mjs";

const DAILY_REWARD_AMOUNT = 5;
const MAX_DAYS = 50;

// Return current IST date in yyyy-mm-dd format (without time)
function getISTDateString(date = new Date()) {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

class TeamSuperPerformanceCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log("⏳ Cron already running");
      return;
    }

    console.log("✅ TeamSuperPerformanceCron started");

    this.task = cron.schedule(
      '* * * * *', // Every day at 12:10 PM IST
      async () => {
        const now = new Date();
        const adminUserId = await userRepository.getAdminUserId();
        const todayIST = getISTDateString(now);
        console.log(`🕐 Cron Triggered at (IST): ${now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);

        try {
          const adminWallet = await WalletModel.findOne({ userId: adminUserId });
          if (!adminWallet) return console.log("❌ Admin wallet not found");
          if (adminWallet.balance < DAILY_REWARD_AMOUNT) return console.log("❌ Admin wallet has insufficient balance");

          const silverRanks = await RankModel.find({ name: "Silver" }, { rankId: 1 });
          if (!silverRanks.length) return console.log("⚠️ No Silver rank found");

          const silverRankIds = silverRanks.map(r => r.rankId);
          const silverUsers = await UserModel.find(
            { rankId: { $in: silverRankIds } },
            { userId: 1, name: 1, rankId: 1, teamRewardCount: 1 }
          );

          if (!silverUsers.length) return console.log("⚠️ No Silver users found");

          for (const user of silverUsers) {
            const wallet = await WalletModel.findOne({ userId: user.userId });
            if (!wallet) {
              console.log(`⚠️ Wallet not found for userId ${user.userId}`);
              continue;
            }

            const rewardCount = user.teamRewardCount || 0;
            if (rewardCount >= MAX_DAYS) {
              console.log(`🎯 Reward limit reached for userId ${user.userId}`);
              continue;
            }

            const lastReward = wallet.lastTeamRewardDate;
            if (lastReward && lastReward === todayIST) {
              console.log(`⏳ Already rewarded today for userId ${user.userId}`);
              continue;
            }

            // Process reward
            const userOldBalance = wallet.balance;
            const adminOldBalance = adminWallet.balance;

            wallet.balance += DAILY_REWARD_AMOUNT;
            wallet.lastTeamRewardDate = todayIST;
            user.teamRewardCount = rewardCount + 1;
            adminWallet.balance -= DAILY_REWARD_AMOUNT;

            await wallet.save();
            await user.save();
            await adminWallet.save();

            // Save history
            await UserWalletRepository.createWalletHistory({
              userId: user.userId,
              amount: DAILY_REWARD_AMOUNT,
              type: "credit",
              transactionType: "teamPerformancePayout",
              source: "wallet",
              balanceAfter: wallet.balance,
              status: "completed",
            });

            await UserWalletRepository.createWalletHistory({
              userId: adminUserId,
              amount: DAILY_REWARD_AMOUNT,
              type: "debit",
              transactionType: "teamPerformancePayout",
              source: "wallet",
              balanceAfter: adminWallet.balance,
              status: "completed",
            });

            console.log(`✅ ₹${DAILY_REWARD_AMOUNT} sent to userId ${user.userId}`);
            console.log(`   ➤ Name: ${user.name || "N/A"}`);
            console.log(`   ➤ Reward Count: ${user.teamRewardCount}`);
            console.log(`   ➤ Wallet Before: ₹${userOldBalance}`);
            console.log(`   ➤ Wallet After: ₹${wallet.balance}`);
            console.log(`   ➤ Admin Wallet Before: ₹${adminOldBalance}`);
            console.log(`   ➤ Admin Wallet After: ₹${adminWallet.balance}`);
          }
        } catch (error) {
          console.error("❌ Cron Error:", error);
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log("⏹️ TeamSuperPerformanceCron stopped");
    }
  }

  isRunning() {
    return this.task !== null;
  }
}

export default new TeamSuperPerformanceCron();
