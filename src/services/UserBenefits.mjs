import UserModel from '../Models/UserModels.mjs';
import WalletRepository from '../Repositories/WalletRepositories.mjs';
import WalletTransaction from '../Models/TransactionModels.mjs'; 
import WithdrawalModel from  '../Models/WithdrawalModel.mjs'

class UserBenefits {
  static async checkReferralRewardEligibility(referredByUserId) {
    const referrer = await UserModel.findOne({ userId: referredByUserId });
    if (!referrer) return;

    const referrerCreatedAt = new Date(referrer.createdAt);
    const tenDaysLater = new Date(referrerCreatedAt);
    tenDaysLater.setDate(tenDaysLater.getDate() + 10);

    const referredCount = await UserModel.countDocuments({
      referredBy: referredByUserId,
      createdAt: { $lte: tenDaysLater },
    });
    if (referredCount >= 10) {
      const alreadyGiven = await WalletTransaction.findOne({
        userId: referredByUserId,
        type: 'referral_bonus_10_users'
      });
      if (alreadyGiven) return; 
      await WalletRepository.creditToWallet({
        userId: referredByUserId,
        amount: 199,
      });
      await WalletTransaction.create({
        userId: referredByUserId,
        type: 'referral_bonus_10_users',
        amount: 199,
        description: 'Referral bonus for referring 10 users within 10 days',
        createdAt: new Date(),
      });
    }
  }
}

export default UserBenefits;
