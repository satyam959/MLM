import Wallet from '../Models/WalletModels.mjs';

class WalletRepo {
  // Create a new wallet
  async createWallet(data) {
    return await Wallet.create(data);
  }

  // Get all wallets
  async getAllWallets() {
    return await Wallet.find();
  }

  // Get a wallet by its MongoDB _id
  async getWalletById(id) {
    return await Wallet.findById(id);
  }

  // ✅ Get wallet(s) by userId
  async getWalletByUserId(userId) {
    return await Wallet.find({ userId });
  }

  // Update a wallet by userId
async updateWallet(userId, data) {
    return await Wallet.findOneAndUpdate(
      { userId: parseInt(userId) },
      data,
      { new: true }
    );
  }
  
  // Delete a wallet by userId
  async deleteWallet(userId) {
    return await Wallet.findOneAndDelete({ userId: parseInt(userId) });
  }
  
}  
export default new WalletRepo();
