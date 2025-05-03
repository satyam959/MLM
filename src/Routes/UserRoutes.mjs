import express from 'express';
import UserController from '../controllers/UserController.mjs';
import upload from "../middelware/UploadImage.mjs";

// For updating user profile with image
//  router.patch("/profile/:userId", upload.single("image"), UserController.updateProfile);


const router = express.Router();

// ----------------- USER ROUTES ------------------




 router.post("/register", upload.single("image"), UserController.registerUser.bind(UserController));
// router.put("/profile/:userId", upload.single("image"), UserController.updateProfile.bind(UserController));


// Register new user
 //router.post('/register',upload, UserController.registerUser);

// Login via password (if you still use it)
// router.post('/login', UserController.loginUser);

// OTP-based login
router.post('/request-otp', UserController.requestOTP);
router.post('/verify-otp', UserController.verifyOTPLogin);
router.post('/resend-otp', UserController.requestOTP);

// Admin: Get all users
router.get('/getAllusers', UserController.getAllUsers);

// Update and delete by userId
router.put('/updateByUserId/:userId', UserController.updateUser);
router.delete('/deleteByUserId/:userId', UserController.deleteUser);

// Profile
 router.get('/getProfile/:userId', UserController.getUserProfile);
router.put('/updateProfile/:userId', UserController.updateProfile);
router.delete('/deleteProfile/:userId', UserController.deleteProfile);

// Referral-based user lookup
router.get('/getReferral/:referralCode', UserController.getUserByReferralCode);

// Upline and Downline
router.get('/getUserUpline/:userId', UserController.getUserUpline);
router.get('/getUserDownline/:userId', UserController.getUserDownline);

export default router;
