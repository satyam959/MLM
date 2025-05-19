import RewardRepositories from '../Repositories/RewardRepositories.mjs';
import Reward from '../Models/RewardModels.mjs';
import { getUploadMiddleware } from '../middelware/UploadImage.mjs';
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
            from: 'ranks', // Collection name in MongoDB
            localField: 'rankId',
            foreignField: 'rankId',
            as: 'rankDetails'
          }
        },
        {
          $unwind: {
            path: '$rankDetails',
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $addFields: {
            rankName: '$rankDetails.name'
          }
        },
        {
          $project: {
            rankDetails: 0 
          }
        }
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


  // Get reward by ID
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

 // Update reward by ID
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
      const { rewardId } = req.params;  // Get rewardId from the route parameters

      // Find reward by rewardId
      const reward = await RewardRepositories.findByRewardId(rewardId);
      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }

      // Delete the reward from database
      await RewardRepositories.deleteReward(rewardId);
      res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
      console.error('Error deleting reward:', error);
      res.status(500).json({ message: 'Failed to delete reward', error: error.message });
    }
  }
}
export default RewardController
