// import Role from '../Models/RoleModels.mjs';  // Role model
// import Permission from '../Models/RolePermissionModel.mjs';  // Permission model

// class RolePermissionRepository {
//   // Create a permission and save it
//   async createPermission(data) {
//     try {
//       const permission = new Permission(data);
//       await permission.save();
//       return permission;
//     } catch (error) {
//       console.error('Error creating permission:', error);
//       throw new Error(`Error creating permission: ${error.message}`);
//     }
//   }

//   // Get all permissions
//   async getAllPermissions() {
//     try {
//       return await Permission.find();
//     } catch (error) {
//       console.error('Error fetching all permissions:', error);
//       throw new Error(`Error fetching permissions: ${error.message}`);
//     }
//   }

//   // Get a specific permission by ID
//   async getPermissionById(permissionId) {
//     try {
//       const permission = await Permission.findById(permissionId);
//       if (!permission) {
//         throw new Error(`Permission with ID ${permissionId} not found`);
//       }
//       return permission;
//     } catch (error) {
//       console.error(`Error fetching permission with ID ${permissionId}:`, error);
//       throw new Error(`Error fetching permission by ID: ${error.message}`);
//     }
//   }

//   // Update permission by ID
//   async updatePermission(permissionId, data) {
//     try {
//       const updatedPermission = await Permission.findByIdAndUpdate(permissionId, data, { new: true });
//       if (!updatedPermission) {
//         throw new Error(`Permission with ID ${permissionId} not found`);
//       }
//       return updatedPermission;
//     } catch (error) {
//       console.error(`Error updating permission with ID ${permissionId}:`, error);
//       throw new Error(`Error updating permission: ${error.message}`);
//     }
//   }

//   // Delete permission by ID
//   async deletePermission(permissionId) {
//     try {
//       const deletedPermission = await Permission.findByIdAndDelete(permissionId);
//       if (!deletedPermission) {
//         throw new Error(`Permission with ID ${permissionId} not found`);
//       }
//       return deletedPermission;
//     } catch (error) {
//       console.error(`Error deleting permission with ID ${permissionId}:`, error);
//       throw new Error(`Error deleting permission: ${error.message}`);
//     }
//   }

//   // Assign permission to a role
//   async assignPermissionToRole(roleId, permissionId) {
//     try {
//       const role = await Role.findById(roleId);
//       if (!role) {
//         throw new Error(`Role with ID ${roleId} not found`);
//       }

//       const permission = await Permission.findById(permissionId);
//       if (!permission) {
//         throw new Error(`Permission with ID ${permissionId} not found`);
//       }

//       // Check if the permission is already assigned to the role
//       if (role.permissions.includes(permissionId)) {
//         throw new Error(`Permission with ID ${permissionId} is already assigned to the role`);
//       }

//       // Add permission to the role
//       role.permissions.push(permissionId);
//       await role.save();

//       return role;
//     } catch (error) {
//       console.error(`Error assigning permission with ID ${permissionId} to role ${roleId}:`, error);
//       throw new Error(`Error assigning permission to role: ${error.message}`);
//     }
//   }

//   // Remove permission from a role
//   async removePermissionFromRole(roleId, permissionId) {
//     try {
//       const role = await Role.findById(roleId);
//       if (!role) {
//         throw new Error(`Role with ID ${roleId} not found`);
//       }

//       // Check if the permission exists in the role
//       const permissionIndex = role.permissions.indexOf(permissionId);
//       if (permissionIndex === -1) {
//         throw new Error(`Permission with ID ${permissionId} not found in role ${roleId}`);
//       }

//       // Remove permission from role
//       role.permissions.splice(permissionIndex, 1);
//       await role.save();

//       return role;
//     } catch (error) {
//       console.error(`Error removing permission with ID ${permissionId} from role ${roleId}:`, error);
//       throw new Error(`Error removing permission from role: ${error.message}`);
//     }
//   }
// }

// export default new RolePermissionRepository();

import Role from '../Models/RoleModels.mjs';  // Role model
import RolePermission from '../Models/RolePermissionModel.mjs';  // RolePermission model

class RolePermissionRepository {
  // Create RolePermission with one or multiple permission IDs
  async createRolePermission(data) {
    try {
      const rolePermission = new RolePermission(data);
      await rolePermission.save();
      return rolePermission;
    } catch (error) {
      console.error('Error creating role-permission record:', error);
      throw new Error(`Creation failed: ${error.message}`);
    }
  }

  // Get all role-permission mappings
  async getAllRolePermissions() {
    try {
      return await RolePermission.find().populate('roleId').populate('permissionIds');
    } catch (error) {
      console.error('Error fetching all role-permission mappings:', error);
      throw new Error(`Fetch failed: ${error.message}`);
    }
  }

  // Get role-permission mapping by roleId
  async getPermissionsByRoleId(roleId) {
    try {
      const result = await RolePermission.findOne({ roleId }).populate('permissionIds');
      if (!result) throw new Error(`Permissions for role ${roleId} not found`);
      return result;
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      throw new Error(`Fetch failed: ${error.message}`);
    }
  }

  // Add permission(s) to a role
  async addPermissionsToRole(roleId, newPermissionIds) {
    try {
      const rolePermission = await RolePermission.findOne({ roleId });

      if (!rolePermission) {
        // Create new if not exists
        const newEntry = new RolePermission({ roleId, permissionIds: newPermissionIds });
        return await newEntry.save();
      }

      // Merge and deduplicate permissions
      const updatedPermissions = [...new Set([...rolePermission.permissionIds, ...newPermissionIds])];
      rolePermission.permissionIds = updatedPermissions;

      return await rolePermission.save();
    } catch (error) {
      console.error(`Error adding permissions to role ${roleId}:`, error);
      throw new Error(`Add failed: ${error.message}`);
    }
  }

  // Remove a permission from a role
  async removePermissionFromRole(roleId, permissionIdToRemove) {
    try {
      const rolePermission = await RolePermission.findOne({ roleId });

      if (!rolePermission) throw new Error(`Role ${roleId} not found`);

      const updatedPermissions = rolePermission.permissionId.filter(
        id => id !== permissionIdToRemove
      );

      rolePermission.permissionId = updatedPermissions;

      return await rolePermission.save();
    } catch (error) {
      console.error(`Error removing permission from role ${roleId}:`, error);
      throw new Error(`Remove failed: ${error.message}`);
    }
  }

  // Delete role-permission mapping by roleId
  async deleteRolePermission(roleId) {
    try {
      const deleted = await RolePermission.findOneAndDelete({ roleId });
      if (!deleted) throw new Error(`No entry found for role ${roleId}`);
      return deleted;
    } catch (error) {
      console.error(`Error deleting role-permission for ${roleId}:`, error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}

export default new RolePermissionRepository();
