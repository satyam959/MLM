import express from 'express';
import walletController from '../controllers/WalletController.mjs';

const router = express.Router();

router.post('/createWallet', walletController.create);
router.get('/getAll', walletController.getAll);
router.get('/getById/:id', walletController.getById);
router.put('/update/:userId', walletController.update);
router.delete('/delete/:userId', walletController.delete);

export default router;
