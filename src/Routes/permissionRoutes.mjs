import express from 'express';
import permissionController from '../controllers/PermissionController.mjs';

const router = express.Router();

router.post('/createPermission', permissionController.createPermission);
router.get('/getPermissions', permissionController.getPermissions);
router.get('/:id', permissionController.getPermissionById);
router.put('/updatePermission/:permissionId', permissionController.updatePermission);
router.delete('/deletePermission/:permissionId', permissionController.deletePermission);

export default router;
