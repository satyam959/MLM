// import mongoose from 'mongoose';
// import roleRepository from '../Repositories/RoleRepositories.mjs';  // Role repository
// import permissionRepository from '../Repositories/PermissionRepository.mjs';  // Permission repository
// import RolePermission from '../Models/RolePermissionModel.mjs';  // RolePermission model
// import Role from '../Models/RoleModels.mjs';  // Role model
// import Permission from '../Models/PermissionModels.mjs';  // Permission model

// class RolePermissionController {

//   // Create a permission for a specific role
//   async createPermissionForRole(req, res) {
//     try {
//       // Log the body for debugging purposes
//       console.log('Request Body:', req.body);

//       const { roleId, permissionId } = req.body;

//       // Step 1: Validate inputs
//       if (!roleId || !permissionId) {
//         return res.status(400).json({ error: 'Both roleId and permissionId are required' });
//       }

//       // Step 2: Ensure roleId and permissionId are valid numbers
//       if (isNaN(roleId) || isNaN(permissionId)) {
//         return res.status(400).json({ error: 'roleId and permissionId must be valid numbers' });
//       }

//       console.log('Received roleId:', roleId, 'permissionId:', permissionId);

//       // Step 3: Fetch the role by roleId
//       const role = await Role.findOne({ roleId });

//       // Check if role exists
//       if (!role) {
//         console.log(`Role with ID ${roleId} not found.`);
//         return res.status(404).json({ error: 'Role not found' });
//       }

//       // Step 4: Fetch the permission by permissionId
//       const permission = await Permission.findOne({ permissionId });

//       // Check if permission exists
//       if (!permission) {
//         console.log(`Permission with ID ${permissionId} not found.`);
//         return res.status(404).json({ error: 'Permission not found' });
//       }

//       // Step 5: Check if the permission is already assigned to this role
//       const existingRolePermission = await RolePermission.findOne({ roleId, permissionId });

//       if (existingRolePermission) {
//         return res.status(400).json({ error: 'Permission already assigned to this role' });
//       }

//       // Step 6: Create the new RolePermission relationship
//       const newRolePermission = new RolePermission({
//         roleId,
//         permissionId
//       });

//       // Step 7: Save the new RolePermission document
//       await newRolePermission.save();

//       // Step 8: Respond with success
//       res.status(201).json({ message: 'Permission successfully assigned to role', permission });
//     } catch (err) {
//       console.error('Error creating permission for role:', err);
//       res.status(500).json({ error: 'Server error: ' + err.message });
//     }
//   }

//   // Get all permissions of a role by roleId
//   async getPermissionsByRoleId(req, res) {
//     try {
//       const { roleId } = req.params;  // Get roleId from params

//       // Fetch the role with populated permissions
//       const role = await roleRepository.getRoleById(roleId);

//       if (!role) {
//         return res.status(404).json({ error: 'Role not found' });
//       }

//       // Get all permissions for the role
//       const permissions = await RolePermission.find({ roleId }).populate('permissionId');

//       if (permissions.length === 0) {
//         return res.status(404).json({ error: 'No permissions assigned to this role' });
//       }

//       res.status(200).json({ role, permissions: permissions.map(p => p.permissionId) });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error: ' + err.message });
//     }
//   }

//   // Get a specific permission for a role by permissionId
//   async getPermissionForRole(req, res) {
//     try {
//       const { roleId, permissionId } = req.params;  // Get roleId and permissionId from params

//       // Find the role by roleId
//       const role = await roleRepository.getRoleById(roleId);
//       if (!role) {
//         return res.status(404).json({ error: 'Role not found' });
//       }

//       // Check if the permission exists in the role's permissions
//       const permission = await RolePermission.findOne({ roleId, permissionId }).populate('permissionId');
//       if (!permission) {
//         return res.status(404).json({ error: 'Permission not found in this role' });
//       }

//       res.status(200).json({ permission: permission.permissionId });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error: ' + err.message });
//     }
//   }

