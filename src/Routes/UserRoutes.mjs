// Routes/userRoutes.mjs
import express from 'express';
import UserController from '../Controllers/UserController.mjs';

const router = express.Router();

// Route for user registration
router.post('/register', UserController.registerUser);

// Route for user login
router.post('/login', UserController.loginUser);

// Admin route to get all users
router.get('/', UserController.getAllUsers);

// Route to update user by ID
router.put('/:userId', UserController.updateUser);

// Route to delete user by ID
router.delete('/:userId', UserController.deleteUser);

export default router;
