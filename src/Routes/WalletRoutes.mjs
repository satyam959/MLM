import express from 'express';
import WalletController from '../controllers/WalletController.mjs';

const router = express.Router();

// Create a new wallet (only balance required)
router.post('/createWallet', WalletController.create);

// Get all wallets
router.get('/getAll', WalletController.getAll);

// Get a wallet by ID
router.get('/getById/:walletId', WalletController.getById);

// Update a wallet's balance
router.put('/update/:walletId', WalletController.update);

// Delete a wallet by ID
router.delete('/delete/:walletId', WalletController.delete);



export default router;
