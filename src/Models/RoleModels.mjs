import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,   
      unique: true,     
      trim: true        
    },
    status: {
      type: Boolean,  // Corrected to Boolean type (capital B)
      default: true,   // Default status is true
    },
    roleId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },

  },
  { timestamps: true }   // Automatically adds 'createdAt' and 'updatedAt' fields
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
