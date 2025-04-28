import express from 'express';
import WithdrawalController from '../controllers/WithdrawalController.mjs'; 

const router = express.Router();

// POST /withdrawal/deposit
router.post('/deposit', (req, res) => WithdrawalController.deposit(req, res));

// POST /withdrawal/withdraw
router.post('/withdrawl', (req, res) => WithdrawalController.withdraw(req, res));

router.get('/balance/:walletId', WithdrawalController.getBalance);

export default router;
