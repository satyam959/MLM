import Role from '../Models/RoleModels.mjs';
import RolePermission from '../Models/RolePermissionModel.mjs';

class RoleRepository {
  // Create a new role
  async createRole(name, permissions = []) {
    try {
      // Check if the role already exists
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        throw new Error('Role already exists');
      }

      // Create a new role with permissions (optional)
      const newRole = new Role({
        name,
        permissions,  // Permissions array can be passed here
      });

      await newRole.save();
      return newRole;
    } catch (error) {
      throw new Error(`Error creating role: ${error.message}`);
    }
  }

  // Get all roles
  async getAllRoles() {
    try {
      return await Role.find();
    } catch (error) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  // Get a role by ID
  async getRoleById(roleId) {
    try {
 const role = await Role.findOne({ roleId: Number(roleId) });
      if (!role) {
        throw new Error('Role not found');
      }
      return role;
    } catch (error) {
      throw new Error(`Error fetching role by ID: ${error.message}`);
    }
  }

  // Update a role by ID
  async updateRoleById(id, name, permissions = []) {
    try {
      const updatedRole = await Role.findByIdAndUpdate(
        id, 
        { name, permissions },  // Update name and permissions
        { new: true }  // Return the updated role
      );
      if (!updatedRole) {
        throw new Error('Role not found');
      }
      return updatedRole;
    } catch (error) {
      throw new Error(`Error updating role: ${error.message}`);
    }
  }

  // Delete a role by ID
  async deleteRoleById(id) {
    try {
      const deletedRole = await Role.findByIdAndDelete(id);
      if (!deletedRole) {
        throw new Error('Role not found');
      }
      return deletedRole;
    } catch (error) {
      throw new Error(`Error deleting role: ${error.message}`);
    }
  }
}

export default new RoleRepository();
