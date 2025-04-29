import mongoose from 'mongoose';

const rankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true  // Default status is true (active) 
    },
    rankId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },
  },
  {
    timestamps: true, // ✅ Correctly placed
  }
);

const Rank = mongoose.model('Rank', rankSchema);
export default Rank;
