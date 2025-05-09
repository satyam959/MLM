// Routes/userRoutes.mjs
import express from 'express';
import PortfolioController from '../../controllers/user/PortfolioController.mjs';
import Middleware from '../../middelware/authMiddleware.mjs'


const router = express.Router();

router.get('/portfolio', Middleware.verifyToken, PortfolioController.getUserPortfolio);



export default router;
