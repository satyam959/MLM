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
//   }
// };

// export default WalletRepository;


import Wallet from '../Models/WalletModels.mjs';

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
    return await Wallet.findOne({ walletId });  // ✅ WalletModel → Wallet
  },

  async createWallet(walletData) {
    const wallet = new Wallet(walletData);
    return await wallet.save();
  },
  async updateBalance(walletId, newBalance) {
    return await Wallet.findOneAndUpdate(       // ✅ WalletModel → Wallet
      { walletId },
      { balance: newBalance },
      { new: true }
    );
  }
};

export default WalletRepository;



// import WalletModel from '../Models/WalletModels.mjs';

// class WalletRepository {
  
//   async findByWalletId(walletId) {
//     return await WalletModel.findOne({ walletId });
//   }

//   async createWallet(walletData) {
//     return await WalletModel.create(walletData);
//   }

//   async updateBalance(walletId, newBalance) {
//     return await WalletModel.findOneAndUpdate(
//       { walletId },
//       { balance: newBalance },
//       { new: true }
//     );
//   }
// }

// export default new WalletRepository();
