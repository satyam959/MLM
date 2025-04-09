import express from 'express';
import RoyaltyController from '../controllers/RoyaltyController.mjs';

const router = express.Router();

router.get('/getAllRoyalty', RoyaltyController.getAll);
router.get('/getRoyaltyById/:id', RoyaltyController.getById);
router.post('/createRoyalty', RoyaltyController.create);
router.put('/updateRoyalty/:id', RoyaltyController.update);
router.delete('/deleteRoyalty/:id', RoyaltyController.delete);

export default router;
