import express from 'express';
import RolePermissionController from '../controllers/RolePermissionController.mjs'

const router = express.Router();

// Add a permission to a role based on roleId
router.post('/createPermissionForRole', RolePermissionController.createPermissionForRole);

// Get all permissions of a role by roleId
router.get('/getPermissionsByRoleId/:roleId', RolePermissionController.getPermissionsByRoleId);

// Get a specific permission for a role by roleId and permissionId
router.get('/rolespermissions/:roleId/:permissionId', RolePermissionController.getPermissionForRole);

// Update a permission for a role by roleId and permissionId
router.put('/updatePermissionForRole/:roleId', RolePermissionController.updatePermissionForRole);

// Remove a permission from a role by roleId and permissionId
router.delete('/removePermissionFromRole/:roleId/:permissionId', RolePermissionController.removePermissionFromRole);

//GetAll RolePermissions
router.get('/getAllRolePermissions', RolePermissionController.getAllRolePermissions);

// // Delete Role By RoleId
 router.delete('/deleteRoleById/:roleId', RolePermissionController.deleteRoleById);

export default router;
