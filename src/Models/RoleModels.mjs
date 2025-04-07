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
      type: String,
      enum: ['active', 'inactive'], // Specify valid statuses
      default: 'active'              // Set default status
    },
  },
  { timestamps: true }   // Automatically adds 'createdAt' and 'updatedAt' fields
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
