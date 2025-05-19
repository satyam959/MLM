import mongoose from "mongoose";
import UserReward from "../../Models/UserRewardModels.mjs";
import userRewardRepo from "../../Repositories/user/UserRewardRepositories.mjs";
import RewardRepositories from '../../Repositories/RewardRepositories.mjs';

class UserRewardController {
  static async createUserReward(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { rewardId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User ID missing in token",
          statusCode: 401,
        });
      }

      if (!rewardId) {
        return res.status(400).json({
          success: false,
          message: "Bad Request: rewardId is required",
          statusCode: 400,
        });
      }

      const userRewardData = {
        userId, // token se aaya userId
        rewardId,
        status: "achieve",
      };

      const newUserReward = await userRewardRepo.create(userRewardData);

      const responseData = {
        rewardId: newUserReward.rewardId,
        status: newUserReward.status,
      };

      res.status(201).json({
        success: true,
        message: "UserReward created successfully",
        statusCode: 201,
        data: responseData,
      });
    } catch (error) {
      console.error("Error creating UserReward:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create UserReward",
        error: error.message,
        statusCode: 500,
      });
    }
  }

  // Get all user rewards filtered by userId and rewardId
  static async getAllUserRewards(req, res) {
    try {
      const userId = req.user?.userId;
      const getUserRewards = await userRewardRepo.getAllByUserId(userId);
      const allRewards = await RewardRepositories.getAllRewards();

      const achievedRewardIds = new Set(getUserRewards.map(r => r.rewardId.toString()));

      const userRewards = allRewards.map(r => {
        const reward = r.toObject(); // remove mongoose internal fields
        return {
          ...reward,
          rewardStatus: achievedRewardIds.has(reward.rewardId.toString())
            ? 'Achieved'
            : 'Unachieved'
        };
      });

      res.json({
        success: true,
        message: "User rewards fetched successfully",
        statusCode: 200,
        data: userRewards
      });

    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user rewards",
        error: error.message,
        statusCode: 500,
      });
    }
  }
}

export default UserRewardController;
