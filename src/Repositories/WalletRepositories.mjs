import WalletModel from "../Models/WalletModels.mjs";
import IncomeLevelModel from "../Models/IncomeLevelModel.mjs"; // make sure model file name is IncomeLevelModel
import UserRepository from "./UserRepository.mjs";
import WalletHistory from "../Models/WalletHistory.mjs"; // rename import to singular
import UserModel from "../Models/UserModels.mjs";
import Rank from "../Models/RankModels.mjs";

const WalletRepository = {
  async findAll() {
    return await WalletModel.find();
  },

  async findById(walletId) {
    return await WalletModel.findById(walletId);
  },

  async findByUserId(userId) {
    try {
      let wallet = await WalletModel.findOne({ userId });
      if (!wallet) {
        wallet = await WalletModel.create({ userId, balance: 0 });
      }
      return wallet;
    } catch (error) {
      throw new Error("Error finding wallet");
    }
  },

  async create(data) {
    const wallet = new WalletModel(data);
    return await wallet.save();
  },

  async update(walletId, data) {
    return await WalletModel.findByIdAndUpdate(walletId, data, { new: true });
  },

  async delete(walletId) {
    return await WalletModel.findByIdAndDelete(walletId);
  },

  async findByWalletId(walletId) {
    return await WalletModel.findOne({ walletId });
  },

  async createWallet(walletData) {
    const wallet = new WalletModel(walletData);
    return await wallet.save();
  },

  async updateBalance(walletId, newBalance) {
    return await WalletModel.findOneAndUpdate(
      { walletId },
      { balance: newBalance },
      { new: true }
    );
  },

  async getLevelIncomeByUser(userId) {
    const incomes = await IncomeLevelModel.find({ userId });
    let directIncome = 0;
    let teamIncome = 0;
    incomes.forEach((income) => {
      if (income.source === "direct") directIncome += income.amount;
      else if (income.source === "team") teamIncome += income.amount;
    });
    return { directIncome, teamIncome };
  },

  async getUserLevel(userId) {
    const user = await UserRepository.findById(userId);
    return user?.level ?? 1;
  },

  async updateReferredUserWallet(userIds, amount) {
    return await WalletModel.updateMany(
      { userId: { $in: userIds } },
      { $inc: { balance: amount } }
    );
  },

  async updateWalletBalance(userId, amount) {
    return await WalletModel.updateOne(
      { userId },
      { $inc: { balance: amount } }
    );
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
        await WalletModel.updateOne(
          { userId },
          { $inc: { balance: teamReward } }
        );
      }

      return { success: true, reward: teamReward, teamSize: actualTeamSize };
    } catch (error) {
      throw error;
    }
  },

  async getTotalWalletAmount(userId) {
    const wallet = await WalletModel.findOne({ userId });
    return wallet?.balance ?? 0;
  },

  async hasReferralBonus(userId) {
    const wallet = await WalletModel.findOne({ userId });
    return wallet?.balance >= 399;
  },

  async creditToWallet({ userId, amount }) {
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) throw new Error(`Wallet not found for user ${userId}`);
    wallet.balance += amount;
    await wallet.save();
    return wallet;
  },

  // Corrected method: Get daily reward stats
  async getDailyRewardStats(fromDate, toDate, transactionType) {
    return WalletHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          transactionType,
          status: "completed"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",  // assuming userId is a number field in users collection
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "ranks",
          localField: "user.rankId",
          foreignField: "rankId",
          as: "rank"
        }
      },
      { $unwind: { path: "$rank", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: 1,
          amount: 1,
          type: 1,
          transactionType: 1,
          source: 1,
          balanceAfter: 1,
          status: 1,
          createdAt: 1,
          userName: "$user.name",
          rankName: "$rank.name"
        }
      }
    ]);
  }
  
};  

export default WalletRepository;
