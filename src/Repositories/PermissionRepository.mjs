import Permission from '../Models/PermissionModels.mjs';

class PermissionRepository {
  static async createPermission(data) {
    const permission = new Permission(data);
    await permission.save();
    return permission;
  }

  static async getAllPermissions() {
    return Permission.find();
  }

  static async getPermissionById(permissionId) {
    return Permission.findById(permissionId);
  }

  static async updatePermission(permissionId, data) {
    return Permission.findByIdAndUpdate(permissionId, data, { new: true });
  }

  static async deletePermission(permissionId) {
    return Permission.findByIdAndDelete(permissionId);
  }
}

export default new PermissionRepository ();
