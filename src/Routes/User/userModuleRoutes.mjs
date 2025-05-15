// Routes/userRoutes.mjs
import express from 'express';
import PortfolioController from '../../controllers/user/PortfolioController.mjs';
import BuyMembership from '../../controllers/user/BuyMembershipController.mjs';
import TeamLevelReport from '../../controllers/user/TeamLevelReportController.mjs';
<<<<<<< HEAD
<<<<<<< HEAD
import UserTeamDownline from '../../controllers/user/UserTeamDownlineController.mjs'
=======

>>>>>>> 54bcf5d (level api)
=======
import UserTeamDownline from '../../controllers/user/UserTeamDownlineController.mjs'
>>>>>>> 0d8d5eb (TeamLevelReportController)

import verifyToken from '../../middelware/authMiddleware.mjs'



const router = express.Router();

router.get('/portfolio', verifyToken, PortfolioController.getUserPortfolio);
router.post('/buyMembership', verifyToken, BuyMembership.buyMembership);
router.get('/teamLevelReport', verifyToken, TeamLevelReport.getUserTeamLevelReport);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0d8d5eb (TeamLevelReportController)
router.get('/getUserDownline', verifyToken, UserTeamDownline.getUserDownline);


//  New routes: Get users by level
router.get('/usersLevel/:level', verifyToken, TeamLevelReport.getUsersByLevel);
<<<<<<< HEAD
=======


>>>>>>> 54bcf5d (level api)
=======
>>>>>>> 0d8d5eb (TeamLevelReportController)



export default router;
