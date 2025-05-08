import express from 'express';
import BankController from '../controllers/BankAccountController.mjs';
import verify from '../middelware/authMiddleware.mjs';

const router = express.Router();

// Create bank account
router.post('/createBankAccount', verify, BankController.createBank);

// Get all bank accounts for logged-in user
router.get('/getAllBanks', verify, BankController.getAllBanks);

// Get a specific bank account by bankId
router.get('/getBankById/:bankId', verify, BankController.getBankById);

// Update a specific bank account by bankId
router.put('/updateBank/:bankId', verify, BankController.updateBank);

// Delete a specific bank account by bankId
router.delete('/deleteBank/:bankId', verify, BankController.deleteBank);

// Set a specific account as primary
router.put('/setPrimary/:bankId', verify, BankController.setPrimaryBank);

router.get('/getBanksByUserId/:userId', verify, BankController.getBanksByUserId);


export default router;
