import WalletRepository from '../Repositories/WalletRepositories.mjs';

class WalletController {
  // ✅ Create wallet
  // ✅ Create wallet only if it doesn't exist already
  static async create(req, res) {
    try {
      const { userId } = req.body;  // Assuming userId is passed in the body
      
      // ✅ Check if wallet already exists for the user
      const existingWallet = await WalletRepository.findByUserId(userId);
      
      if (existingWallet) {
        return res.status(400).json({
          message: "Wallet already exists for this user",
          data: existingWallet,  // Returning the existing wallet
        });
      }

      // If no wallet found, create a new one
      const { balance } = req.body;
      const parsedBalance = Number(balance);
      if (isNaN(parsedBalance)) {
        return res.status(400).json({ message: 'Balance must be a valid number' });
      }

      // Create new wallet
      const wallet = await WalletRepository.create({ userId, balance: parsedBalance });
      
      return res.status(201).json({
        message: 'Wallet created successfully',
        data: wallet
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Server error while creating wallet',
        error: err.message
      });
    }
  }

  
  // ✅ Get all wallets
  static async getAll(req, res) {
    try {
      const wallets = await WalletRepository.findAll();
      return res.status(200).json({ data: wallets });
    } catch (err) {
      return res.status(500).json({
        message: 'Server error while fetching wallets',
        error: err.message
      });
    }
  }

  // ✅ Get wallet by ID (Updated with debugging)
  static async getById(req, res) {
    try {
      const userId = req.user.userId; // Assuming userId comes from the authentication middleware
      console.log("Fetching wallet for userId:", userId); // Debugging log

      const wallet = await WalletRepository.findByUserId(userId);

      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      return res.status(200).json({ data: wallet });
    } catch (err) {
      return res.status(500).json({
        message: 'Server error while fetching wallet',
        error: err.message
      });
    }
  }

  // ✅ Update wallet balance
  static async update(req, res) {
    try {
      const { balance } = req.body;
      const parsedBalance = Number(balance);

      if (isNaN(parsedBalance)) {
        return res.status(400).json({ message: 'Balance must be a valid number' });
      }

      const updated = await WalletRepository.update(req.params.walletId, { balance: parsedBalance });

      if (!updated) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      return res.status(200).json({
        message: 'Wallet updated successfully',
        data: updated
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Server error while updating wallet',
        error: err.message
      });
    }
  }

  // ✅ Delete wallet
  static async delete(req, res) {
    try {
      const deleted = await WalletRepository.delete(req.params.walletId);

      if (!deleted) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      return res.status(200).json({
        message: 'Wallet deleted successfully',
        data: deleted
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Server error while deleting wallet',
        error: err.message
      });
    }
  }
}

export default WalletController;
