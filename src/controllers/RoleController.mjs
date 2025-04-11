import roleRepository from '../Repositories/RoleRepositories.mjs';  // Correct path

class RoleController {
  // Create a new role
  async createRole(req, res) {
    try {
      const { name } = req.body;

      // Check if 'name' is provided
      if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
      }

      const newRole = await roleRepository.createRole(name);
      res.status(201).json(newRole); // Return the created role
    } catch (err) {
      if (err.code === 11000) {  // Duplicate key error code (unique constraint violation)
        res.status(400).json({ error: 'Role already exists' });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  }

  // Get all roles
  async getRoles(req, res) {
    try {
      const roles = await roleRepository.getAllRoles();
      res.status(200).json(roles); // Return the list of roles
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get a role by ID
  async getRoleById(req, res) {
    try {
      const role = await roleRepository.getRoleById(req.params.roleId);
      res.status(200).json(role); // Return the role
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Update a role by ID
  async updateRole(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
      }

      const updatedRole = await roleRepository.updateRoleById(req.params.id, name);
      res.status(200).json(updatedRole); // Return the updated role
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Delete a role by ID
  async deleteRole(req, res) {
    try {
      const deletedRole = await roleRepository.deleteRoleById(req.params.id);
      res.status(200).json({ message: 'Role deleted successfully', role: deletedRole });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new RoleController();
