import express from 'express';
import ServiceController from '../controllers/ServicesController.mjs';

const router = express.Router();

router.post('/createService', ServiceController.createService);
router.get('/services', ServiceController.getAllServices);
router.get('/services/:id', ServiceController.getServiceById);
router.put('/services/:id', ServiceController.updateService);
router.delete('/services/:id', ServiceController.deleteService);

export default router;
