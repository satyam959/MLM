import mongoose from 'mongoose';

const RoyaltySchema = new mongoose.Schema(
  {
    rank: { type: String, required: true, trim: true },
    dailyRoyalty: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: false },
    royaltyId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true
    }
  },
  { timestamps: true,} 
);

// Create a custom id field and use royaltyId as the identifier
RoyaltySchema.virtual('id').get(function() {
  return this.royaltyId;
});

const RoyaltyModel = mongoose.model('Royalty', RoyaltySchema);

export default RoyaltyModel;
