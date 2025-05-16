import UserReward from '../../Models/UserRewardModels.mjs';
import Reward from '../../Models/RewardModels.mjs';
class UserRewardRepo {
  async getAllByUserId(userId) {
    return await UserReward.find({ userId });
  }
  // ✅ Add this method
  async create(userRewardData) {
    const newUserReward = new UserReward(userRewardData);
    return await newUserReward.save();
  }
}

export default new UserRewardRepo();
