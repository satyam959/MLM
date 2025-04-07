import IncomeLevel from '../Models/IncomeLevelModel.mjs';

class IncomeLevelRepository {
  // Create a new income level
  static async create(data) {
    try {
      // Create a new income level instance and save it to the database
      const incomeLevel = new IncomeLevel(data);
      await incomeLevel.save();
      return incomeLevel;
    } catch (error) {
      console.error('Error creating income level:', error);
      throw new Error('Error creating income level: ' + error.message);
    }
  }

  // Get all income levels
  static async findAll() {
    try {
      const levels = await IncomeLevel.find();
      return levels;
    } catch (error) {
      console.error('Error fetching income levels:', error);
      throw new Error('Error fetching income levels: ' + error.message);
    }
  }

  // Find an income level by ID
  static async findById(id) {
    try {
      const level = await IncomeLevel.findById(id);
      if (!level) {
        throw new Error('Income level not found');
      }
      return level;
    } catch (error) {
      console.error('Error finding income level:', error);
      throw new Error('Error finding income level: ' + error.message);
    }
  }

  // Update an income level by ID
  static async update(id, data) {
    try {
      const updatedLevel = await IncomeLevel.findByIdAndUpdate(id, data, { new: true });
      if (!updatedLevel) {
        throw new Error('Income level not found for update');
      }
      return updatedLevel;
    } catch (error) {
      console.error('Error updating income level:', error);
      throw new Error('Error updating income level: ' + error.message);
    }
  }

  // Delete an income level by ID
  static async delete(id) {
    try {
      const deletedLevel = await IncomeLevel.findByIdAndDelete(id);
      if (!deletedLevel) {
        throw new Error('Income level not found for deletion');
      }
      return deletedLevel;
    } catch (error) {
      console.error('Error deleting income level:', error);
      throw new Error('Error deleting income level: ' + error.message);
    }
  }
}

export default IncomeLevelRepository;
