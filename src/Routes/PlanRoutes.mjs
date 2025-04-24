import express from 'express';
import planController from '../controllers/PlanController.mjs';  // Adjust the path to where your controller is located

const router = express.Router();

// Route to create a new plan
router.post('/createPlan', planController.create);

// Route to get all plans
router.get('/', planController.getAll);

// Route to get a plan by ID
router.get('/:planId', planController.getById);

// Route to update a plan by ID
router.put('/:planId', planController.update);

// Route to delete a plan by ID
router.delete('/:planId', planController.delete);

export default router;
