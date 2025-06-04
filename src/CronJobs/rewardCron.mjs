import cron from "node-cron";
import UserModel from "../Models/UserModels.mjs";
import UserWalletRepository from "../Repositories/user/userWalletRepositories.mjs";
import WalletHistories from "../Models/WalletHistory.mjs";
import userRepository from "../Repositories/user/userRepositories.mjs";

const TRANSACTION_TYPE = "monthlyReward";

class RewardCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log("⏳ RewardCron is already running");
      return;
    }

    // For testing: Run every minute
    this.task = cron.schedule(
      "* * * * *",
      async () => {
        const now = new Date();
        const istNow = new Date(
          now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        console.log(`🕐 Cron Triggered at (IST): ${istNow.toLocaleString()}`);
        console.log("[Cron] Monthly Reward started");

        await this.processMonthlyReward(istNow);

        console.log("[Cron] Monthly Reward completed");
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );

    console.log("✅ RewardCron started");
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log("⏹️ RewardCron stopped");
    }
  }

  async processMonthlyReward(istNow) {
    try {
      const adminUserId = await userRepository.getAdminUserId();

      // For testing: use current month
      const firstDayThisMonth = new Date(
        istNow.getFullYear(),
        istNow.getMonth(),
        1
      );
      const lastDayThisMonth = new Date(
        istNow.getFullYear(),
        istNow.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      console.log(
        `📅 Filtering users from ${firstDayThisMonth.toISOString()} to ${lastDayThisMonth.toISOString()}`
      );

      // Find users who joined in this month with membership.type=1 and valid rankId
      const users = await UserModel.find({
        "membership.type": 1,
        rankId: { $exists: true, $ne: null },
        "membership.startDate": {
          $gte: firstDayThisMonth,
          $lte: lastDayThisMonth,
        },
      });

      console.log(`👥 Found ${users.length} eligible users`);

      if (users.length === 0) {
        console.log("⚠️ No eligible users for monthly reward");
        return;
      }

      const totalPool = 40;
      const amountPerUser = totalPool / users.length;

      const adminWallet = await UserWalletRepository.findWalletByUserId(
        adminUserId
      );
      if (!adminWallet) {
        console.log("❌ Admin wallet not found");
        return;
      }

      if (adminWallet.balance < totalPool) {
        console.log(
          `❌ Insufficient admin balance: Need ₹${totalPool}, available ₹${adminWallet.balance}`
        );
        return;
      }

      // Deduct ₹40 from admin
      const adminOldBalance = adminWallet.balance;
      adminWallet.balance -= totalPool;
      await adminWallet.save();

      await WalletHistories.create({
        userId: adminUserId,
        type: "debit",
        transactionType: TRANSACTION_TYPE,
        amount: totalPool,
        balanceBefore: adminOldBalance,
        balanceAfter: adminWallet.balance,
        source: "wallet",
        status: "completed",
        note: `Monthly reward pool deducted for ${firstDayThisMonth.toLocaleString(
          "default",
          { month: "long" }
        )}`,
      });

      // Distribute equally
      for (const user of users) {
        const userWallet = await UserWalletRepository.findWalletByUserId(
          user.userId
        );
        if (!userWallet) {
          console.log(`⚠️ Wallet not found for user ${user.userId}`);
          continue;
        }

        const oldBalance = userWallet.balance;
        userWallet.balance += amountPerUser;
        await userWallet.save();

        const oldMonthly = parseFloat(user.monthlyReward?.toString() || "0");
        const newMonthly = (oldMonthly + amountPerUser).toFixed(2);
        user.monthlyReward = mongoose.Types.Decimal128.fromString(newMonthly);
        await user.save();
        

        await WalletHistories.create({
          userId: user.userId,
          type: "credit",
          transactionType: TRANSACTION_TYPE,
          amount: amountPerUser,
          balanceBefore: oldBalance,
          balanceAfter: userWallet.balance,
          source: "wallet",
          status: "completed",
          note: `Monthly reward for joining in ${firstDayThisMonth.toLocaleString(
            "default",
            { month: "long" }
          )}`,
        });

        console.log(
          `✅ ₹${amountPerUser.toFixed(2)} sent to user ${user.userId}`
        );
      }
    } catch (err) {
      console.error("[Cron] Monthly Reward failed:", err);
    }
  }
}

export default new RewardCron();
