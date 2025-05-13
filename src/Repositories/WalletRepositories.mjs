import WalletModel from "../Models/WalletModels.mjs";
import IncomeLevelModel from "../Models/IncomeLevelModel.mjs";
import UserRepository from "./UserRepository.mjs";

const WalletRepository = {
  async findAll() {
    return await WalletModel.find();
  },

  async findById(walletId) {
    return await WalletModel.findById(walletId);
  },

  // ✅ Updated findByUserId with logging and wallet creation if not found
  async findByUserId(userId) {
    try {
      console.log("Searching for wallet with userId:", userId);  // Debugging log
      let wallet = await WalletModel.findOne({ userId });

      if (!wallet) {
        console.log("No wallet found for userId:", userId);  // Debugging log
        // Automatically create a wallet if none exists
        wallet = await WalletModel.create({ userId, balance: 0 });
        console.log("Created a new wallet for userId:", userId);  // Debugging log
      } else {
        console.log("Found wallet:", wallet);  // Debugging log
      }
      
      return wallet;
    } catch (error) {
      console.error("Error finding wallet by userId:", error.message);
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
    try {
      const incomes = await LevelIncomeModel.find({ userId });

      let directIncome = 0;
      let teamIncome = 0;

      incomes.forEach((income) => {
        if (income.source === "direct") {
          directIncome += income.amount;
        } else if (income.source === "team") {
          teamIncome += income.amount;
        }
      });

      return {
        directIncome,
        teamIncome,
      };
    } catch (error) {
      console.error("Error fetching level income by userId:", error);
      throw error;
    }
  },

  async getUserLevel(userId) {
    try {
      const user = await UserRepository.findById(userId);
      return user?.level ?? 1;
    } catch (error) {
      console.error("Error fetching user level:", error);
      throw error;
    }
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
      console.error("Error in rewardBasedOnTeamSize:", error);
      throw error;
    }
  },

  async getTotalWalletAmount(userId) {
    const wallet = await WalletModel.findOne({ userId });
    return wallet?.balance ?? 0;
  },

  async hasReferralBonus(userId) {
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) return false;

    return wallet.balance >= 399;
  },

  async creditToWallet({ userId, amount }) {
    const wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    wallet.balance += amount;
    await wallet.save();

    return wallet;
  }
};

export default WalletRepository;
