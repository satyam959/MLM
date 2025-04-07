// import bcrypt from 'bcryptjs';
// import UserRepository from '../Repositories/UserRepository.mjs';
// import roleRepository from '../Repositories/RoleRepositories.mjs'; // Assuming this exists

// class AdminController {
//   // Create a new user (Admin only)
//   static async createUser(req, res) {
//     const { name, fullName, email, phone, address, password, role } = req.body;

//     try {
//       // Check if the password is provided
//       if (!password) {
//         return res.status(400).json({ message: 'Password is required' });
//       }

//       // Hash the password before saving it
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Set default role to 'user' if not provided
//       const userRole = role || 'user';  // Default to 'user' if no role is provided

//       // Create new user
//       const newUser = {
//         name,
//         fullName,
//         email,
//         phone,
//         address,
//         password: hashedPassword,
//         role: userRole,
//       };

//       // Create user using UserRepository
//       const createdUser = await UserRepository.createUser(newUser);
//       res.status(201).json({ message: 'User created successfully', createdUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error creating user', error: error.message });
//     }
//   }

//   // Update a user (Admin only)
//   static async updateUser(req, res) {
//     const { userId } = req.params;
//     const { name, fullName, email, phone, address, role } = req.body;

//     try {
//       // Admin can update any user info (including role)
//       const updatedUser = await UserRepository.updateUser(userId, { name, fullName, email, phone, address, role });
//       if (!updatedUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json({ message: 'User updated successfully', updatedUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error updating user', error: error.message });
//     }
//   }

//   // Delete a user (Admin only)
//   static async deleteUser(req, res) {
//     const { userId } = req.params;

//     try {
//       // Admin can delete users
//       const deletedUser = await UserRepository.deleteUser(userId);
//       if (!deletedUser) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error deleting user', error: error.message });
//     }
//   }

//   // Get all users (Admin only)
//   static async getAllUsers(req, res) {
//     try {
//       const users = await UserRepository.getAllUsers();
//       res.status(200).json({ users });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error fetching users', error: error.message });
//     }
//   }

//   // Manage Roles (Admin only)
//   static async createRole(req, res) {
//     const { name, description } = req.body;

//     try {
//       // Admin can create new roles
//       const newRole = await roleRepository.createRole(name, description);
//       res.status(201).json({ message: 'Role created successfully', newRole });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error creating role', error: error.message });
//     }
//   }

//   // Update a role (Admin only)
//   static async updateRole(req, res) {
//     const { roleId } = req.params;
//     const { name, description } = req.body;

//     try {
//       // Admin can update a role's name and description
//       const updatedRole = await roleRepository.updateRoleById(roleId, name, description);
//       if (!updatedRole) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.status(200).json({ message: 'Role updated successfully', updatedRole });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error updating role', error: error.message });
//     }
//   }

//   // Delete a role (Admin only)
//   static async deleteRole(req, res) {
//     const { roleId } = req.params;

//     try {
//       // Admin can delete roles
//       const deletedRole = await roleRepository.deleteRoleById(roleId);
//       if (!deletedRole) {
//         return res.status(404).json({ message: 'Role not found' });
//       }
//       res.status(200).json({ message: 'Role deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error deleting role', error: error.message });
//     }
//   }
// }

// export default AdminController;


// Controllers/AdminController.mjs
import roleRepository from '../Repositories/RoleRepositories.mjs';  // Assuming this exists and is used for role operations

class AdminController {
  // Create a new role (Admin only)
  static async createRole(req, res) {
    const { role, description } = req.body;  // Update to 'role' instead of 'name'

    try {
      // Validate input
      if (!role || role.trim() === "") {
        return res.status(400).json({ message: "Role is required" });
      }

      // Check if the role already exists by role name
      const existingRole = await roleRepository.findRoleByRole(role);  // Search by 'role'
      if (existingRole) {
        return res.status(400).json({ message: `Role with name '${role}' already exists` });
      }

      // Create the new role
      const newRole = await roleRepository.createRole(role, description);  // Create role using 'role'
      res.status(201).json({ message: 'Role created successfully', newRole });
    } catch (error) {
      res.status(500).json({ message: 'Error creating role', error: error.message });
    }
  }

  // Other methods...
}

export default AdminController;
