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

// class RewardRepositories {
//   // Create a new reward
//   static async createReward({  benefits, rewardId,rankId,dailyRoyalty }) {
//     try {
//       const reward = new Reward({  benefits, rewardId ,rankId ,dailyRoyalty}); // Make sure rewardId is handled if needed
//       await reward.save();
//       return reward;
//     } catch (error) {
//       throw new Error('Error creating reward: ' + error.message);
//     }
//   }

//   // Get all rewards
//   static async getAllRewards() {
//     try {
//       const rewards = await Reward.find();
//       return rewards;
//     } catch (error) {
//       throw new Error('Error fetching rewards: ' + error.message);
//     }
//   }

//   // Find a reward by custom rewardId 
//   static async findByRewardId(rewardId) {
//     try {
//       const reward = await Reward.findOne({ rewardId: rewardId });  // 🔥 Corrected: use findOne, not findById
//       return reward;
//     } catch (error) {
//       throw new Error('Error finding reward: ' + error.message);
//     }
//   }

//   // Update a reward by custom rewardId
//   static async updateReward(rewardId, data) {
//     try {
//       const reward = await Reward.findOne({ rewardId: rewardId });  // 🔥 Corrected
//       if (!reward) throw new Error('Reward not found');

//       // Update the fields
//       reward.rank = data.rank || reward.rank;
//       reward.equivalentRank = data.equivalentRank || reward.equivalentRank;
//       reward.benefits = data.benefits || reward.benefits;

//       await reward.save();
//       return reward;
//     } catch (error) {
//       throw new Error('Error updating reward: ' + error.message);
//     }
//   }

//   static async findByRewardId(rewardId) {
//     try {
//       const reward = await Reward.findOne({ rewardId: rewardId });  // Custom rewardId field
//       return reward;
//     } catch (error) {
//       throw new Error('Error finding reward: ' + error.message);
//     }
//   }

//   // Delete Reward by RewardID (custom field)
//   static async deleteReward(rewardId) {
//     try {
//       const reward = await Reward.findOne({ rewardId: rewardId });  // Find the reward by custom field
//       if (!reward) throw new Error('Reward not found');

//       // Delete the reward from the database using rewardId
//       await Reward.deleteOne({ rewardId: rewardId });
//       return { message: 'Reward deleted successfully' };
//     } catch (error) {
//       throw new Error('Error deleting reward: ' + error.message);
//     }
//   }
// }

// export default RewardRepositories;



class RewardRepositories {
  
  // Create a new reward
static async createReward({  benefits, rankId, dailyRoyalty }) {
  const reward = new Reward({
    benefits,
    rankId,
    dailyRoyalty
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
