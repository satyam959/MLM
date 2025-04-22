import express from 'express';
import BankController from '../controllers/BankAccountController.mjs';

const router = express.Router();

// Create bank account
router.post('/createBankAccount', BankController.createBank);

// Get all bank accounts
router.get('/', BankController.getAllBanks);

// Get a bank account by userId
router.get('/:userId', BankController.getBankById);

// Update a bank account by userId
router.put('/:userId', BankController.updateBank);

// Delete a bank account by userId
router.delete('/:userId', BankController.deleteBank);

export default router;
