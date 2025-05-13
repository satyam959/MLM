import TypeIncomeRepository from '../Repositories/TypeIncomeRepositories.mjs';
// import TypeIncome from '../Repositories/TypeIncomeRepositories.mjs'; // Correct path
import mongoose from 'mongoose';

class TypeIncomeController {
    
  // Create new TypeIncome
  async createTypeIncome(req, res) {
    try {
      const { incomeType } = req.body;

      // Validate incomeType if necessary
      if (!incomeType || typeof incomeType !== 'string') {
        return res.status(400).json({ message: 'incomeType is required and must be a valid string.' });
      }

      // Check if a TypeIncome with the same incomeType already exists
      const existingIncome = await TypeIncomeRepository.findOneByType(incomeType);

      if (existingIncome) {
        return res.status(400).json({
          message: 'Income type already exists',
          data: existingIncome
        });
      }

      // Create a new TypeIncome document
      const newIncome = await TypeIncomeRepository.create({ incomeType });

      res.status(201).json({
        message: 'TypeIncome created successfully',
        data: newIncome
      });

    } catch (error) {
      console.error('Error creating TypeIncome:', error);
      res.status(400).json({ message: error.message });
    }
  }


  async getAllTypeIncomes(req, res) {
    try {
      const incomes = await TypeIncomeRepository.findAll();
      res.status(200).json(incomes);
    } catch (error) {
      console.error('Error fetching all TypeIncomes:', error);
      res.status(400).json({ message: error.message });
    }
  }
  

    // Get a specific TypeIncome by ID
    async getTypeIncomeById(req, res) {
        try {
            const income = await TypeIncome.findById(req.params.incomeId);
            if (!income) {
                return res.status(404).json({ message: 'TypeIncome not found' });
            }
            res.status(200).json(income);
        } catch (error) {
            console.error('Error fetching TypeIncome by ID:', error);
            res.status(400).json({ message: error.message });
        }
    }

    

    async updateTypeIncome(req, res) {
        try {
          const { incomeId } = req.params;
          const { incomeType } = req.body;
      
          if (!incomeType || typeof incomeType !== 'string') {
            return res.status(400).json({ message: 'incomeType is required and must be a valid string.' });
          }
      
          const updatedIncome = await TypeIncomeRepository.updateByIncomeId(
            incomeId,
            { incomeType },
            { new: true }
          );
      
          if (!updatedIncome) {
            return res.status(404).json({ message: 'TypeIncome not found' });
          }
      
          res.status(200).json({
            message: 'TypeIncome updated successfully',
            data: updatedIncome
          });
        } catch (error) {
          console.error('Error updating TypeIncome:', error);
          res.status(400).json({ message: error.message });
        }
      }
      
    
  

    /// Delete TypeIncome
    async deleteTypeIncome(req, res) {
        try {
          const { incomeId } = req.params;
      
          const deletedIncome = await TypeIncomeRepository.deleteByIncomeId(incomeId);
      
          if (!deletedIncome) {
            return res.status(404).json({ message: 'TypeIncome not found' });
          }
      
          res.status(200).json({
            message: 'TypeIncome deleted successfully'
          });
        } catch (error) {
          console.error('Error deleting TypeIncome:', error);
          res.status(400).json({ message: error.message });
        }
      }
      
  
}

export default new TypeIncomeController();

