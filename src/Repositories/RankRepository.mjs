import Rank from '../Models/RankModels.mjs';

class RankRepository {
  // Create a new rank
  static async create(data) {
    try {
      const rank = new Rank(data);
      await rank.save();
      return rank;
    } catch (error) {
      console.error('Error creating rank:', error);
      throw new Error('Error creating rank: ' + error.message);
    }
  }

  // Get all ranks
  static async findAll() {
    try {
      return await Rank.find();
    } catch (error) {
      console.error('Error fetching ranks:', error);
      throw new Error('Error fetching ranks: ' + error.message);
    }
  }

  // Find a rank by ID
  static async findById(rankId) {
    try {
      const rank = await Rank.findById(rankId);
      if (!rank) {
        throw new Error('Rank not found');
      }
      return rank;
    } catch (error) {
      console.error('Error finding rank by ID:', error);
      throw new Error('Error finding rank: ' + error.message);
    }
  }

  // Find a rank by name
  static async findByName(name) {
    try {
      const rank = await Rank.findOne({ name });
      if (!rank) {
        throw new Error('Rank not found');
      }
      return rank;
    } catch (error) {
      console.error('Error finding rank by name:', error);
      throw new Error('Error finding rank: ' + error.message);
    }
  }

  
  // Update by custom rankId
  static async update(rankId, data) {
    try {
      const updated = await Rank.findOneAndUpdate({ rankId }, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new Error('Rank not found for update');
      }

      return updated;
    } catch (error) {
      console.error(`Error updating rank with rankId (${rankId}):`, error);
      throw new Error('Error updating rank: ' + error.message);
    }
  }

  // Delete by custom rankId
  static async delete(rankId) {
    try {
      const deleted = await Rank.findOneAndDelete({ rankId });

      if (!deleted) {
        throw new Error('Rank not found for deletion');
      }

      return deleted;
    } catch (error) {
      console.error(`Error deleting rank with rankId (${rankId}):`, error);
      throw new Error('Error deleting rank: ' + error.message);
    }
  }
}



export default RankRepository;
