// import PermissionRepository from '../Repositories/PermissionRepository.mjs';

// class PermissionController {
//   static async createPermission(req, res) {
//     const { name, description } = req.body;
//     try {
//       const permission = await PermissionRepository.create({ name, description });
//       res.status(201).json(permission);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }

//   static async getAllPermissions(req, res) {
//     try {
//       const permissions = await PermissionRepository.find();
//       res.json(permissions);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }

//   static async getPermissionById(req, res) {
//     const { id } = req.params;
//     try {
//       const permission = await PermissionRepository.findById(id);
//       if (!permission) {
//         return res.status(404).json({ message: 'Permission not found' });
//       }
//       res.json(permission);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }

//   static async updatePermission(req, res) {
//     const { permissionId } = req.params;
//     const { name, description } = req.body;
//     try {
//       const updatedPermission = await PermissionRepository.update(permissionId, { name, description });
//       if (!updatedPermission) {
//         return res.status(404).json({ message: 'Permission not found' });
//       }
//       res.json(updatedPermission);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }

//   static async deletePermission(req, res) {
//     const { permissionId } = req.params;
//     try {
//       const deletedPermission = await PermissionRepository.delete(permissionId);
//       if (!deletedPermission) {
//         return res.status(404).json({ message: 'Permission not found' });
//       }
//       res.json({ message: 'Permission deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }
// }

// export default PermissionController;



import permissionRepository from '../Repositories/PermissionRepository.mjs';

class PermissionController {
  async createPermission(req, res) {
    try {
      const permission = await permissionRepository.create(req.body);
      res.status(201).json(permission);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      const updatedPermission = await permissionRepository.updateByPermissionId(req.params.permissionId, req.body);
      if (!updatedPermission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.status(200).json({
        message: 'Permission updated successfully',
        data: updatedPermission,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  
  async deletePermission(req, res) {
    try {
      const deleted = await permissionRepository.deleteByPermissionId(req.params.permissionId);
      if (!deleted) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}  

export default new PermissionController();
