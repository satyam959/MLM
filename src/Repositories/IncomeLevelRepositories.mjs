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
  static async findAllIncomeRecord() {
    console.log("hi")
    try {
      // Find all income levels from the database
      const levels = await IncomeLevel.find();

      // If no levels are found, return an empty array or throw an error
      if (!levels || levels.length === 0) {
        return [];
      }

      return levels;
    } catch (error) {
      console.error('Error fetching income levels:', error);
      throw new Error('Error fetching income levels: ' + error.message);
    }
  }


  // Find an income level by ID
  static async findById(id) {
    try {
      // Validate if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const level = await IncomeLevel.findById(id);
      if (!level) {
        throw new Error(`Income level with ID ${id} not found`);
      }
      return level;
    } catch (error) {
      console.error('Error finding income level:', error);
      throw new Error('Error finding income level: ' + error.message);
    }
  }

  // Update an income level by ID
  static async update(incomeLevelId, data) {
    try {
      // Validate if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(incomeLevelId)) {
        throw new Error('Invalid ID format');
      }

      const updatedLevel = await IncomeLevel.findByIdAndUpdate(incomeLevelId, data, { new: true });
      if (!updatedLevel) {
        throw new Error(`Income level with ID ${id} not found for update`);
      }
      return updatedLevel;
    } catch (error) {
      console.error('Error updating income level:', error);
      throw new Error('Error updating income level: ' + error.message);
    }
  }

  // Delete an income level by ID
  static async delete(incomeLevelId) {
    try {
      // Validate if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(incomeLevelId)) {
        throw new Error('Invalid ID format');
      }

      const deletedLevel = await IncomeLevel.findByIdAndDelete(incomeLevelId);
      if (!deletedLevel) {
        throw new Error(`Income level with ID ${id} not found for deletion`);
      }
      return deletedLevel;
    } catch (error) {
      console.error('Error deleting income level:', error);
      throw new Error('Error deleting income level: ' + error.message);
    }
  }
}

export default IncomeLevelRepository;
