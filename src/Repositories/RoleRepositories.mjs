import Role from '../Models/RoleModels.mjs';

class RoleRepository {
  // Create a new role
  async createRole(name) {
    // Check if the role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      throw new Error('Role already exists');
    }

    const newRole = new Role({ name });
    await newRole.save();
    return newRole;
  }

  // Get all roles
  async getAllRoles() {
    return await Role.find();
  }

  // Get a role by ID
  async getRoleById(id) {
    return await Role.findById(id);
  }

  // Update a role by ID
  async updateRoleById(id, name) {
    return await Role.findByIdAndUpdate(id, { name }, { new: true });
  }

  // Delete a role by ID
  async deleteRoleById(id) {
    return await Role.findByIdAndDelete(id);
  }
}

export default new RoleRepository();
