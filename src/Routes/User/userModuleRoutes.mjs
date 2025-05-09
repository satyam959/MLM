// Routes/userRoutes.mjs
import express from 'express';
import PortfolioController from '../../controllers/user/PortfolioController.mjs';
import verifyToken from '../../middelware/authMiddleware.mjs'


const router = express.Router();

router.get('/portfolio', verifyToken, PortfolioController.getUserPortfolio);



export default router;
