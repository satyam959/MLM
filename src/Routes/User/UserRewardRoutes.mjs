import express from 'express';
import UserRewardController from '../../controllers/user/UserRewardController.mjs';
import verify from '../../middelware/authMiddleware.mjs';

const router = express.Router();

router.get('/getAllUserRewards',verify ,UserRewardController.getAllUserRewards);
// router.get('/userrewards/:id',verify, UserRewardController.getUserRewardById);


router.post('/createRewards', verify, UserRewardController.createUserReward);

export default router;
