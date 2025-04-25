import express from 'express';
import RoleController from '../controllers/RoleController.mjs' 

const router = express.Router();

// Routes for roles
router.post('/CreateRoles', RoleController.createRole);  // Create a role
router.get('/GetAllRoles', RoleController.getRoles);    // Get all roles
router.get('/GetRolesById/:roleId', RoleController.getRoleById);  // Get a role by ID
router.put('/updateRole/:roleId', RoleController.updateRole);   // Update a role by ID
router.delete('/deleteRole/:roleId', RoleController.deleteRole);  // Delete a role by ID

export default router;
