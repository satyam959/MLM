import express from 'express';
import userPlanController from '../controllers/UserPlanController.mjs';

const router = express.Router();

// Create a user plan
router.post('/createUserplans', userPlanController.create);

// Get all user plans
router.get('/getAlluserplans', userPlanController.getAll);

// Get user plan by userId
router.get('/userplans/:userId', userPlanController.getById);

// Update user plan by userId
router.put('/userplans/:userId', userPlanController.update);

// Delete user plan by userId
router.delete('/userplans/:userId', userPlanController.delete);

export default router;
