import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,   
      unique: true,     
      trim: true        
    },
  },
  { timestamps: true }   // Automatically adds 'createdAt' and 'updatedAt' fields
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
