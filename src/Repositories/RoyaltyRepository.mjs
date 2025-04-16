import Royalty from '../models/RoyaltyModel.mjs';

class RoyaltyRepository {
  // Create a new royalty
  async create(data) {
    try {
      const royalty = new Royalty(data);
      return await royalty.save();
    } catch (error) {
      throw new Error(`Failed to create royalty: ${error.message}`);
    }
  }

  // Get all royalties
  async findAll() {
    try {
      return await Royalty.find();
    } catch (error) {
      throw new Error(`Failed to fetch royalties: ${error.message}`);
    }
  }

  // Get royalty by ID
  async findById(id) {
    try {
      const royalty = await Royalty.findById(id);
      if (!royalty) throw new Error('Royalty not found');
      return royalty;
    } catch (error) {
      throw new Error(`Failed to fetch royalty: ${error.message}`);
    }
  }

  // Update royalty
  async update(id, data) {
    try {
      const updated = await Royalty.findByIdAndUpdate(id, data, { new: true });
      if (!updated) throw new Error('Royalty not found');
      return updated;
    } catch (error) {
      throw new Error(`Failed to update royalty: ${error.message}`);
    }
  }

  // Delete royalty
  async delete(id) {
    try {
      const deleted = await Royalty.findByIdAndDelete(id);
      if (!deleted) throw new Error('Royalty not found');
      return deleted;
    } catch (error) {
      throw new Error(`Failed to delete royalty: ${error.message}`);
    }
  }
}

export default new RoyaltyRepository();
