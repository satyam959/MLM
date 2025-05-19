import Reward from "../Models/RewardModels.mjs";
class RewardRepositories {
  
  // Create a new reward
static async createReward({  benefits, rankId, dailyRoyalty,description,image }) {
  const reward = await Reward.create({
    dailyRoyalty,
    benefits,
    rankId,
    description,
    image,
  });
  
  return await reward.save();
}


  // Get all rewards
  static async getAllRewards() {
    return await Reward.find();
  }

  // Find reward by custom rewardId
  static async findByRewardId(rewardId) {
    return await Reward.findOne({ rewardId: String(rewardId) });
  }

  // Update reward by rewardId
  static async updateReward(rewardId, updateData) {
    return await Reward.findOneAndUpdate(
      { rewardId: String(rewardId) },
      { $set: updateData },
      { new: true }
    );
  }

  // Delete reward by rewardId
  static async deleteReward(rewardId) {
    return await Reward.findOneAndDelete({ rewardId: String(rewardId) });
  }
}

export default RewardRepositories;
