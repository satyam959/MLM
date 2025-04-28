import RoyaltyModel from '../Models/RoyaltyModel.mjs';

class RoyaltyRepository {

  // Create a new Royalty
  async createRoyalty({ rank, dailyRoyalty, status }) {
    try {
      const newRoyalty = new RoyaltyModel({ rank, dailyRoyalty, status });
      return await newRoyalty.save();
    } catch (error) {
      throw new Error('Error creating royalty: ' + error.message);
    }
  }

  // Get all Royalties
  async getAllRoyalties() {
    try {
      return await RoyaltyModel.find();
    } catch (error) {
      throw new Error('Error retrieving royalties: ' + error.message);
    }
  }

  // Get Royalty by royaltyId
  async getRoyaltyById(royaltyId) {
    try {
      // Use findOne to search by royaltyId (not _id)
      const royalty = await RoyaltyModel.findOne({ royaltyId: royaltyId }); // Use royaltyId for the query
      if (!royalty) {
        throw new Error('Royalty not found');
      }
      return royalty;
    } catch (error) {
      throw new Error('Error finding royalty: ' + error.message);
    }
  }

  // Update Royalty by royaltyId
  async updateRoyaltyById(royaltyId, { rank, dailyRoyalty, status }) {
    try {
      // Use findOneAndUpdate to update the royalty by royaltyId
      const updatedRoyalty = await RoyaltyModel.findOneAndUpdate(
        { royaltyId: royaltyId }, // Find by custom royaltyId
        { rank, dailyRoyalty, status },
        { new: true, runValidators: true }
      );
      if (!updatedRoyalty) {
        throw new Error('Royalty not found');
      }
      return updatedRoyalty;
    } catch (error) {
      throw new Error('Error updating royalty: ' + error.message);
    }
  }

  // Delete Royalty by royaltyId
  async deleteRoyaltyById(royaltyId) {
    try {
      // Use findOneAndDelete to delete the royalty by royaltyId
      const deletedRoyalty = await RoyaltyModel.findOneAndDelete({ royaltyId: royaltyId }); // Find by custom royaltyId
      if (!deletedRoyalty) {
        throw new Error('Royalty not found');
      }
      return true;
    } catch (error) {
      throw new Error('Error deleting royalty: ' + error.message);
    }
  }
}

export default new RoyaltyRepository();  // Export an instance of the class
