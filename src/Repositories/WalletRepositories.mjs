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
  }
};

export default WalletRepository;
