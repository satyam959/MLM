// src/repositories/RoyaltyRepository.mjs

import Royalty from '../Models/RoyaltyModel.mjs'; // Adjust path if needed

class RoyaltyRepository {
  // Create a new royalty record
  static async create(data) {
    try {
      const royalty = new Royalty(data);
      await royalty.save();
      return royalty;
    } catch (error) {
      console.error('Error creating royalty:', error);
      throw new Error('Error creating royalty: ' + error.message);
    }
  }

  // Get all royalty records
  static async findAll() {
    try {
      return await Royalty.find();
    } catch (error) {
      console.error('Error fetching royalty records:', error);
      throw new Error('Error fetching royalty records: ' + error.message);
    }
  }

  // Find a royalty record by ID
  static async findById(id) {
    try {
      const royalty = await Royalty.findById(id);
      if (!royalty) {
        throw new Error('Royalty record not found');
      }
      return royalty;
    } catch (error) {
      console.error('Error finding royalty by ID:', error);
      throw new Error('Error finding royalty: ' + error.message);
    }
  }

  // Update a royalty record by ID
  static async update(royaltyId, data) {
    try {
      const updated = await Royalty.findByIdAndUpdate(royaltyId, data, { new: true });
      if (!updated) {
        throw new Error('Royalty record not found for update');
      }
      return updated;
    } catch (error) {
      console.error('Error updating royalty:', error);
      throw new Error('Error updating royalty: ' + error.message);
    }
  }

  // Delete a royalty record by ID
  static async delete(royaltyId) {
    try {
      const deleted = await Royalty.findByIdAndDelete(royaltyId);
      if (!deleted) {
        throw new Error('Royalty record not found for deletion');
      }
      return deleted;
    } catch (error) {
      console.error('Error deleting royalty:', error);
      throw new Error('Error deleting royalty: ' + error.message);
    }
  }
}

export default RoyaltyRepository;
