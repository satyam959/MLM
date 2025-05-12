// import Wallet from '../Models/WalletModels.mjs';
// import IncomeLevelModel from '../Models/IncomeLevelModel.mjs';
// import UserRepository from './UserRepository.mjs';

// const WalletRepository = {
//   async findAll() {
//     return await Wallet.find();
//   },

//   async findById(walletId) {
//     return await Wallet.findById(walletId);
//   },

//   async create(data) {
//     const wallet = new Wallet(data);
//     return await wallet.save();
//   },

//   async update(walletId, data) {
//     return await Wallet.findByIdAndUpdate(walletId, data, { new: true });
//   },

//   async delete(walletId) {
//     return await Wallet.findByIdAndDelete(walletId);
//   },

//   async findByWalletId(walletId) {
//     return await Wallet.findOne({ walletId });
//   },

//   async createWallet(walletData) {
//     const wallet = new Wallet(walletData);
//     return await wallet.save();
//   },

//   async updateBalance(walletId, newBalance) {
//     return await Wallet.findOneAndUpdate(
//       { walletId },
//       { balance: newBalance },
//       { new: true }
//     );
//   },

//   async findWalletByUserId(userId) {
//     try {
//       return await Wallet.findOne({ userId });
//     } catch (error) {
//       console.error('Error fetching wallet by userId:', error);
//       throw error;
//     }
//   },

//   async updateReferredUserWallet(userIds, amount) {
//     return await Wallet.updateMany(
//       { userId: { $in: userIds } },
//       { $inc: { balance: amount } }
//     );
//   },

//   async updateWalletBalance(userId, amount) {
//     return await Wallet.updateOne(
//       { userId },
//       { $inc: { balance: amount } }
//     );
//   },

//   async rewardBasedOnTeamSize(userId) {
//     try {
//       const downline = await UserRepository.getUserDownlines(userId);
//       const actualTeamSize = downline.length;

//       const incomeLevels = await IncomeLevelModel.find().sort({ team: -1 });
//       let teamReward = 0;

//       for (let level of incomeLevels) {
//         if (actualTeamSize >= level.team) {
//           teamReward = level.income;
//           break;
//         }
//       }

//       if (teamReward > 0) {
//         await Wallet.updateOne(
//           { userId },
//           { $inc: { balance: teamReward } }
//         );
//       }

//       return { success: true, reward: teamReward, teamSize: actualTeamSize };
//     } catch (error) {
//       console.error('Error in rewardBasedOnTeamSize:', error);
//       throw error;
//     }
//   },
//   async  getTotalWalletAmount(userId) {
//     const wallet = await WalletModel.findOne({ userId });
//     return wallet?.balance ?? 0;
//   },
  
//   async  getLevelIncomeByUser(userId) {
//     // your logic here
//   },

//   async hasReferralBonus(userId) {
//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet) return false;

//     return wallet.balance >= 399; // adjust as needed
//   },

//   async creditToWallet({ userId, amount }) {
//     const wallet = await Wallet.findOne({ userId });

//     if (!wallet) {
//       throw new Error(`Wallet not found for user ${userId}`);
//     }

//     wallet.balance += amount;
//     await wallet.save();

//     return wallet;
//   }
// };

// export default WalletRepository;







import Wallet from '../Models/WalletModels.mjs';
import IncomeLevelModel from '../Models/IncomeLevelModel.mjs';
import UserRepository from './UserRepository.mjs';

const WalletRepository = {
  async findAll() {
    return await Wallet.find();
  },

  async findById(walletId) {
    return await Wallet.findById(walletId);
  },

  async create(data) {
    const wallet = new Wallet(data);
    return await wallet.save();
  },

  async update(walletId, data) {
    return await Wallet.findByIdAndUpdate(walletId, data, { new: true });
  },

  async delete(walletId) {
    return await Wallet.findByIdAndDelete(walletId);
  },

  async findByWalletId(walletId) {
    return await Wallet.findOne({ walletId });
  },

  async createWallet(walletData) {
    const wallet = new Wallet(walletData);
    return await wallet.save();
  },

  async updateBalance(walletId, newBalance) {
    return await Wallet.findOneAndUpdate(
      { walletId },
      { balance: newBalance },
      { new: true }
    );
  },

  // Inside WalletRepository

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
      return user.level; 
    } catch (error) {
      console.error('Error fetching user level:', error);
      throw error;
    }
  },

  async updateReferredUserWallet(userIds, amount) {
    return await Wallet.updateMany(
      { userId: { $in: userIds } },
      { $inc: { balance: amount } }
    );
  },

  async updateWalletBalance(userId, amount) {
    return await Wallet.updateOne(
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
        await Wallet.updateOne(
          { userId },
          { $inc: { balance: teamReward } }
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

  async getLevelIncomeByUser(userId) {
    // your logic here
  },

  async hasReferralBonus(userId) {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return false;

    return wallet.balance >= 399; // adjust as needed
  },

  async creditToWallet({ userId, amount }) {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    wallet.balance += amount;
    await wallet.save();

    return wallet;
  }
};

export default WalletRepository;
