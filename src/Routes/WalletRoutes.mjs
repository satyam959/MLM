import express from 'express';
import WalletController from '../controllers/WalletController.mjs';

const router = express.Router();

// Create a new wallet (only balance required)
router.post('/createWallet', WalletController.create);

// Get all wallets
router.get('/', WalletController.getAll);

// Get a wallet by ID
router.get('/:id', WalletController.getById);

// Update a wallet's balance
router.put('/:id', WalletController.update);

// Delete a wallet by ID
router.delete('/:id', WalletController.delete);

export default router;
