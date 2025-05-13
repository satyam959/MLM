import Wallet from '../Models/WalletModels.mjs';
import IncomeLevelModel from '../Models/IncomeLevelModel.mjs'; // ✅ Required
// import LevelIncomeModel from '../Models/'; // ✅ Also required for getLevelIncomeByUser
import UserRepository from './UserRepository.mjs';

const WalletRepository = {
  async findAll() {
    return await Wallet.find();
  },

  async findById(walletId) {
    return await Wallet.findById(walletId);
  },

  async create(data) {
    const balance = Number(data.balance ?? 0);
    if (isNaN(balance)) throw new Error('Invalid balance value');

    const wallet = new Wallet({ ...data, balance });
    return await wallet.save();
  },

  async update(walletId, data) {
    if (data.balance !== undefined) {
      data.balance = Number(data.balance);
      if (isNaN(data.balance)) throw new Error('Invalid balance value');
    }

    return await Wallet.findByIdAndUpdate(walletId, data, { new: true });
  },

  async delete(walletId) {
    return await Wallet.findByIdAndDelete(walletId);
  },

  async findByWalletId(walletId) {
    return await Wallet.findOne({ walletId });
  },

  async createWallet(walletData) {
    const balance = Number(walletData.balance ?? 0);
    if (isNaN(balance)) throw new Error('Invalid balance value');
    const wallet = new Wallet({ ...walletData, balance });
    return await wallet.save();
  },

  async updateBalance(walletId, newBalance) {
    const amount = Number(newBalance);
    if (isNaN(amount)) throw new Error('Invalid balance amount');
    return await Wallet.findOneAndUpdate(
      { walletId },
      { balance: amount },
      { new: true }
    );
  },

  async updateWalletBalance(userId, amount) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) throw new Error('Invalid amount to increment');

    return await Wallet.updateOne(
      { userId },
      { $inc: { balance: numericAmount } }
    );
  },

  async updateReferredUserWallet(userIds, amount) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) throw new Error('Invalid referral bonus amount');

    return await Wallet.updateMany(
      { userId: { $in: userIds } },
      { $inc: { balance: numericAmount } }
    );
  },

  async creditToWallet({ userId, amount }) {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) throw new Error('Invalid credit amount');

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    wallet.balance += numericAmount;
    await wallet.save();

    return wallet;
  },

  async getLevelIncomeByUser(userId) {
    try {
      const incomes = await LevelIncomeModel.find({ userId });

      let directIncome = 0;
      let teamIncome = 0;

      incomes.forEach((income) => {
        if (income.source === 'direct') {
          directIncome += income.amount;
        } else if (income.source === 'team') {
          teamIncome += income.amount;
        }
      });

      return {
        directIncome,
        teamIncome,
      };
    } catch (error) {
      console.error('Error fetching level income by userId:', error);
      throw error;
    }
  },

  async getUserLevel(userId) {
    try {
      const user = await UserRepository.findById(userId);
      return user?.level || 1;
    } catch (error) {
      console.error('Error fetching user level:', error);
      throw error;
    }
  },

  async rewardBasedOnTeamSize(userId) {
    try {
      const downline = await UserRepository.getUserDownlines(userId);
      const actualTeamSize = downline.length;

      const incomeLevels = await IncomeLevelModel.find().sort({ team: -1 });
      let teamReward = 0;

      for (let level of incomeLevels) {
        if (actualTeamSize >= level.team) {
          teamReward = level.income;
          break;
        }
      }

      if (teamReward > 0) {
        await Wallet.updateOne(
          { userId },
          { $inc: { balance: Number(teamReward) } }
        );
      }

      return { success: true, reward: teamReward, teamSize: actualTeamSize };
    } catch (error) {
      console.error('Error in rewardBasedOnTeamSize:', error);
      throw error;
    }
  },

  async getTotalWalletAmount(userId) {
    const wallet = await Wallet.findOne({ userId });
    return wallet?.balance ?? 0;
  },

  async hasReferralBonus(userId) {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return false;

    return wallet.balance >= 399; // Adjust threshold if needed
  },
};

export default WalletRepository;