//   // Update a permission for a specific role by permissionId
//   async updatePermissionForRole(req, res) {
//     try {
//       const { roleId, permissionId } = req.params;  // Get roleId and permissionId from params
//       const { name, description } = req.body;

//       // Check if both name and description are provided
//       if (!name || !description) {
//         return res.status(400).json({ error: 'Permission name and description are required' });
//       }

//       // Find the role by roleId
//       const role = await roleRepository.getRoleById(roleId);
//       if (!role) {
//         return res.status(404).json({ error: 'Role not found' });
//       }

//       // Check if the permission exists in the role's permissions
//       const permissionIndex = role.permissions.indexOf(permissionId);
//       if (permissionIndex === -1) {
//         return res.status(404).json({ error: 'Permission not found in this role' });
//       }

//       // Update the permission
//       const updatedPermission = await permissionRepository.updatePermission(permissionId, { name, description });

//       res.status(200).json({ message: 'Permission updated successfully', permission: updatedPermission });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error: ' + err.message });
//     }
//   }

//   // Remove a permission from a specific role
//   async removePermissionFromRole(req, res) {
//     try {
//       const { roleId, permissionId } = req.params;  // Get roleId and permissionId from params

//       // Find the role by roleId
//       const role = await roleRepository.getRoleById(roleId);
//       if (!role) {
//         return res.status(404).json({ error: 'Role not found' });
//       }

//       // Check if the permission exists in the role's permissions
//       const permissionIndex = role.permissions.indexOf(permissionId);
//       if (permissionIndex === -1) {
//         return res.status(404).json({ error: 'Permission not found in this role' });
//       }

//       // Remove the permission from the role
//       role.permissions.splice(permissionIndex, 1);
//       await role.save();

//       // Delete the permission itself
//       await permissionRepository.deletePermission(permissionId);

//       res.status(200).json({ message: 'Permission removed successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error: ' + err.message });
//     }
//   }
// }

// export default new RolePermissionController();




import mongoose from 'mongoose';
import roleRepository from '../Repositories/RoleRepositories.mjs';
import permissionRepository from '../Repositories/PermissionRepository.mjs';
import RolePermission from '../Models/RolePermissionModel.mjs';
import Role from '../Models/RoleModels.mjs';
import Permission from '../Models/PermissionModels.mjs';

