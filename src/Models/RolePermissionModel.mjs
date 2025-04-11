import mongoose from 'mongoose';
import Permission from './PermissionModels.mjs';  // Import the Permission schema
import Role from './RoleModels.mjs';              // Import the Role schema

const { Schema } = mongoose;

const rolePermissionSchema = new Schema({
  roleId: {
    type: Number,
    required: true
  },
  permissionId: [{
    type: Number,
    required: true
  }],
  status: {
    type: Boolean,
    default: true  // By default, the status is 'active' (true)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

export default RolePermission;
