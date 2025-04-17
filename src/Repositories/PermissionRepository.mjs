import PermissionModel from '../Models/PermissionModels.mjs';

const PermissionRepository = {
  async find() {
    return await PermissionModel.find();
  },

  async findById(id) {
    return await PermissionModel.findById(id);
  },

  async create(data) {
    const permission = new PermissionModel(data);
    return await permission.save();
  },

  async update(permissionId, data) {
    return await PermissionModel.findByIdAndUpdate(permissionId, data, { new: true });
  },

  async delete(permissionId) {
    return await PermissionModel.findByIdAndDelete(permissionId);
  }
};

export default PermissionRepository;
