// Routes/userRoutes.mjs
import express from 'express';
import UserController from '../controllers/UserController.mjs';

const router = express.Router();

// Route for user registration
router.post('/register', UserController.registerUser);

// Route for user login
router.post('/login', UserController.loginUser);

// Admin route to get all users
router.get('/getAlluser', UserController.getAllUsers);

// Route to update user by ID
router.put('/updateByUserId/:userId', UserController.updateUser);

// Route to delete user by ID
router.delete('/deleteByUserId/:userId', UserController.deleteUser);

// Route for Get Profile
router.get('/getProfile/:userId', UserController.getUserProfile);

// Update Profile
router.put('/updateProfile/:userId', UserController.updateProfile);

//Delete Profile
router.delete('/deleteProfile/:userId', UserController.deleteProfile);

//Get user by referralCode
router.get('/getReferral/:referralCode', UserController.getUserByReferralCode);



export default router;
