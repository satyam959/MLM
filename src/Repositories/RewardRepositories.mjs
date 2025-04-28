// import Reward from '../Models/RewardModels.mjs';

// class RewardRepository {
//   // Get all rewards
//   async getAll() {
//     return await Reward.find();
//   }

//   // Get reward by ID
//   async getById(rewardId) {
//     return await Reward.findById(rewardId);
//   }

//   // Create new reward
//   async create(data) {
//     const reward = new Reward(data);
//     return await reward.save();
//   }

//   // Update reward by ID
//   async update(rewardId, data) {
//     return await Reward.findByIdAndUpdate(rewardId, data, { new: true });
//   }

//   // Delete reward by ID
//   async remove(rewardId) {
//     return await Reward.findByIdAndDelete(rewardId);
//   }
// }

// // Export a single instance
// export default new RewardRepository();


// import Reward from '../Models/RewardModels.mjs';

// class RewardRepository {
//    // Create a new reward
//    async createReward(data) {
//     try {
//       console.log('Creating reward with data:', data);

//       const newReward = new Reward(data);
//       const savedReward = await newReward.save();  // Save the new reward to the database
//       console.log('Reward saved successfully:', savedReward);

//       return savedReward; // Return the saved reward
//     } catch (error) {
//       console.error('Error saving reward:', error);

//       // Specific MongoDB or validation error handling
//       if (error.name === 'ValidationError') {
//         throw new Error('Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', '));
//       }

//       throw new Error('Failed to create reward: ' + (error.message || error));
//     }
//   }

//   // Other methods (getAllRewards, getRewardById, etc.)...


//   // Other methods (getAllRewards, getRewardById, etc.)...


//   // Get all rewards
//   async getAllRewards() {
//     try {
//       return await Reward.find();
//     } catch (error) {
//       throw new Error('Failed to retrieve rewards');
//     }
//   }

//   // Get a reward by ID
//   async getRewardById(id) {
//     try {
//       return await Reward.findById(id);
//     } catch (error) {
//       throw new Error('Failed to retrieve reward');
//     }
//   }

//   // Update a reward by rewardId
//   async updateReward(rewardId, updateData) {
//     try {
//       // Find the reward by rewardId and update it
//       const updatedReward = await Reward.findOneAndUpdate(
//         { rewardId: rewardId },  // Search for the reward by rewardId
//         { $set: updateData },    // Update the fields in the document
//         { new: true }            // Return the updated document
//       );
//       return updatedReward;
//     } catch (error) {
//       console.error('Error updating reward:', error);
//       throw new Error('Failed to update reward');
//     }
//   }

//   // Delete a reward by rewardId
//   async deleteReward(rewardId) {
//     try {
//       // Find the reward by rewardId and delete it
//       const deletedReward = await Reward.findOneAndDelete({ rewardId: rewardId });
//       return deletedReward;
//     } catch (error) {
//       console.error('Error deleting reward:', error);
//       throw new Error('Failed to delete reward');
//     }
//   }

//   // Create multiple rewards at once
//   async createMultipleRewards(rewards) {
//     try {
//       return await Reward.insertMany(rewards);
//     } catch (error) {
//       throw new Error('Failed to create multiple rewards');
//     }
//   }
// }

// export default new RewardRepository();







import Reward from "../Models/RewardModels.mjs";

class RewardRepositories {
  static async createReward({ rank, equivalentRank, benefits }) {
    try {
      
      const reward = new Reward({ rank, equivalentRank, benefits });
      await reward.save();  
      return reward;  
    } catch (error) {
      throw new Error('Error saving reward: ' + error.message);  
    }
  }

  static async getAllRewards() {
    try {
      const rewards = await Reward.find();  
      return rewards;
    } catch (error) {
      throw new Error('Error fetching rewards: ' + error.message);  
    }
  }

  
    
  
export default RewardRepositories;  

