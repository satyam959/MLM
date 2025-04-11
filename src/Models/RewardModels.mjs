import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reward: { type: String, required: true },
  value: { type: String },

  status: {
    type: Boolean,
    default: true  // By default, the status is 'active' (true)
  },
  rewardId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },

});

{ timestamps: true }   // Automatically adds 'createdAt' and 'updatedAt' fields

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;