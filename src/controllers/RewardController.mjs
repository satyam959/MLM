// import rewardRepo from '../Repositories/RewardRepositories.mjs';

// class RewardController {

// // Create a new reward
// async create(req, res) {
//     try {
//       const reward = await rewardRepo.create(req.body);
//       res.status(201).json(reward);
//     } catch (error) {
//       console.error('Error creating reward:', error);
//       res.status(400).json({ message: 'Failed to create reward', error: error.message });
//     }
//   }
//   // Get all rewards
//   async getAll(req, res) {
//     try {
//       const rewards = await rewardRepo.getAll();
//       res.status(200).json(rewards);
//     } catch (error) {
//       console.error('Error fetching rewards:', error);
//       res.status(500).json({ message: 'Failed to fetch rewards', error: error.message });
//     }
//   }

//   // Get reward by ID
//   async getById(req, res) {
//     try {
//       const reward = await rewardRepo.getById(req.params.rewardId);
//       if (!reward) {
//         return res.status(404).json({ message: 'Reward not found' });
//       }
//       res.status(200).json(reward);
//     } catch (error) {
//       console.error(`Error fetching reward with ID ${req.params.id}:`, error);
//       res.status(500).json({ message: 'Failed to fetch reward', error: error.message });
//     }
//   }

//   async updateRole(req, res) {
//     try {
//       const updatedRole = await roleRepository.updateRole(req.params.roleId, req.body);
//       if (!updatedRole) {
//         return res.status(404).json({ error: 'Role not found' });
//       }
//       res.status(200).json(updatedRole);
//     } catch (err) {
//       console.error('Update Role Error:', err.message);
//       res.status(400).json({ error: err.message });
//     }
//   }
  

//   // Delete a reward by ID
//   async delete(req, res) {
//     try {
//       const reward = await rewardRepo.remove(req.params.rewardId);
//       if (!reward) {
//         return res.status(404).json({ message: 'Reward not found' });
//       }
//       res.status(200).json({ message: 'Reward deleted successfully' });
//     } catch (error) {
//       console.error(`Error deleting reward with ID ${req.params.rewardId}:`, error);
//       res.status(500).json({ message: 'Failed to delete reward', error: error.message });
//     }
//   }
// }

// // Export an instance of the controller
// export default new RewardController();



import RewardRepository from '../Repositories/RewardRepositories.mjs';

class RewardController {
  // Create a new reward
  async createReward(req, res) {
    try {
      const { name, reward, value } = req.body;

      if (!name || !reward) {
        return res.status(400).json({ message: 'Name and Reward are required fields' });
      }

      // Log incoming data to check if it's correct
      console.log('Received reward data:', req.body);

      const newReward = await RewardRepository.createReward({ name, reward, value });

      return res.status(201).json(newReward);
    } catch (error) {
      console.error('Error creating reward:', error);

      // If the error is from the repository, let's send a more informative message.
      if (error instanceof Error) {
        return res.status(500).json({
          message: 'Failed to create reward',
          error: error.message || 'Unknown error',
        });
      }

      return res.status(500).json({ message: 'Unexpected error occurred', error });
    }
  }

  // Other CRUD methods...


  // Get all rewards
  async getAllRewards(req, res) {
    try {
      const rewards = await RewardRepository.getAllRewards();
      return res.status(200).json(rewards);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve rewards', error });
    }
  }

  // Get a single reward by ID
  async getRewardById(req, res) {
    try {
      const reward = await RewardRepository.getRewardById(req.params.roleId);
      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }
      return res.status(200).json(reward);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve reward', error });
    }
  }

 // Update a reward by rewardId
async updateReward(req, res) {
  try {
    // Get the rewardId from the URL params and the update data from the request body
    const rewardId = req.params.rewardId;
    const updateData = req.body;

    // Validate that rewardId exists in the params
    if (!rewardId) {
      return res.status(400).json({ message: 'Reward ID is required' });
    }

    // Use the repository to update the reward
    const updatedReward = await RewardRepository.updateReward(rewardId, updateData);

    // If no reward was found with the given ID, return 404
    if (!updatedReward) {
      return res.status(404).json({ message: 'Reward not found', details: 'No reward found with the specified rewardId.' });
    }

    // Return the updated reward with a success message
    return res.status(200).json({
      message: 'Reward updated successfully',
      updatedReward,
    });
  } catch (error) {
    console.error('Error updating reward:', error);
    return res.status(500).json({
      message: 'Failed to update reward',
      error: error.message || 'Unknown error',
    });
  }
}

// Delete a reward by rewardId
async deleteReward(req, res) {
  try {
    // Get the rewardId from the URL params
    const rewardId = req.params.rewardId;

    // Validate that rewardId exists in the params
    if (!rewardId) {
      return res.status(400).json({ message: 'Reward ID is required' });
    }

    // Use the repository to delete the reward
    const deletedReward = await RewardRepository.deleteReward(rewardId);

    // If no reward was found with the given ID, return 404
    if (!deletedReward) {
      return res.status(404).json({ message: 'Reward not found', details: 'No reward found with the specified rewardId.' });
    }

    // Return success message for successful deletion
    return res.status(200).json({
      message: 'Reward deleted successfully',
      deletedReward,
    });
  } catch (error) {
    console.error('Error deleting reward:', error);
    return res.status(500).json({
      message: 'Failed to delete reward',
      error: error.message || 'Unknown error',
    });
  }
}



  // Create multiple rewards at once
  async createMultipleRewards(req, res) {
    try {
      const rewardsData = req.body.rewards; // Array of reward objects
      const rewards = await RewardRepository.createMultipleRewards(rewardsData);
      return res.status(201).json(rewards);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create multiple rewards', error });
    }
  }
}

export default new RewardController();
