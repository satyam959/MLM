// import PermissionModel from '../Models/PermissionModels.mjs';

// const PermissionRepository = {
//   async find() {
//     return await PermissionModel.find();
//   },

//   async findById(id) {
//     return await PermissionModel.findById(id);
//   },

//   async create(data) {
//     const permission = new PermissionModel(data);
//     return await permission.save();
//   },

//   async update(permissionId, data) {
//     return await PermissionModel.findByIdAndUpdate(permissionId, data, { new: true });
//   },

//   async delete(permissionId) {
//     return await PermissionModel.findByIdAndDelete(permissionId);
//   }
// };

// export default PermissionRepository;


import Permission from '../Models/PermissionModels.mjs';

class PermissionRepository {
  async create(permissionData) {
    const permission = new Permission(permissionData);
    return await permission.save();
  }

  async findAll() {
    return await Permission.find();
  }

  async findById(id) {
    return await Permission.findById(id);
  }

  async findByName(name) {
    return await Permission.findOne({ name });
  }

  async updateByPermissionId(permissionId, updateData) {
    return await Permission.findOneAndUpdate(
      { permissionId: Number(permissionId) },
      updateData,
      { new: true }
    );
  }
  
  async deleteByPermissionId(permissionId) {
    return await Permission.findOneAndDelete({ permissionId: Number(permissionId) });
  }
  
}

export default new PermissionRepository();
