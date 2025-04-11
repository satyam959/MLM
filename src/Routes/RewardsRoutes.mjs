import express from 'express';
import rewardController from '../controllers/RewardController.mjs';

const router = express.Router();

// Routes
router.get('/', rewardController.getAll.bind(rewardController));         // GET all rewards
router.get('/:id', rewardController.getById.bind(rewardController));     // GET reward by ID
router.post('/createReward', rewardController.create.bind(rewardController));        // POST create new reward
router.put('/:id', rewardController.update.bind(rewardController));      // PUT update reward
router.delete('/:id', rewardController.delete.bind(rewardController));   // DELETE reward

export default router;
