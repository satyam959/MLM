import express from 'express';
import ServiceController from '../controllers/ServicesController.mjs';
import { getUploadMiddleware } from '../middelware/UploadImage.mjs';

const router = express.Router();


router.post('/services', getUploadMiddleware('serviceIcon', 'service'), ServiceController.createService); 
router.get('/services', ServiceController.getAllServices);
router.get('/services/:id', ServiceController.getServiceById);
router.put('/services/:serviceId', ServiceController.updateService);
router.delete('/services/:serviceId', ServiceController.deleteService);

export default router;
