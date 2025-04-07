import express from 'express';
import ServiceController from '../controllers/ServicesController.mjs';

const router = express.Router();

// Get all services
router.get('/', ServiceController.getAll);

// Get a service by ID
router.get('/:id', ServiceController.getById);

// Create a new service
router.post('/createService', ServiceController.create);

// Update a service by ID
router.put('/:id', ServiceController.update);

// Delete a service by ID
router.delete('/:id', ServiceController.delete);

export default router;
