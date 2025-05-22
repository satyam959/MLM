import express from "express";

import LevelIncomeReportController from "../../controllers/user/LevelIncomeReportController.mjs";
import verify from "../../middelware/authMiddleware.mjs";


const router = express.Router();


router.get("/LevelIncome", verify, LevelIncomeReportController.getWalletSummary);

export default router;
