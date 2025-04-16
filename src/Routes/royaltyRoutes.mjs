import express from 'express';
import RoyaltyController from '../controllers/RoyaltyController.mjs';

const router = express.Router();

// Routes for royalty
router.post('/createRoyalty', RoyaltyController.create);          // Create a new royalty
router.get('/getAllRoyalty', RoyaltyController.findAll);          // Get all royalties
router.get('/getRoyaltyById:id', RoyaltyController.findById);      // Get royalty by ID
router.put('/updateRoyaltyById:id', RoyaltyController.update);        // Update royalty
router.delete('/deleteRoyaltyById:id', RoyaltyController.delete);     // Delete royalty

export default router;
