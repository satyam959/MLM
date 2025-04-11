import express from 'express';
import TypeIncomeController from '../controllers/TypeIncomeController.mjs';

const router = express.Router();

// Create a new TypeIncome
router.post('/createTypeIncome', TypeIncomeController.createTypeIncome);

// Get all TypeIncomes
router.get('/typeincomes', TypeIncomeController.getAllTypeIncomes);

// Get a specific TypeIncome by ID
router.get('/typeincomes/:id', TypeIncomeController.getTypeIncomeById);

// Update a TypeIncome by ID
router.put('/typeincomes/:id', TypeIncomeController.updateTypeIncome);

// Delete a TypeIncome by ID
router.delete('/typeincomes/:id', TypeIncomeController.deleteTypeIncome);

export default router;
