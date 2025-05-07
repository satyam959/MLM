import BankRepository from '../Repositories/BankAccountRepositories.mjs';

class BankController {
  // Create a new bank entry
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
  

  // In BankController.mjs
static async getAllBanks(req, res) {
  try {
    const { userId } = req.user; // Extract userId from token
    const bank = await BankRepository.getBankById(userId);

    if (!bank) {
      return res.status(404).json({ message: "No bank account found for this user" });
    }

    res.status(200).json({
      message: "Bank account fetched successfully",
      statusCode: 200,
      bank
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bank account",
      error: error.message
    });
  }
}


  // Get a single bank account (assuming one per user)
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

  // Update bank account
  static async updateBank(req, res) {
    try {
      const userId = req.user.userId;
      const updatedBank = await BankRepository.updateBank(userId, req.body);
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

  // Delete bank account
  static async deleteBank(req, res) {
    try {
      const userId = req.user.userId;
      const deletedBank = await BankRepository.deleteBank(userId);
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
}

export default BankController;
