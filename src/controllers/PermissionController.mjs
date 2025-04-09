import Permission from '../Models/PermissionModels.mjs';  

class PermissionController {
  // Create a new permission
  static async createPermission(req, res) {
    const { name, description } = req.body;

    try {
      const permission = new Permission({ name, description });
      await permission.save();  
      res.status(201).json(permission);  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get all permissions
  static async getAllPermissions(req, res) {
    try {
      const permissions = await Permission.find();  
      res.json(permissions);  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a permission by ID
  static async getPermissionById(req, res) {
    const { id } = req.params;

    try {
      const permission = await Permission.findById(id);  // Find the permission by ID
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json(permission);  // Return the permission
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a permission by ID
  static async updatePermission(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const updatedPermission = await Permission.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }  // Return the updated permission
      );

      if (!updatedPermission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      res.json(updatedPermission);  // Return the updated permission
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a permission by ID
  static async deletePermission(req, res) {
    const { id } = req.params;

    try {
      const deletedPermission = await Permission.findByIdAndDelete(id);  // Delete the permission by ID

      if (!deletedPermission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      res.json({ message: 'Permission deleted successfully' });  // Return success message
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default PermissionController;
