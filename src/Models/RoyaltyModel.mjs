import mongoose from 'mongoose';

const RoyaltySchema = new mongoose.Schema({
  rank: {
    type: String,
    required: true // (corrected from 'require' to 'required')
  },
  dailyRoyalty: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // optional: define allowed values
    default: 'active'
  }
}, { timestamps: true });

const RoyaltyModel = mongoose.model('Royalty', RoyaltySchema);
export default RoyaltyModel;



