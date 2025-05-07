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
    return await Bank.find().sort({ isPrimary: -1 }); // Sort by isPrimary, with true accounts first
  }

  // Get all bank accounts for a specific user
  static async getBanksByUserId(userId) {
    return await Bank.find({ userId }).sort({ isPrimary: -1 }); // Sort by isPrimary, with true accounts first
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

  // Unset all primary accounts for a user
  static async unsetAllPrimary(userId) {
    return await Bank.updateMany({ userId }, { isPrimary: false });
  }

  // Set the selected account as primary
  static async setPrimaryBank(bankId, userId) {
    // First, unset all primary accounts for the user
    await Bank.updateMany({ userId }, { isPrimary: false });

    // Then, set the selected bank account as primary
    return await Bank.findOneAndUpdate(
      { bankId, userId },
      { isPrimary: true },
      { new: true }
    );
  }
}

export default BankRepository;
