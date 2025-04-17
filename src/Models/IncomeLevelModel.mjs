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
    type: Boolean,  // Corrected type to Boolean (not 'boolean' or 'boolean' from 'webidl-conversions')
    default: true,   // Default to true
  },
  level: {
    type: Number,
    required: true, // Ensure that the level field is always provided
  },
   incomeLevelId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const IncomeLevel = mongoose.model('IncomeLevel', IncomeLevelSchema);

export default IncomeLevel;
