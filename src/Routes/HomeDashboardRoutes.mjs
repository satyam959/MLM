
import express from 'express';
import HomeDashboardController from '../controllers/HomeDashboardController.mjs';
import ServiceController from '../controllers/ServicesController.mjs';
import verifyToken from '../middelware/authMiddleware.mjs';  
const router = express.Router();

// ----------------- HomeDashboard Routes ------------------


router.get('/getAll',verifyToken, HomeDashboardController.getAll);
// router.get('/services', HomeDashboardController.getAllServices);

export default router;
