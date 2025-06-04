import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Wallet from "./WalletModels.mjs";

// Generate unique referral code
function generateReferralCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    city: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    state: { type: String, default: "" },
    role: { type: String, default: "" },
    status: { type: Boolean, default: true },

    referralCode: {
      type: String,
      unique: true,
      default: generateReferralCode,
    },
    royaltyIncome: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: mongoose.Types.Decimal128.fromString("0.00"),
    },
    monthlyReward: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: mongoose.Types.Decimal128.fromString("0.00"),
    },
    referredBy: {
      type: Number,
      ref: "User",
      default: null,
    },

    userId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },

    dob: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
    whatsapp: {
      type: Number,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    image: { type: String, default: false },
    referrerName: { type: String },
    hierarchy: { type: [Number], default: [] },
    level: {
      type: Number,
      default: 1,
    },

    membership: {
      type: new mongoose.Schema(
        {
          type: {
            type: Number,
            enum: [0, 1], // 0 = Basic, 1 = Premium
            default: 0,
          },
          startDate: { type: Date, default: null },
          endDate: { type: Date, default: null },
          lastPayoutDate: { type: Date, default: null },
          payoutCompleted: { type: Number, enum: [0, 1], default: 0 },
        },
        { _id: false }
      ),
      default: () => ({}),
    },

    rankId: {
      type: String,
      default: null,
    },

    rechargeRecived: {
      type: new mongoose.Schema(
        {
          type: {
            type: Number,
            enum: [0, 1],
            default: 0,
          },
          payoutDate: { type: Date, default: null },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.getUsersByRank = async function (rank) {
  return this.find({ rank });
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
