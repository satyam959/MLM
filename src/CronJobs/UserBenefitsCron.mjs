import cron from 'node-cron';
import UserModel from '../Models/UserModels.mjs';
import UserWalletRepository from '../Repositories/user/userWalletRepositories.mjs';
import WalletHistories from '../Models/WalletHistory.mjs';

const REFERRAL_REWARD_AMOUNT = 199;
const ADMIN_USER_ID = 355470;
const REFERRAL_REWARD_TYPE = 'referral_bonus_10_users';

class UserBenefitsCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log('⏳ UserBenefitsCron is already running');
      return;
    }

    console.log('✅ UserBenefitsCron started');

    this.task = cron.schedule('* * * * *', async () => {
      console.log('[Cron] userBenefit started');
      await this.runReferralCheck();
       console.log('[Cron] userBenefit completed');
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    });
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️ UserBenefitsCron stopped');
    }
  }

  isRunning() {
    return this.task !== null;
  }

  async runReferralCheck() {
    try {
      const referrers = await UserModel.find({
        referralBonusGiven: { $ne: true },
        rechargeRecived: 1 // ✅ Only users who have received recharge
      });

      for (const referrer of referrers) {
        const referredCount = await UserModel.countDocuments({ referredBy: referrer.userId });

        if (referredCount >= 10) {
          const userWallet = await UserWalletRepository.findWalletByUserId(referrer.userId);
          const adminWallet = await UserWalletRepository.findWalletByUserId(ADMIN_USER_ID);

          if (!userWallet || !adminWallet) {
            console.log(`❌ Wallet missing for user ${referrer.userId} or admin`);
            continue;
          }

          if (adminWallet.balance < REFERRAL_REWARD_AMOUNT) {
            console.log("❌ Admin has insufficient balance");
            continue;
          }

          // 💳 Credit to referrer
          const userOldBalance = userWallet.balance;
          userWallet.balance += REFERRAL_REWARD_AMOUNT;
          await userWallet.save();

          // 💸 Debit from admin
          const adminOldBalance = adminWallet.balance;
          adminWallet.balance -= REFERRAL_REWARD_AMOUNT;
          await adminWallet.save();

          // 🧾 Save transaction history for user
          await WalletHistories.create({
            userId: referrer.userId,
            type: "credit",
            transactionType: REFERRAL_REWARD_TYPE,
            amount: REFERRAL_REWARD_AMOUNT,
            balanceBefore: userOldBalance,
            balanceAfter: userWallet.balance,
            source: "wallet",
            status: "completed",
          });

          // 🧾 Save transaction history for admin
          await WalletHistories.create({
            userId: ADMIN_USER_ID,
            type: "debit",
            transactionType: REFERRAL_REWARD_TYPE,
            amount: REFERRAL_REWARD_AMOUNT,
            balanceBefore: adminOldBalance,
            balanceAfter: adminWallet.balance,
            source: "wallet",
            status: "completed",
          });

          // ✅ Mark user as rewarded
          await UserModel.updateOne(
            { userId: referrer.userId },
            { $set: { referralBonusGiven: true } }
          );

          console.log(`✅ ₹199 reward sent to ${referrer.userId} for 10 referrals`);
        }
      }
    } catch (error) {
      console.error('[Cron] userBenefit failed:', error);
    }
  }
}

export default new UserBenefitsCron();
