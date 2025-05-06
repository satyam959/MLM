import express from 'express';
import ServiceController from '../controllers/ServicesController.mjs';
import { getUploadMiddleware } from '../middelware/UploadImage.mjs';

const router = express.Router();


router.post('/createService', getUploadMiddleware('serviceIcon', 'service'), ServiceController.createService); 
router.get('/getAllServices', ServiceController.getAllServices);
router.get('/services/:id', ServiceController.getServiceById);
router.put('/updateService/:serviceId', ServiceController.updateService);
router.delete('/deleteService/:serviceId', ServiceController.deleteService);

export default router;
