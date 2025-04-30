import mongoose from 'mongoose';

const IncomeLevelSchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true, 
  },
  team: {
    type: Number,
    required: true, 
  },
  total: {
    type: Number,
    required: true, 
  },
  status: {
    type: Boolean,  
    default: true,   
  },
  level: {
    type: Number,
    required: true, 
  },
   incomeId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },

}, {
  timestamps: true, 
});

const IncomeLevel = mongoose.model('IncomeLevel', IncomeLevelSchema);

export default IncomeLevel;
