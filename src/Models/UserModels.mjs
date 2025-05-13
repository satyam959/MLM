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
        // membership: { type: Number, default: 0 },
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
        },
        { _id: false }
      ),
      default: () => ({}),
    },
    // ✅ Added rank field
    rank: {
      type: String,
      default: null, // ✅ stores null in DB if rank is not set
    }
    
    
    
  },
  {
    timestamps: true,
  }
);

// Static method
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.getUsersByRank = async function (rank) {
  return this.find({ rank });
};
// Post-save hook
// userSchema.post("save", async function (doc, next) {
//   try {
//     if (doc.referredBy) {
//       const User = mongoose.model("User");

//       const directReferrals = await User.countDocuments({
//         referredBy: doc.referredBy,
//       });

//       const levels = {
//         2: 1,
//         25: 2,
//         125: 3,
//         625: 4,
//         3125: 5,
//         15625: 6,
//         78125: 7,
//         390625: 8,
//         1953125: 9,
//         9765625: 10,
//       };
//       // const levelValue = levels[directReferrals] || 0;

//       // Map level to rank
//       const rankMapping = {
//         1: "Bronze",
//         2: "Silver",
//         3: "Gold",
//         4: "Platinum",
//         5: "Diamond",
//         6: "Black Diamond",
//       };
//       const rankValue = levelValue >= 7 ? "Kohinoor" : rankMapping[levelValue] || "Unranked";

//       const updateFields = {
//         level: levelValue,
//         rank: rankValue,
//       };

//       await User.updateOne({ userId: doc.referredBy }, updateFields);

//     //   console.log(
//     //     `Level updated for userId ${doc.referredBy} to ${levelValue}, Rank: ${rankValue}`
//     //   );
//      }

//     next();
//   } catch (err) {
//     console.error("Error in post-save hook:", err);
//     next(err);
//   }
// });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
