import permissionRepository from '../Repositories/PermissionRepository.mjs';

class PermissionController {
  async createPermission(req, res) {
    try {
      const permission = await permissionRepository.create(req.body);
      res.status(201).json({
        message: 'Permission created successfully.',
        data: permission
      });
    } catch (error) {
      res.status(400).json({ 
        message: 'Failed to create permission.',
        error: error.message 
      });
    }
  }
  
  

  async getPermissions(req, res) {
    try {
      const permissions = await permissionRepository.findAll();
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPermissionById(req, res) {
    try {
      const permission = await permissionRepository.findById(req.params.id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePermission(req, res) {
    try {
      const updatedPermission = await permissionRepository.updateByPermissionId(
        req.params.permissionId,
        req.body
      );
  
      if (!updatedPermission) {
        return res.status(404).json({
          message: 'Permission not found. Update failed.',
        });
      }
  
      res.status(200).json({
        message: 'Permission updated successfully.',
        data: updatedPermission,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to update permission.',
        error: error.message,
      });
    }
  }
  
  
  
  async deletePermission(req, res) {
    try {
      const deleted = await permissionRepository.deleteByPermissionId(req.params.permissionId);
  
      if (!deleted) {
        return res.status(404).json({
          message: 'Permission not found. Deletion failed.',
        });
      }
  
      res.status(200).json({
        message: 'Permission deleted successfully.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete permission.',
        error: error.message,
      });
    }
  }
}  

export default new PermissionController();
