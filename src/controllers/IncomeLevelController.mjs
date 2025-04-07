import IncomeLevelRepository from '../Repositories/IncomeLevelRepositories.mjs';

class IncomeLevelController {
  // Create new income level
  async create(req, res) {
    try {
      const { income, team, status, level } = req.body;

      // Ensure all required fields are provided
      if (!income || !team || !status || level === undefined || level === null) {
        return res.status(400).json({ message: 'Income, team, status, and level are required fields' });
      }

      // Calculate total
      const total = income * team;

      const newIncomeLevel = await IncomeLevelRepository.create({ income, team, status, total, level });

      res.status(201).json({
        message: 'Income Level created successfully',
        data: newIncomeLevel
      });
    } catch (error) {
      console.error('Error creating income level:', error);
      res.status(500).json({ message: 'Error creating income level', error: error.message });
    }
  }

  // Get all income levels
  async getAll(req, res) {
    try {
      const levels = await IncomeLevelRepository.findAll();
      res.json({ message: 'Income Levels fetched successfully', data: levels });
    } catch (error) {
      console.error('Error fetching income levels:', error);
      res.status(500).json({ message: 'Error fetching income levels', error: error.message });
    }
  }

  // Get income level by ID
  async getById(req, res) {
    try {
      const level = await IncomeLevelRepository.findById(req.params.id);
      if (!level) return res.status(404).json({ message: 'Income Level not found' });
      res.json({ message: 'Income Level fetched successfully', data: level });
    } catch (error) {
      console.error('Error fetching income level:', error);
      res.status(500).json({ message: 'Error fetching income level', error: error.message });
    }
  }

  // Update income level by ID
  async update(req, res) {
    try {
      const { income, team, status, level } = req.body;
      const { id } = req.params;

      // Ensure all required fields are provided
      if (!income || !team || !status || level === undefined || level === null) {
        return res.status(400).json({ message: 'Income, team, status, and level are required fields' });
      }

      const total = income * team;

      const updatedIncomeLevel = await IncomeLevelRepository.update(id, { income, team, status, total, level });

      if (!updatedIncomeLevel) return res.status(404).json({ message: 'Income Level not found' });

      res.json({ message: 'Income Level updated successfully', data: updatedIncomeLevel });
    } catch (error) {
      console.error('Error updating income level:', error);
      res.status(500).json({ message: 'Error updating income level', error: error.message });
    }
  }

  // Delete income level by ID
  async delete(req, res) {
    try {
      const deletedIncomeLevel = await IncomeLevelRepository.delete(req.params.id);
      if (!deletedIncomeLevel) return res.status(404).json({ message: 'Income Level not found' });
      res.json({ message: 'Income Level deleted successfully' });
    } catch (error) {
      console.error('Error deleting income level:', error);
      res.status(500).json({ message: 'Error deleting income level', error: error.message });
    }
  }
}

export default new IncomeLevelController();
