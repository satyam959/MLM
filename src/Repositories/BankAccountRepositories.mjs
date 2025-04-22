import  {Bank}  from '../Models/BankAccountModel.mjs';

class BankRepository {
  // Create a new bank account
  static async createBank(data) {
    const bank = new Bank(data);
    return await bank.save();
  }

  // Get all bank accounts
  static async getAllBanks() {
    return await Bank.find();
  }

  // Get a bank account by userId (custom field)
  static async getBankById(userId) {
    return await Bank.findOne({ userId });
  }

  // Update a bank account by userId
  static async updateBank(userId, updateData) {
    return await Bank.findOneAndUpdate({ userId }, updateData, { new: true });
  }

  // Delete a bank account by userId
  static async deleteBank(userId) {
    return await Bank.findOneAndDelete({ userId });
  }
}

export default BankRepository;
