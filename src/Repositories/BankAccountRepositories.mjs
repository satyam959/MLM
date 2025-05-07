import { Bank } from '../Models/BankAccountModel.mjs';

class BankRepository {
  // Create a new bank entry with duplicate account number check
  static async createBank(data) {
    const existing = await Bank.findOne({ accountNumber: data.accountNumber });
    if (existing) {
      throw new Error('This account number already exists.');
    }

    const bank = new Bank(data);
    return await bank.save();
  }

  // Get all bank accounts
  static async getAllBanks() {
    return await Bank.find();
  }

  // Get a bank account by userId
  static async getBankById(userId) {
    return await Bank.findOne({ userId });
  }

  // Update bank account by userId
  static async updateBank(userId, updateData) {
    return await Bank.findOneAndUpdate({ userId }, updateData, { new: true });
  }

  // Delete bank account by userId
  static async deleteBank(userId) {
    return await Bank.findOneAndDelete({ userId });
  }
}

export default BankRepository;
