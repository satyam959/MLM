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

  async update(id, data) {
    return await PermissionModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await PermissionModel.findByIdAndDelete(id);
  }
};

export default PermissionRepository;
