// import WalletRepository from '../Repositories/WalletRepositories.mjs';

// class WalletController {
//   // Create wallet (only balance)
//   static async create(req, res) {
//     try {
//       const { balance } = req.body;

//       // Check if balance is provided and is a valid number
//       if (balance == null || isNaN(balance)) {
//         return res.status(400).json({ message: 'Valid balance is required' });
//       }

//       const wallet = await WalletRepository.create({ balance });
//       return res.status(201).json({
//         message: 'Wallet created successfully',
//         data: wallet
//       });
//     } catch (err) {
//       return res.status(500).json({
//         message: 'Server error while creating wallet',
//         error: err.message
//       });
//     }
//   }

//   // Get all wallets
//   static async getAll(req, res) {
//     try {
//       const wallets = await WalletRepository.findAll();
//       return res.status(200).json({ data: wallets });
//     } catch (err) {
//       return res.status(500).json({
//         message: 'Server error while fetching wallets',
//         error: err.message
//       });
//     }
//   }

//   // Get wallet by ID
//   static async getById(req, res) {
//     try {
//       const wallet = await WalletRepository.findById(req.params.id);

//       if (!wallet) {
//         return res.status(404).json({ message: 'Wallet not found' });
//       }

//       return res.status(200).json({ data: wallet });
//     } catch (err) {
//       return res.status(500).json({
//         message: 'Server error while fetching wallet',
//         error: err.message
//       });
//     }
//   }

//   // Update wallet balance
//   static async update(req, res) {
//     try {
//       const { balance } = req.body;

//       if (balance == null || isNaN(balance)) {
//         return res.status(400).json({ message: 'Valid balance is required for update' });
//       }

//       const updated = await WalletRepository.update(req.params.id, { balance });

//       if (!updated) {
//         return res.status(404).json({ message: 'Wallet not found' });
//       }

//       return res.status(200).json({
//         message: 'Wallet updated successfully',
//         data: updated
//       });
//     } catch (err) {
//       return res.status(500).json({
//         message: 'Server error while updating wallet',
//         error: err.message
//       });
//     }
//   }

//   // Delete wallet
//   static async delete(req, res) {
//     try {
//       const deleted = await WalletRepository.delete(req.params.id);

//       if (!deleted) {
//         return res.status(404).json({ message: 'Wallet not found' });
//       }

//       return res.status(200).json({
//         message: 'Wallet deleted successfully',
//         data: deleted
//       });
//     } catch (err) {
//       return res.status(500).json({
//         message: 'Server error while deleting wallet',
//         error: err.message
//       });
//     }
//   }
// }

// export default WalletController;
import WalletRepository from '../Repositories/WalletRepositories.mjs';

class WalletController {
  // Create wallet
  static async create(req, res) {
    try {
      const { balance } = req.body;

      // Validate balance is a number
      const parsedBalance = parseFloat(balance);
      if (isNaN(parsedBalance)) {
        return res.status(400).json({ message: 'Valid balance is required' });
      }

      const wallet = await WalletRepository.create({ balance: parsedBalance });
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

  // Get all wallets
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

  // Get wallet by ID
  static async getById(req, res) {
    try {
      const wallet = await WalletRepository.findById(req.params.id);
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

  // Update wallet balance
  static async update(req, res) {
    try {
      const { balance } = req.body;

      const parsedBalance = parseFloat(balance);
      if (isNaN(parsedBalance)) {
        return res.status(400).json({ message: 'Valid balance is required for update' });
      }

      const updated = await WalletRepository.update(req.params.id, { balance: parsedBalance });

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

  // Delete wallet
  static async delete(req, res) {
    try {
      const deleted = await WalletRepository.delete(req.params.id);

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
