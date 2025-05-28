import express from "express";
import RewardController from "../controllers/RewardController.mjs";
import { getUploadMiddleware } from "../middelware/UploadImage.mjs";
import AdminAuth from "../middelware/verifyAdminRole.mjs";      // ✅ Admin role middleware

const router = express.Router();

router.post( "/createReward",getUploadMiddleware("image"),RewardController.createReward);
router.get("/rewardAll", RewardController.getAllRewards);
router.get("/reward/:rewardId", RewardController.getById);
router.put( "/updateReward/:rewardId",getUploadMiddleware("image"),RewardController.updateReward);
router.delete("/deleteReward/:rewardId", RewardController.deleteReward);
router.get("/rewardsDaily",AdminAuth.verifyAdminRole, RewardController.getDailyRewardStats);

export default router;
