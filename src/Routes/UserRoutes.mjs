// UserRoutes.mjs
import express from 'express';
import UserController from '../controllers/UserController.mjs';
import { getUploadMiddleware } from "../middelware/UploadImage.mjs"; 
import verifyToken from '../middelware/authMiddleware.mjs';  // ✅ Correct import

const router = express.Router();

// ----------------- USER ROUTES ------------------

// Register with image
router.post('/register', getUploadMiddleware('image', 'default'), UserController.registerUser); 

// OTP-based login
router.post('/request-otp', UserController.requestOTP);
router.post('/verify-otp', UserController.verifyOTPLogin);
 router.post('/resend-otp', UserController.resendOTP);

// Admin: Get all users
router.get('/getAllusers', UserController.getAllUsers);

// 🔒 Protected Routes (token required)
router.get('/getUserProfile', verifyToken, UserController.getUserProfile); // No userId in URL anymore
router.put('/updateProfile', verifyToken, getUploadMiddleware('image', 'default'), UserController.updateProfile);
router.delete('/deleteProfile', verifyToken, UserController.deleteProfile);

// Admin routes by userId (if needed)
router.put('/updateByUserId/:userId', UserController.updateUser);
router.delete('/deleteByUserId/:userId', UserController.deleteUser);

// Referral-based
router.get('/getReferral/:referralCode', UserController.getUserByReferralCode);

// Upline & Downline
router.get('/getUserUpline/:userId', UserController.getUserUpline);
router.get('/getUserDownline/:userId', UserController.getUserDownline);

export default router;
