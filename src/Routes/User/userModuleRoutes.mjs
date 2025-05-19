// Routes/userRoutes.mjs
import express from 'express';
import PortfolioController from '../../controllers/user/PortfolioController.mjs';
import BuyMembership from '../../controllers/user/BuyMembershipController.mjs';
import TeamLevelReport from '../../controllers/user/TeamLevelReportController.mjs';
import UserTeamDownline from '../../controllers/user/UserTeamDownlineController.mjs'
import UserDirectDetails from '../../controllers/user/UserDirectDetailsController.mjs'
import UserRewardController from '../../controllers/user/UserRewardController.mjs';

import verifyToken from '../../middelware/authMiddleware.mjs'



const router = express.Router();

router.get('/portfolio', verifyToken, PortfolioController.getUserPortfolio);
router.post('/buyMembership', verifyToken, BuyMembership.buyMembership);
router.get('/teamLevelReport', verifyToken, TeamLevelReport.getUserTeamLevelReport);
router.get('/getUserDownline', verifyToken, UserTeamDownline.getUserDownline);
router.get('/getDirectDetails', verifyToken, UserDirectDetails.getUserReferalMember);


//  New routes: Get users by level
router.get('/usersLevel/:level', verifyToken, TeamLevelReport.getUsersByLevel);

//reward route
router.get('/getAllUserRewards', verifyToken, UserRewardController.getAllUserRewards);

router.post('/createRewards', verifyToken, UserRewardController.createUserReward);


export default router;
