import express from 'express';
import BankController from '../controllers/BankAccountController.mjs';
import verify from '../middelware/authMiddleware.mjs';


const router = express.Router();

// Create bank account
router.post('/createBankAccount',verify ,BankController.createBank);

// Get all bank accounts
router.get('/getAllBanks',verify, BankController.getAllBanks);

// Get a bank account by userId
router.get('/getBankById/:bankId',verify, BankController.getBankById);

// Update a bank account by userId
router.put('/updateBank/:bankId', verify,BankController.updateBank);

// Delete a bank account by userId
router.delete('/deleteBank/:bankId',verify, BankController.deleteBank);

// In routes/BankRoutes.js or similar

router.put('/setPrimary/:bankId', verify, BankController.setPrimaryBank);


export default router;
