import express from 'express';
import ServiceController from '../controllers/ServicesController.mjs';
import multer from 'multer';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb,jpge) => {
    cb(null, 'uploads/'); // Path to save uploaded files
  },
  filename: (req, file, cb,jpge) => {
    cb(null, Date.now() + '-' + file.originalname); // Save with timestamp to avoid name collision
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// POST route for creating a new service with image upload (multer middleware used)
router.post('/services', upload.single('image'), ServiceController.createService);

// GET all services
router.get('/services', ServiceController.getAllServices);

// GET a specific service by ID
router.get('/services/:id', ServiceController.getServiceById);

// PUT update a specific service by custom ID
router.put('/services/:serviceId', ServiceController.updateService);

// DELETE a service by custom ID
router.delete('/services/:serviceId', ServiceController.deleteService);

export default router;
