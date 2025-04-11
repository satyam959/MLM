import rewardRepo from '../Repositories/RewardRepositories.mjs';

class RewardController {

// Create a new reward
async create(req, res) {
    try {
      const reward = await rewardRepo.create(req.body);
      res.status(201).json(reward);
    } catch (error) {
      console.error('Error creating reward:', error);
      res.status(400).json({ message: 'Failed to create reward', error: error.message });
    }
  }
  // Get all rewards
  async getAll(req, res) {
    try {
      const rewards = await rewardRepo.getAll();
      res.status(200).json(rewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      res.status(500).json({ message: 'Failed to fetch rewards', error: error.message });
    }
  }

  // Get reward by ID
  async getById(req, res) {
    try {
      const reward = await rewardRepo.getById(req.params.id);
      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }
      res.status(200).json(reward);
    } catch (error) {
      console.error(`Error fetching reward with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch reward', error: error.message });
    }
  }

  // Update a reward by ID
  async update(req, res) {
    try {
      const reward = await rewardRepo.update(req.params.id, req.body);
      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }
      res.status(200).json(reward);
    } catch (error) {
      console.error(`Error updating reward with ID ${req.params.id}:`, error);
      res.status(400).json({ message: 'Failed to update reward', error: error.message });
    }
  }

  // Delete a reward by ID
  async delete(req, res) {
    try {
      const reward = await rewardRepo.remove(req.params.id);
      if (!reward) {
        return res.status(404).json({ message: 'Reward not found' });
      }
      res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
      console.error(`Error deleting reward with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete reward', error: error.message });
    }
  }
}

// Export an instance of the controller
export default new RewardController();
