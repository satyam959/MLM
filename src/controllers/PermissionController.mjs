import PermissionRepository from '../Repositories/PermissionRepository.mjs';

class PermissionController {
  static async createPermission(req, res) {
    const { name, description } = req.body;
    try {
      const permission = await PermissionRepository.create({ name, description });
      res.status(201).json(permission);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getAllPermissions(req, res) {
    try {
      const permissions = await PermissionRepository.find();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getPermissionById(req, res) {
    const { id } = req.params;
    try {
      const permission = await PermissionRepository.findById(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json(permission);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async updatePermission(req, res) {
    const { permissionId } = req.params;
    const { name, description } = req.body;
    try {
      const updatedPermission = await PermissionRepository.update(permissionId, { name, description });
      if (!updatedPermission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json(updatedPermission);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async deletePermission(req, res) {
    const { permissionId } = req.params;
    try {
      const deletedPermission = await PermissionRepository.delete(permissionId);
      if (!deletedPermission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default PermissionController;
