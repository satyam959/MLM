// Routes/userRoutes.mjs
import express from 'express';
import PortfolioController from '../../controllers/user/PortfolioController.mjs';
import BuyMembership from '../../controllers/user/BuyMembershipController.mjs';
import TeamLevelReport from '../../controllers/user/TeamLevelReportController.mjs';


import verifyToken from '../../middelware/authMiddleware.mjs'


const router = express.Router();

router.get('/portfolio', verifyToken, PortfolioController.getUserPortfolio);
router.post('/buyMembership', verifyToken, BuyMembership.buyMembership);
router.get('/teamLevelReport', verifyToken, TeamLevelReport.getUserTeamLevelReport);





export default router;
