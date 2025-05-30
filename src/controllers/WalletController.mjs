import WalletRepository from '../Repositories/WalletRepositories.mjs';

class WalletController {
  // Create wallet only if it doesn't exist already
  static async create(req, res) {
    try {
      const { userId, balance } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const existingWallet = await WalletRepository.findByUserId(userId);

      if (existingWallet && existingWallet._id) {
        return res.status(400).json({
          message: "Wallet already exists for this user",
          data: existingWallet
        });
      }

      const parsedBalance = Number(balance);
      if (isNaN(parsedBalance)) {
        return res.status(400).json({ message: 'Balance must be a valid number' });
      }

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

  // Get wallet by logged-in user's ID
  static async getById(req, res) {
    try {
      const userId = req.user.userId;
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

  // Update wallet by ID
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

  // Delete wallet by ID
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

  // ✅ Get Admin Revenue (Daily, Monthly, Yearly, From-To)
  static async getAdminRevenue(req, res) {
    try {
      const { fromDate, toDate } = req.query;
  
      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "fromDate and toDate query parameters are required in DD-MM-YYYY format",
          statusCode: 400,
        });
      }
  
      const [fromDay, fromMonth, fromYear] = fromDate.split("-");
      const [toDay, toMonth, toYear] = toDate.split("-");
  
      const formattedFromDate = new Date(`${fromYear}-${fromMonth}-${fromDay}T00:00:00.000Z`);
      const formattedToDate = new Date(`${toYear}-${toMonth}-${toDay}T23:59:59.999Z`);
  
      if (isNaN(formattedFromDate) || isNaN(formattedToDate)) {
        return res.status(400).json({
          message: "Invalid date format. Use DD-MM-YYYY",
          statusCode: 400,
        });
      }
  
      const stats = await WalletRepository.getAdminRevenueStats({
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      });
  
      return res.status(200).json({
        message: "Admin revenue stats fetched successfully",
        statusCode: 200,
        data: stats.data,
        total: stats.total
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Server error while fetching admin revenue stats",
        statusCode: 500,
        error: err.message
      });
    }
  }
  static async getDailyPayout(req, res) {
    try {
      const { fromDate, toDate } = req.query;
  
      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "fromDate and toDate query parameters are required in DD-MM-YYYY format",
          statusCode: 400,
        });
      }
  
      const [fd, fm, fy] = fromDate.split("-");
      const [td, tm, ty] = toDate.split("-");
  
      const start = new Date(`${fy}-${fm}-${fd}T00:00:00.000Z`);
      const end = new Date(`${ty}-${tm}-${td}T23:59:59.999Z`);
  
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          message: "Invalid date format. Use DD-MM-YYYY",
          statusCode: 400,
        });
      }
  
      const data = await WalletRepository.getDailyPayoutHistory(start, end);
  
      return res.status(200).json({
        message: "Daily payout history fetched successfully",
        statusCode: 200,
        data: data
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Server error while fetching daily payout history",
        statusCode: 500,
        error: err.message
      });
    }
  }
}  
export default WalletController;