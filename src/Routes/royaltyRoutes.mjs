import express from 'express';
import RoyaltyController from '../controllers/RoyaltyController.mjs';

const router = express.Router();

// Routes for royalty
router.post('/createRoyalty', RoyaltyController.createRoyalty);               // Create a new royalty
router.get('/getAllRoyalties', RoyaltyController.getAllRoyalties);           // Get all royalties
router.get('/getRoyaltyById/:royaltyId', RoyaltyController.getRoyaltyById);  // Get royalty by ID
router.put('/updateRoyalty/:royaltyId', RoyaltyController.updateRoyaltyById); // Update royalty
router.delete('/deleteRoyalty/:royaltyId', RoyaltyController.deleteRoyaltyById); // Delete royalty

export default router;
