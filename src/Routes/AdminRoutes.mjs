import express from 'express';
import AdminController from '../controllers/AdminController.mjs';
import AdminAuth from '../middelware/verifyAdminRole.mjs';
import WalletController from '../controllers/WalletController.mjs';

const router = express.Router();

router.post('/Adminlogin', AdminController.loginWithEmail);

router.post('/transferAdmin', AdminAuth.verifyAdminRole,WalletController .transferFromAdminToUser);


export default router;
