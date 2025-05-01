// // import Wallet from '../Models/WalletModels.mjs';

// // const WalletRepository = {
// //   async findAll() {
// //     return await Wallet.find();
// //   },

// //   async findById(walletId) {
// //     return await Wallet.findById(walletId);
// //   },

// //   async create(data) {
// //     const wallet = new Wallet(data);
// //     return await wallet.save();
// //   },

// //   async update(walletId, data) {
// //     return await Wallet.findByIdAndUpdate(walletId, data, { new: true });
// //   },

// //   async delete(walletId) {
// //     return await Wallet.findByIdAndDelete(walletId);
// //   }
// // };

// // export default WalletRepository;








// import Wallet from '../Models/WalletModels.mjs';

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
//     return await Wallet.findOne({ walletId });  // ✅ WalletModel → Wallet
//   },

//   async createWallet(walletData) {
//     const wallet = new Wallet(walletData);
//     return await wallet.save();
//   },
//   async updateBalance(walletId, newBalance) {
//     return await Wallet.findOneAndUpdate(       // ✅ WalletModel → Wallet
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
//    return await Wallet.updateMany(
//       { userId: { $in: userIds } },
//       { $inc: { balance: amount } }
//     );
//   }
//   async function updateWalletBalance(userId, amount) {
//     return WalletModel.updateOne(
//       { userId },
//       { $inc: { balance: amount } }
//     );
//   }
  
  
// };


// export default WalletRepository;



// // import WalletModel from '../Models/WalletModels.mjs';

// // class WalletRepository {
  
// //   async findByWalletId(walletId) {
// //     return await WalletModel.findOne({ walletId });
// //   }

// //   async createWallet(walletData) {
// //     return await WalletModel.create(walletData);
// //   }

// //   async updateBalance(walletId, newBalance) {
// //     return await WalletModel.findOneAndUpdate(
// //       { walletId },
// //       { balance: newBalance },
// //       { new: true }
// //     );
// //   }
// // }

// // export default new WalletRepository();













// import Wallet from '../Models/WalletModels.mjs';

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
//   }
// };

// export default WalletRepository;






import Wallet from '../Models/WalletModels.mjs';
import IncomeLevelModel from '../Models/IncomeLevelModel.mjs';
import UserRepository from './UserRepository.mjs'; // needed for downline logic

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

  async findWalletByUserId(userId) {
    try {
      return await Wallet.findOne({ userId });
    } catch (error) {
      console.error('Error fetching wallet by userId:', error);
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

  // /**
  //  * Reward a user based on team size logic from IncomeLevel
  //  * @param {String} userId - The referrer user ID
  //  * @returns {Object} result info
  //  */
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
  }
};

export default WalletRepository;
