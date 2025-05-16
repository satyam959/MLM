import express from 'express';
import AdminController from '../controllers/AdminController.mjs';
import verifyAdminRole from '../middelware/verifyAdminRole.mjs';

const router = express.Router();

router.post('/Adminlogin', AdminController.loginWithEmail);

export default router;
