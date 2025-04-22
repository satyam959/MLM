import Role from '../Models/RoleModels.mjs';

const roleRepository = {
  // Create a new role
  async createRole(name, permissions = []) {
    const newRole = new Role({
      name,
      permissions,
    });
    return await newRole.save();
  },

  // Get all roles
  async getAllRoles() {
    return await Role.find();
  },

  // Get a role by custom roleId
  async getRoleById(roleId) {
    const parsedId = parseInt(roleId);
    if (isNaN(parsedId)) {
      throw new Error('Invalid roleId');
    }
    return await Role.findOne({ roleId: parsedId });
  },

  // Update a role by custom roleId
  async updateRole(roleId, updateData) {
    const parsedId = parseInt(roleId);
    if (isNaN(parsedId)) {
      throw new Error('Invalid roleId');
    }
    return await Role.findOneAndUpdate({ roleId: parsedId }, updateData, {
      new: true,
      runValidators: true,
    });
  },

  // Delete a role by custom roleId
  async deleteRole(roleId) {
    const parsedId = parseInt(roleId);
    if (isNaN(parsedId)) {
      throw new Error('Invalid roleId');
    }
    return await Role.findOneAndDelete({ roleId: parsedId });
  }
};

export default roleRepository;
