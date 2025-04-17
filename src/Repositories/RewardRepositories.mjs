import Reward from '../Models/RewardModels.mjs';

class RewardRepository {
  // Get all rewards
  async getAll() {
    return await Reward.find();
  }

  // Get reward by ID
  async getById(id) {
    return await Reward.findById(id);
  }

  // Create new reward
  async create(data) {
    const reward = new Reward(data);
    return await reward.save();
  }

  // Update reward by ID
  async update(rewardId, data) {
    return await Reward.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete reward by ID
  async remove(rewardId) {
    return await Reward.findByIdAndDelete(rewardId);
  }
}

// Export a single instance
export default new RewardRepository();
