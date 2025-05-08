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
    static async getAllBanks() {
    return await Bank.find().sort({ isPrimary: -1 }); // Sort by isPrimary, with true accounts first
  }
  static async getBanksByUserId(userId) {
    return await Bank.find({ userId }).sort({ isPrimary: -1 }); 
  }
  static async getBankById(userId) {
    return await Bank.findOne({ userId });
  }
static async findbybankIdAndUpdate(bankId, updateData) {
  return await Bank.findOneAndUpdate(
    { bankId: Number(bankId) },
    updateData,
    { new: true }
  );
}
static async findbybankIdAndDelete(bankId) {
  return await Bank.findOneAndDelete({ bankId });
}
static async getBanksByUserId(userId) {
  return await Bank.find({ userId });
}

  static async unsetAllPrimary(userId) {
    return await Bank.updateMany({ userId }, { isPrimary: false });
  }

static async setPrimaryBank(bankId, userId) {
  await Bank.updateMany({ userId }, { isPrimary: false });

  // Then set the selected account as primary
  return await Bank.findOneAndUpdate(
    { bankId, userId },
    { isPrimary: true },
    { new: true }
  );
}

}

export default BankRepository;
