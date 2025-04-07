// import express from 'express';
// import AdminController from '../controllers/AdminController.mjs';
// import {verifyAdminRole }from '../middelware/verifyAdminRole.mjs'; // Middleware to verify admin role

// const router = express.Router();

// // Admin routes to manage users
// router.post('/CreateUsers', verifyAdminRole, AdminController.createUser);   // Admin creates a user
// router.put('/users/:userId', verifyAdminRole, AdminController.updateUser); // Admin updates a user
// router.delete('/users/:userId', verifyAdminRole, AdminController.deleteUser); // Admin deletes a user
// router.get('/users', verifyAdminRole, AdminController.getAllUsers); // Admin gets all users

// // Admin routes to manage roles
// router.post('/roles', verifyAdminRole, AdminController.createRole);   // Admin creates a role
// router.put('/roles/:roleId', verifyAdminRole, AdminController.updateRole); // Admin updates a role
// router.delete('/roles/:roleId', verifyAdminRole, AdminController.deleteRole); // Admin deletes a role

// export default router;
