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


async getAllRolePermissions(req, res) {
  try {
    const rolePermissions = await RolePermission.aggregate([
      {
        $lookup: {
          from: 'roles', // Collection name
          localField: 'roleId',
          foreignField: 'roleId',
          as: 'roleDetails'
        }
      },
      {
        $unwind: {
          path: '$roleDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'permissionId',
          foreignField: 'permissionId',
          as: 'permissionDetails'
        }
      },
      {
        $unwind: {
          path: '$permissionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          roleName: '$roleDetails.name',
          permissionName: '$permissionDetails.name'
        }
      },
      {
        $project: {
          roleDetails: 0,
          permissionDetails: 0
        }
      }
    ]);

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
    const { roleId } = req.params;
    const { permissionId } = req.body;

    // Validate that permissionId is an array of numbers
    if (!Array.isArray(permissionId) || !permissionId.every(id => typeof id === 'number')) {
      return res.status(400).json({ error: 'permissionId must be an array of numbers in request body' });
    }

    const mapping = await RolePermission.findOne({ roleId: Number(roleId) });

    if (!mapping) {
      return res.status(404).json({ error: 'RolePermission mapping not found for this roleId' });
    }

    // Filter out the permissions to be removed
    const originalLength = mapping.permissionId.length;
    mapping.permissionId = mapping.permissionId.filter(id => !permissionId.includes(id));

    // Check if any permission was actually removed
    if (mapping.permissionId.length === originalLength) {
      return res.status(404).json({ error: 'None of the permissions were found in role' });
    }

    await mapping.save();

    return res.status(200).json({
      message: 'Permissions successfully removed from role',
      data: mapping,
    });

  } catch (err) {
    console.error('Error removing permission(s) from role:', err);
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
