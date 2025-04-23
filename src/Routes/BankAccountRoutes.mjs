import express from 'express';
import BankController from '../controllers/BankAccountController.mjs';

const router = express.Router();

// Create bank account
router.post('/createBankAccount', BankController.createBank);

// Get all bank accounts
router.get('/getAllBanks', BankController.getAllBanks);

// Get a bank account by userId
router.get('/getBankById/:userId', BankController.getBankById);

// Update a bank account by userId
router.put('/updateBank/:userId', BankController.updateBank);

// Delete a bank account by userId
router.delete('/deleteBank/:userId', BankController.deleteBank);

export default router;
