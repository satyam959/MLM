import RoyaltyRepository from '../Repositories/RoyaltyRepository.mjs';
import WalletRepository from '../Repositories/WalletRepositories.mjs'; // fixed import name to singular
import User from '../Models/UserModels.mjs'; // User model (correct import)
import Rank from '../Models/RankModels.mjs'; // Rank model if needed for other methods

class RoyaltyController {
  
  static async createRoyalty(req, res) {
    try {
      const { rank, dailyRoyalty, status } = req.body;
      const newRoyalty = await RoyaltyRepository.createRoyalty({ rank, dailyRoyalty, status });

      res.status(201).json({
        message: 'Royalty created successfully',
        royalty: newRoyalty
      });
    } catch (error) {
      res.status(500).json({
        message: `Error creating royalty: ${error.message}`
      });
    }
  }

  static async getAllRoyalties(req, res) {
    try {
      const royalties = await RoyaltyRepository.getAllRoyalties();
      res.status(200).json({
        message: 'Royalties fetched successfully',
        data: royalties
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching royalties',
        error: error.message
      });
    }
  }

  static async getRoyaltyById(req, res) {
    try {
      const { royaltyId } = req.params;
      const royalty = await RoyaltyRepository.getRoyaltyById(royaltyId);
      if (!royalty) {
        return res.status(404).json({ message: 'Royalty not found' });
      }
      res.status(200).json(royalty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateRoyaltyById(req, res) {
    try {
      const { royaltyId } = req.params;
      const { rank, dailyRoyalty, status } = req.body;

      const updatedRoyalty = await RoyaltyRepository.updateRoyaltyById(royaltyId, {
        rank,
        dailyRoyalty,
        status
      });

      if (!updatedRoyalty) {
        return res.status(404).json({ message: 'Royalty not found' });
      }

      res.status(200).json({
        message: 'Royalty updated successfully',
        data: updatedRoyalty
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating royalty',
        error: error.message
      });
    }
  }

  static async deleteRoyaltyById(req, res) {
    try {
      const { royaltyId } = req.params;
      const result = await RoyaltyRepository.deleteRoyaltyById(royaltyId);

      if (!result) {
        return res.status(404).json({ message: 'Royalty not found' });
      }

      res.status(200).json({ message: 'Royalty deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRoyaltyDistributionStats(req, res) {
    try {
      const { fromDate, toDate } = req.query;

      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "fromDate and toDate are required"
        });
      }

      function toUTC(dateStr, isStart) {
        const [d, m, y] = dateStr.split("-").map(Number);
        return isStart
          ? new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
          : new Date(Date.UTC(y, m - 1, d, 23, 59, 59));
      }

      const start = toUTC(fromDate, true);
      const end = toUTC(toDate, false);

      // Fetch royalty credit transactions from WalletHistory repo method
      const records = await WalletRepository.getRoyaltyHistory(start, end);

      if (!records.length) {
        return res.status(200).json({
          message: "No royalty transactions found in the given date range",
          data: [],
          totalUserRoyalty: 0
        });
      }

      // Extract unique numeric userIds from records
      const userIds = [...new Set(records.map(r => r.userId))];

      // Query users by numeric userId field (NOT _id)
      const users = await User.find({ userId: { $in: userIds } }).populate('rankId');

      // Map userId to user info (name, rankName)
      const userMap = new Map();
      for (const user of users) {
        userMap.set(user.userId, {
          name: user.name || 'User',
          rankName: user.rankId ? user.rankId.rankName : null
        });
      }

      // Group transactions by date yyyy-mm-dd
      const grouped = new Map();

      for (const tx of records) {
        const dateKey = new Date(tx.createdAt).toISOString().split("T")[0];

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, {
            dateTime: tx.createdAt,
            amountGiven: 0,
            receivers: [],
            totalAmountDistributed: 0
          });
        }

        const group = grouped.get(dateKey);
        const userInfo = userMap.get(tx.userId) || { name: 'User', rankName: null };

        group.receivers.push({
          userId: tx.userId,
          userName: userInfo.name,
          amount: Number(tx.amount),
          rankName: userInfo.rankName
        });

        group.totalAmountDistributed += Number(tx.amount);
        group.amountGiven += Number(tx.amount);
      }

      const responseData = Array.from(grouped.values());

      return res.status(200).json({
        message: "Royalty distribution stats fetched successfully",
        statusCode: 200,
        data: responseData,
        totalUserRoyalty: records.length
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to fetch royalty distribution stats",
        error: error.message
      });
    }
  }
}

export default RoyaltyController;
