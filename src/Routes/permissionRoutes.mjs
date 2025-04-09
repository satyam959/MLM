import express from 'express';
import PermissionController from '../controllers/PermissionController.mjs'; // Ensure it's the default export

const router = express.Router();

// Create a new permission
router.post('/createPermission', PermissionController.createPermission);

// Get all permissions
router.get('/getAllPermission', PermissionController.getAllPermissions);

// Get a permission by ID
router.get('/getPermissionById/:id', PermissionController.getPermissionById);  // Use :id for the parameter

// Update a permission by ID
router.put('/updatePermission/:id', PermissionController.updatePermission);  // Use :id for the parameter

// Delete a permission by ID
router.delete('/deletePermission/:id', PermissionController.deletePermission);  // Use :id for the parameter

export default router;
