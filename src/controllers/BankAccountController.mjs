import BankRepository from '../Repositories/BankAccountRepositories.mjs';

class BankController {
  static async createBank(req, res) {
    
    try {
      const userId = req.user.userId;
      const bank = await BankRepository.createBank({ ...req.body, userId });
      res.status(201).json({
        message: 'Bank account created successfully',
        statusCode: 201,
        data: bank,
      });
    } catch (error) {
      const isDuplicate = error.message.includes('already exists');
      res.status(isDuplicate ? 409 : 500).json({
        message: isDuplicate ? 'Bank account already exists with this account number.' : 'Error creating bank account',
        error: error.message,
      });
    }
  }
    static async getAllBanks(req, res) {
    try {
      const { userId } = req.user; 
      const banks = await BankRepository.getBanksByUserId(userId); 
  
      if (!banks || banks.length === 0) {
        return res.status(404).json({ message: "No bank accounts found for this user" });
      }
  
      res.status(200).json({
        message: "Bank accounts fetched successfully",
        statusCode: 200,
        banks
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching bank accounts",
        error: error.message
      });
    }
  }
    static async getBankById(req, res) {
    try {
      const userId = req.user.userId;
      const bank = await BankRepository.getBankById(userId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
      res.status(200).json({
        message: 'Bank account fetched successfully',
        statusCode: 200,
        data: bank,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching bank account',
        error: error.message,
      });
    }
  }
static async updateBank(req, res) {
  try {
    const userId = req.user.userId; 
    const bankId = req.params.bankId;
    const updateData = req.body;

    const updatedBank = await BankRepository.findbybankIdAndUpdate(bankId, updateData);

    if (!updatedBank) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.status(200).json({
      message: 'Bank account updated successfully',
      statusCode: 200,
      data: updatedBank,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating bank account',
      error: error.message,
    });
  }
}
  static async deleteBank(req, res) {
    try {
      const userId = req.user.userId;
      const bankId = req.params.bankId;
  
      const deletedBank = await BankRepository.findbybankIdAndDelete(bankId);
  
      if (!deletedBank) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
  
      res.status(200).json({
        message: 'Bank account deleted successfully',
        statusCode: 200,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting bank account',
        error: error.message,
      });
    }
  }
  
  static async setPrimaryBank(req, res) {
    try {
      const bankId = Number(req.params.bankId); 
      const { userId } = req.user; 
        await BankRepository.unsetAllPrimary(userId);
        const updated = await BankRepository.setPrimaryBank(bankId, userId);
  
      if (!updated) {
        return res.status(404).json({ message: 'Bank account not found or not authorized' });
      }
  
      return res.status(200).json({
        message: 'Primary bank account set successfully',
        statusCode: 200,
        data: updated
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Error setting primary bank account',
        error: err.message
      });
    }
  }
  
}

export default BankController;
