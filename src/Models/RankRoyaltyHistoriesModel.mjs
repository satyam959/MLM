import mongoose from 'mongoose';

const RankRoyaltyHistoriesSchema = new mongoose.Schema({
  rankId: {
    type: Number, // ✅ Use Number instead of ObjectId
    required: true,
  },
  totalUsers: {
    type: Number,
    required: true,
  },
  totalAmountPaid: {
    type: Number,
    required: true,
  },
  perUserAmount: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true 
});

const RankRoyalty = mongoose.model('RankRoyaltyHistories', RankRoyaltyHistoriesSchema);
export default RankRoyalty;
