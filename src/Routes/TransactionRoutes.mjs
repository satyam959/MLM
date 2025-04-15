import express from 'express';
import TransactionController from '../controllers/TransactionController.mjs';

const router = express.Router();

// Create a new transaction
router.post('/createTransaction', TransactionController.create);

// Get all transactions
router.get('/getAllTransaction', TransactionController.findAll);

// Get a single transaction by ID
router.get('/getTransactionById:id', TransactionController.findById);

// Update a transaction by ID
router.put('/updateTransactionById:id', TransactionController.update);

// Delete a transaction by ID
router.delete('/deleteTransactionById:id', TransactionController.delete);

export default router;
