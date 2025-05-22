import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: Boolean,
      default: true,
    },

    walletId: {
      type: Number,
      unique: true,
      default: () => Math.floor(100000 + Math.random() * 900000), // 6-digit random
    },

    userId: {
      type: Number,
      ref: 'User',
      required: true,
    },

    // ✅ New fields for top-up control
    dailyTopupsCount: {
      type: Number,
      default: 0,
    },

    lastTopupDate: {
      type: Date,
      default: null,
    },
    lastTeamRewardDate: {
      type: String,
      default: null, // Or leave it undefined initially
    },
    
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
