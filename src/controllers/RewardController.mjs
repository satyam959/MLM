import RewardRepositories from '../Repositories/RewardRepositories.mjs';
import Reward from '../Models/RewardModels.mjs';
import { getUploadMiddleware } from '../middelware/UploadImage.mjs';
import WalletRepositories from '../Repositories/WalletRepositories.mjs';

class RewardController {
  static async createReward(req, res) {
    try {
      const { benefits, rankId, dailyRoyalty, description } = req.body;

      if (!dailyRoyalty || !benefits || !rankId) {
        return res.status(400).json({
          message: "rankId, benefits, and dailyRoyalty are required.",
        });
      }

      const image = req.file?.fullUrl || null;

      const reward = await RewardRepositories.createReward({
        dailyRoyalty,
        benefits,
        rankId,
        description,
        image,
      });

      res.status(201).json({
        message: "Reward created successfully!",
        data: reward,
      });
    } catch (error) {
      console.error("Error creating reward:", error);
      res.status(500).json({
        message: "Failed to create reward",
        error: error.message,
      });
    }
  }

  static async getAllRewards(req, res) {
    try {
      const rewards = await Reward.aggregate([
        {
          $lookup: {
            from: 'ranks',
            localField: 'rankId',
            foreignField: 'rankId',
            as: 'rankDetails'
          }
        },
        { $unwind: { path: '$rankDetails', preserveNullAndEmptyArrays: true } },
        { $addFields: { rankName: '$rankDetails.name' } },
        { $project: { rankDetails: 0 } }
      ]);

      res.status(200).json({
        message: 'Rewards fetched successfully!',
        data: rewards,
      });
    } catch (error) {
      console.error('Error fetching rewards:', error);
      res.status(500).json({ message: 'Failed to fetch rewards', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const reward = await RewardRepositories.findByRewardId(req.params.rewardId);

      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }

      res.status(200).json(reward);
    } catch (error) {
      console.error('Error fetching reward:', error);
      res.status(500).json({ message: 'Failed to fetch reward', error: error.message });
    }
  }

  static async updateReward(req, res) {
    try {
      const { rankId, dailyRoyalty, benefits } = req.body;
      const { rewardId } = req.params;

      const reward = await RewardRepositories.findByRewardId(rewardId);

      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }

      reward.rankId = rankId || reward.rankId;
      reward.dailyRoyalty = dailyRoyalty || reward.dailyRoyalty;
      reward.benefits = benefits || reward.benefits;

      await reward.save();

      res.status(200).json({
        message: 'Reward updated successfully!',
        data: reward,
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      res.status(500).json({ message: 'Failed to update reward', error: error.message });
    }
  }

  static async deleteReward(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await RewardRepositories.findByRewardId(rewardId);

      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }

      await RewardRepositories.deleteReward(rewardId);
      res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
      console.error('Error deleting reward:', error);
      res.status(500).json({ message: 'Failed to delete reward', error: error.message });
    }
  }

  static async getDailyRewardStats(req, res) {
    try {
      const { fromDate, toDate, transactionType } = req.query;
      if (!fromDate || !toDate || !transactionType) {
        return res.status(400).json({ message: "fromDate, toDate, and transactionType are required" });
      }
  
      function toUTCDate(dateStr, start) {
        const [d, m, y] = dateStr.split('-').map(Number);
        return start
          ? new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
          : new Date(Date.UTC(y, m - 1, d, 23, 59, 59));
      }
  
      const start = toUTCDate(fromDate, true);
      const end = toUTCDate(toDate, false);
  
      const records = await WalletRepositories.getDailyRewardStats(start, end, transactionType);
      const credits = records.filter(r => r.type === 'credit');
  
      const groupMap = new Map();
  
      for (const credit of credits) {
        const key = credit.createdAt.toISOString();
  
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            dateTime: key,
            amountGiven: 0,
            receivers: [],
            totalAmountDistributed: 0
          });
        }
  
        const group = groupMap.get(key);
        group.receivers.push({
          userId: credit.userId,
          userName: credit.userName || "User",
          amount: Number(credit.amount),
          rankName: credit.rankName || null,
        });
  
        group.amountGiven += Number(credit.amount);
        group.totalAmountDistributed += Number(credit.amount);
      }
  
      const responseData = Array.from(groupMap.values());
  
      return res.status(200).json({
        message: "Daily reward stats fetched successfully",
        statusCode: 200,
        data: responseData,
        totalUsersRewarded: credits.length
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch daily reward stats", error: err.message });
    }
  }  
}  
export default RewardController;
