import express from "express";
import RewardController from "../controllers/RewardController.mjs";
import { getUploadMiddleware } from "../middelware/UploadImage.mjs";

const router = express.Router();

router.post( "/createReward",getUploadMiddleware("image"),RewardController.createReward);
router.get("/rewardAll", RewardController.getAllRewards);
router.get("/reward/:rewardId", RewardController.getById);
router.put( "/updateReward/:rewardId",getUploadMiddleware("image"),RewardController.updateReward);
router.delete("/deleteReward/:rewardId", RewardController.deleteReward);

export default router;
