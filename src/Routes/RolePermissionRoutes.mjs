import express from 'express';
import RolePermissionController from '../controllers/RolePermissionController.mjs'

const router = express.Router();

// Add a permission to a role based on roleId
router.post('/createPermissionForRole', RolePermissionController.createPermissionForRole);

// Get all permissions of a role by roleId
router.get('/getPermissionsByRoleId/:roleId', RolePermissionController.getPermissionsByRoleId);

// Get a specific permission for a role by roleId and permissionId
router.get('/roles/:roleId/permissions/:permissionId', RolePermissionController.getPermissionForRole);

// Update a permission for a role by roleId and permissionId
router.put('/roles/:roleId/permissions/:permissionId', RolePermissionController.updatePermissionForRole);

// Remove a permission from a role by roleId and permissionId
router.delete('/removePermissionFromRole/:permissionId', RolePermissionController.removePermissionFromRole);




export default router;
