import roleRepository from '../Repositories/RoleRepositories.mjs';

class RoleController {
  // Create a new role
  static async createRole(req, res) {
    try {
      const { name, permissions = [] } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
      }

      const newRole = await roleRepository.createRole(name, permissions);
      res.status(201).json(newRole);
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ error: 'Role already exists' });
      } else {
        console.error('Create Role Error:', err.message);
        res.status(400).json({ error: err.message });
      }
    }
  }

  // Get all roles
 static async getRoles(req, res) {
    try {
      const roles = await roleRepository.getAllRoles();
      res.status(200).json(roles);
    } catch (err) {
      console.error('Get Roles Error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  // Get a role by ID
 static async getRoleById(req, res) {
    try {
      const role = await roleRepository.getRoleById(req.params.roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.status(200).json(role);
    } catch (err) {
      console.error('Get Role By ID Error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  // async updateRole(req, res) {
  //   console.log('Incoming roleId:', req.params.roleId);  // Log incoming parameter
  //   const roleId = req.params.roleId;
    
  //   if (!roleId) {
  //     return res.status(400).json({ error: 'RoleId is missing from URL' });
  //   }
  
  //   // Continue with logic
  //   try {
  //     const updatedRole = await roleRepository.updateRole(roleId, req.body);
  //     res.status(200).json(updatedRole);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // }
  
  // Update an existing role
static async updateRole(req, res) {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({
        error: 'RoleId is missing from URL',
        message: 'Please provide a valid roleId in the URL'
      });
    }

    const updatedRole = await roleRepository.updateRole(roleId, req.body);

    if (!updatedRole) {
      return res.status(404).json({
        error: 'Role not found',
        message: 'The role with the provided roleId does not exist'
      });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      updatedRole
    });
  } catch (err) {
    console.error('Update Role Error:', err.message);
    res.status(500).json({
      error: err.message || 'Server Error',
      message: 'An error occurred while updating the role'
    });
  }
}


  // Delete an existing role
static async deleteRole(req, res) {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({
        error: 'RoleId is missing from URL',
        message: 'Please provide a valid roleId in the URL to delete the role'
      });
    }

    const deletedRole = await roleRepository.deleteRole(roleId);

    if (!deletedRole) {
      return res.status(404).json({
        error: 'Role not found',
        message: 'The role with the provided roleId does not exist'
      });
    }

    res.status(200).json({
      message: 'Role deleted successfully',
      deletedRole
    });
  } catch (err) {
    console.error('Delete Role Error:', err.message);
    res.status(500).json({
      error: err.message || 'Server Error',
      message: 'An error occurred while deleting the role'
    });
  }
}
}
export default  RoleController;
//module.exports = new RoleController();