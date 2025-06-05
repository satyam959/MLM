import express from 'express';
import UserController from '../controllers/UserController.mjs';
import { getUploadMiddleware } from "../middelware/UploadImage.mjs"; 
import verifyToken from '../middelware/authMiddleware.mjs';  
import AdminAuth from '../middelware/verifyAdminRole.mjs';  // <-- IMPORT AdminAuth here
import BuyMembershipController from '../controllers/user/BuyMembershipController.mjs';
const router = express.Router();

router.post('/register', getUploadMiddleware('image'), UserController.registerUser); 
router.post('/request-otp', UserController.requestOTP);
router.post('/verify-otp', UserController.verifyOTPLogin);
router.post('/resend-otp', UserController.resendOTP);

router.get('/getAllusers', UserController.getAllUsers);

router.get('/getUserProfile', verifyToken, UserController.getUserProfile);
router.put('/updateProfile', verifyToken, getUploadMiddleware('image'), UserController.updateProfile);
router.delete('/deleteProfile', verifyToken, UserController.deleteProfile);

router.delete('/deleteByUserId/:userId', UserController.deleteUser);

router.get('/getReferral/:referralCode', UserController.getUserByReferralCode);
router.get('/getUserUpline/:userId', verifyToken, UserController.getUserUpline);
router.get('/getUserDownline', verifyToken, UserController.getUserDownline);
router.get('/downline', UserController.getUserDownline);
router.get('/getUsersByRank', verifyToken, UserController.getUsersByRank);

//admin only
router.get('/getAllUser', UserController.getAllUser);

// Add verifyToken here if you want protection:
router.get('/rankHistory', verifyToken, UserController.getUserRankHistory);

router.get('/membership', UserController.getMembershipUsers);

router.get('/walletHistory', AdminAuth.verifyAdminRole, UserController.getUserTransactions);

router.post('/sendReceipt', BuyMembershipController.sendMembershipReceiptForUser);

//rewardReferrerFromAdmin
router.post('/rewardReferrerFromAdmin', verifyToken, BuyMembershipController.rewardReferrerFromAdmin);

// Admin getAllRankRoyalty
router.get("/getAllRankRoyalty",AdminAuth.verifyAdminRole,UserController.getAllRankRoyalty);


export default router;
