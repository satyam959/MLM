import Wallet from '../Models/WalletModels.mjs';

const WalletRepository = {
  async findAll() {
    return await Wallet.find();
  },

  async findById(id) {
    return await Wallet.findById(id);
  },

  async create(data) {
    const wallet = new Wallet(data);
    return await wallet.save();
  },

  async update(id, data) {
    return await Wallet.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await Wallet.findByIdAndDelete(id);
  }
};

export default WalletRepository;
