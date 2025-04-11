import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Ensures 'name' is required
      unique: true,    // Ensures 'name' is unique
    },
    description: {
      type: String,
      required: true,  // Ensures 'description' is required     
    },
    permissionId: { 
      type: Number, 
      default: () => Math.floor(100000 + Math.random() * 900000), 
      unique: true 
    },
    status: { 
      type: Boolean, 
      default: true  // Default status is true (active) 
    }
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Permission model
const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