class RolePermissionController {
  async createPermissionForRole(req, res) {
    try {
      const { roleId, permissionIds } = req.body;
  
      // Step 1: Validate inputs
      if (!roleId || !permissionIds) {
        return res.status(400).json({ error: 'roleId and permissionIds (array) are required' });
      }
  
      // Convert single permissionId to array if needed
      const permissionsArray = Array.isArray(permissionIds) ? permissionIds : [permissionIds];
  
      // Step 2: Ensure roleId is a number
      if (isNaN(roleId)) {
        return res.status(400).json({ error: 'roleId must be a valid number' });
      }
  
      // Step 3: Ensure all permissionIds are numbers
      const invalidIds = permissionsArray.filter(id => isNaN(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({ error: 'All permissionIds must be valid numbers' });
      }
  
      // Step 4: Check if the role exists
      const role = await Role.findOne({ roleId });
      if (!role) {
        return res.status(404).json({ error: `Role with ID ${roleId} not found` });
      }
  
      // Step 5: Verify permissions and prepare a set of valid ones
      const validPermissions = await Permission.find({ permissionId: { $in: permissionsArray } });
  
      if (validPermissions.length === 0) {
        return res.status(404).json({ error: 'No valid permissions found for the provided IDs' });
      }
  
      const validPermissionIds = validPermissions.map(p => p.permissionId);
  
      // Step 6: Create or update RolePermission document
      let rolePermission = await RolePermission.findOne({ roleId });
  
      if (rolePermission) {
        // Filter out already existing permissions
        const newPermissions = validPermissionIds.filter(
          pid => !rolePermission.permissionId.includes(pid)
        );
  
        if (newPermissions.length === 0) {
          return res.status(400).json({ error: 'All provided permissions are already assigned to this role' });
        }
  
        rolePermission.permissionId.push(...newPermissions);
      } else {
        // Create new entry
        rolePermission = new RolePermission({
          roleId,
          permissionId: validPermissionIds
        });
      }
  
      await rolePermission.save();
  
      res.status(201).json({
        message: 'Permissions successfully assigned to role',
        assignedPermissions: validPermissionIds
      });
    } catch (err) {
      console.error('Error assigning permissions to role:', err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
  

  // Get all permissions assigned to a role
  async getPermissionsByRoleId(req, res) {
    try {
      const { roleId } = req.params;

      const role = await Role.findOne({ roleId });
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      const rolePermissions = await RolePermission.findOne({ roleId });
      if (!rolePermissions || rolePermissions.permissionId.length === 0) {
        return res.status(404).json({ error: 'No permissions assigned to this role' });
      }

      const permissions = await Permission.find({ permissionId: { $in: rolePermissions.permissionId } });

      res.status(200).json({ roleId, permissions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }

  // Get a specific permission assigned to a role
  async getPermissionForRole(req, res) {
    try {
      const { roleId, permissionId } = req.params;

      const mapping = await RolePermission.findOne({ roleId });
      if (!mapping || !mapping.permissionId.includes(Number(permissionId))) {
        return res.status(404).json({ error: 'Permission not found in this role' });
      }

      const permission = await Permission.findOne({ permissionId: Number(permissionId) });
      if (!permission) {
        return res.status(404).json({ error: 'Permission not found' });
      }

      res.status(200).json({ permission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }

  // Update all permissions for a role by roleId
async updatePermissionForRole(req, res) {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    // Validate input
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({ error: 'permissionIds (non-empty array) is required' });
    }

    const areValidPermissions = permissionIds.every(id => typeof id === 'number' && !isNaN(id));
    if (!areValidPermissions) {
      return res.status(400).json({ error: 'All permissionIds must be valid numbers' });
    }

    // Update the permissions
    const updated = await RolePermission.findOneAndUpdate(
      { roleId: Number(roleId) },
      { $set: { permissionId: permissionIds } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'RolePermission mapping not found for this roleId' });
    }

    return res.status(200).json({
      message: 'Permissions updated successfully for the role',
      data: updated,
    });

  } catch (err) {
    console.error('Error updating permissions for role:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}

  // Get all role-permission mappings
async getAllRolePermissions(req, res) {
  try {
    const rolePermissions = await RolePermission.find();

    if (rolePermissions.length === 0) {
      return res.status(404).json({ error: 'No role-permission mappings found' });
    }

    res.status(200).json({
      message: 'Role-permission mappings retrieved successfully',
      data: rolePermissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
}


async removePermissionFromRole(req, res) {
  try {
    const { roleId, permissionId } = req.params;

    const mapping = await RolePermission.findOne({ roleId: Number(roleId) });

    if (!mapping) {
      return res.status(404).json({ error: 'RolePermission mapping not found for this roleId' });
    }

    const permissionIdNum = Number(permissionId);
    const index = mapping.permissionId.indexOf(permissionIdNum);

    if (index === -1) {
      return res.status(404).json({ error: 'Permission not found in role' });
    }

    // Remove the permission
    mapping.permissionId.splice(index, 1);

    await mapping.save();

    return res.status(200).json({
      message: 'Permission successfully removed from role',
      data: mapping,
    });

  } catch (err) {
    console.error('Error removing permission from role:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
async deleteRoleById(req, res) {
  try {
    const { roleId } = req.params;

    const deleted = await RolePermission.findOneAndDelete({ roleId: Number(roleId) });

    if (!deleted) {
      return res.status(404).json({ error: 'Role not found with given roleId' });
    }

    res.status(200).json({ message: 'Role deleted successfully', data: deleted });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
}



}
  


export default new RolePermissionController();
