
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Wallet from "./WalletModels.mjs";
// Generate unique referral code
function generateReferralCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

const userSchema = new mongoose.Schema({
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
  // password: {
  //   type: String,
  //   required: true,
  // },
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
    require: true,
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

  // companyName: {
  //   type: String,
  //   default: "",
  // },

  referrerName: { type: String },
  hierarchy: { type: [Number], default: [] },
  level: { type: Number, default: 0 },
  membership: { type: Number, default: 0 },
});

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password") || this.isNew) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

// userSchema.methods.comparePassword = async function (inputPassword) {
//   return bcrypt.compare(inputPassword, this.password);
// };

userSchema.post("save", async function (doc, next) {
  try {
    if (doc.referredBy) {
      console.log("test");
      const User = mongoose.model("User");

      const directReferrals = await User.countDocuments({
        referredBy: doc.referredBy,
      });

      const levels = {
        2: 1,
        25: 2,
        125: 3,
        625: 4,
        3125: 5,
        15625: 6,
        78125: 7,
        390625: 8,
        1953125: 9,
        9765625: 10,
      };
      const levelValue = levels[directReferrals] || 0;

      await User.updateOne({ userId: doc.referredBy }, { level: levelValue });

      console.log(
        ` Level updated for userId ${doc.referredBy} to ${levelValue}`
      );
    }
 

    next();
  } catch (err) {
    console.error("Error in post-save hook:", err);
    next(err);
  }
});
{
  timestamps: true;
}

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
