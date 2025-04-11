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
    type: Boolean,
    enum: [true, false], // Corrected enum to actual Boolean values
    default: false // default should be a Boolean, not an empty string
  },
  royaltyId:{ type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
}, { timestamps: true });

const RoyaltyModel = mongoose.model('Royalty', RoyaltySchema);
export default RoyaltyModel;



