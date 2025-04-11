import mongoose from 'mongoose';

const rankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  benefits: {
    type: String,
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // Specify valid statuses
    default: 'active'              // Set default status
  },
}, {
  timestamps: true,
});

const Rank = mongoose.model('Rank', rankSchema);
export default Rank;
