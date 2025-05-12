import express from 'express';
import WalletController from '../controllers/WalletController.mjs';
import verify from '../middelware/authMiddleware.mjs';

const router = express.Router();

// Create a new wallet (only balance required)
router.post('/createWallet',verify ,WalletController.create);

// Get all wallets
router.get('/getAll', WalletController.getAll);

// Get a wallet by ID
router.get('/getById/:walletId', WalletController.getById);

//get wallet by userId 
router.get('/getByUser',verify, WalletController.getByUserId);
// Update a wallet's balance
router.put('/update/:walletId', WalletController.update);

// Delete a wallet by ID
router.delete('/delete/:walletId', WalletController.delete);

export default router;
