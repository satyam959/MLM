import BankRepository from '../Repositories/BankAccountRepositories.mjs';

class BankController {
  // Create a new bank entry
  static async createBank(req, res) {
    try {
      const bank = await BankRepository.createBank(req.body);
      res.status(201).json({ message: 'Bank account created', bank });
    } catch (error) {
      res.status(500).json({ message: 'Error creating bank account', error: error.message });
    }
  }

  // Get all bank accounts
  static async getAllBanks(req, res) {
    try {
      const banks = await BankRepository.getAllBanks();
      res.status(200).json(banks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bank accounts', error: error.message });
    }
  }

  // Get a single bank account by ID
  static async getBankById(req, res) {
    try {
      const { userId } = req.params;
      const bank = await BankRepository.getBankById(userId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
      res.status(200).json(bank);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bank account', error: error.message });
    }
  }

  // Update bank account
  static async updateBank(req, res) {
    try {
      const { userId } = req.params;
      const updatedBank = await BankRepository.updateBank(userId, req.body);
      if (!updatedBank) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
      res.status(200).json({ message: 'Bank account updated', updatedBank });
    } catch (error) {
      res.status(500).json({ message: 'Error updating bank account', error: error.message });
    }
  }

  // Delete bank account
  static async deleteBank(req, res) {
    try {
      const { userId } = req.params;
      const deletedBank = await BankRepository.deleteBank(userId);
      if (!deletedBank) {
        return res.status(404).json({ message: 'Bank account not found' });
      }
      res.status(200).json({ message: 'Bank account deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting bank account', error: error.message });
    }
  }
}

export default BankController;
