import Permission from '../Models/PermissionModels.mjs';

class PermissionRepository {
   async createPermission(data) {
    const permission = new Permission(data);
    await permission.save();
    return permission;
  }

   async getAllPermissions() {
    return Permission.find();
  }

  async getPermissionById(permissionId) {
    return Permission.findOne({ permissionId: permissionId }); // Now querying by the custom field
  }

   async updatePermission(permissionId, data) {
    return Permission.findByIdAndUpdate(permissionId,  data, { new: true });
  }

   async deletePermission(permissionId) {
    return Permission.findByIdAndDelete(permissionId);
  }
}

export default new PermissionRepository();
