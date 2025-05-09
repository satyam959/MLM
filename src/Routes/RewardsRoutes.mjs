// // // RewardRoutes.mjs
// // import express from 'express';
// // import rewardController from '../controllers/RewardController.mjs';

// // const router = express.Router();

// // // Routes
// // router.get('/getAll', rewardController.getAll);
// // router.get('/getById/:id', rewardController.getById);
// // router.post('/createReward', rewardController.create);
// // // router.put('/update/:id', rewardController.update);
// // router.delete('/:id', rewardController.delete);

// // export default router;


// import express from 'express';
// import RewardController from '../controllers/RewardController.mjs';

// const router = express.Router();

// // Routes for rewards CRUD operations
// router.post('/createReward', RewardController.createReward);
// router.get('/rewards', RewardController.getAllRewards);
// router.get('/rewards/:id', RewardController.getRewardById);
// router.put('/updateReward/:rewardId', RewardController.updateReward);
// router.delete('/deleteReward/:rewardId', RewardController.deleteReward);

// // Route for creating multiple rewards at once
// router.post('/rewards/multiple', RewardController.createMultipleRewards);

// export default router;


  
import RewardController from '../controllers/RewardController.mjs';
import express from 'express';

const router = express.Router();

router.post('/createReward', RewardController.createReward);
router.get('/rewardAll', RewardController.getAllRewards);
router.get('/reward/:rewardId', RewardController.getById);
router.put('/updateReward/:rewardId', RewardController.updateReward);
router.delete('/deleteReward/:rewardId', RewardController.deleteReward);

export default router;

