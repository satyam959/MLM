import mongoose from 'mongoose';

const IncomeLevelSchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true, // Ensure that the income field is always provided
  },
  team: {
    type: Number,
    required: true, // Ensure that the team field is always provided
  },
  total: {
    type: Number,
    required: true, // Ensure that the total field is always provided
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'], // Valid status values
    default: 'active', // Default status value
  },
  level: {
    type: Number,
    required: true, // Ensure that the level field is always provided
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const IncomeLevel = mongoose.model('IncomeLevel', IncomeLevelSchema);

export default IncomeLevel;
