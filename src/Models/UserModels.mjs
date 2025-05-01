// // import mongoose from 'mongoose';
// // import bcrypt from 'bcryptjs';

// // const userSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   fullName: {
// //     type: String,
// //     required: true,
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   phone: {
// //     type: String,
// //     required: true,
// //   },
// //   address: {
// //     type: String,
// //     required: true,
// //   },
// //   city: {
// //     type: String,
// //     default: '',
// //   },
// //   pincode: {
// //     type: String,
// //     default: '',
// //   },
// //   state: {
// //     type: String,
// //     default: '',
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   role: {
// //     type: String,
// //     // enum: ['Admin', 'User'],  // Uncomment this line if you want to restrict roles
// //     default: '',  // Default role is User
// //   },
// //   status: {
// //     type: Boolean,
// //     default: true,
// //   },
// //   referralCode: {
// //     type: String,
// //     required: false,
// //     unique: true,
// //     default: '',
// //   },
// //   referredBy: {
// //     type: Number, // 🔁 Will store referrer's userId, not Mongo _id
// //      default: null,
// //   },

// //   userId: {
// //     type: Number,
// //     default: () => Math.floor(100000 + Math.random() * 900000),
// //     unique: true,
// //   },
// //   companyName: {
// //     type: String,
// //     required: true,
// //   },
// // });

// // // Methods and middleware
// // userSchema.statics.findByEmail = async function (email) {
// //   return this.findOne({ email });
// // };

// // userSchema.methods.comparePassword = async function (inputPassword) {
// //   return bcrypt.compare(inputPassword, this.password);
// // };

// // userSchema.pre('save', async function (next) {
// //   if (this.isModified('password') || this.isNew) {
// //     this.password = await bcrypt.hash(this.password, 10);
// //   }
// //   // Generate a unique referral code if it's not set
// //   if (!this.referralCode) {
// //     this.referralCode = generateReferralCode();
// //   }
// //   next();
// // });

// // function generateReferralCode() {
// //   return Math.random().toString(36).substr(2, 8).toUpperCase();
// // }

// // const UserModel = mongoose.model('User', userSchema);

// // export default UserModel;

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     default: '',
//   },
//   pincode: {
//     type: String,
//     default: '',
//   },
//   state: {
//     type: String,
//     default: '',
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: '',
//   },
//   status: {
//     type: Boolean,
//     default: true,
//   },
//   referralCode: {
//     type: String,
//     required: false,
//     unique: true,
//     default: '',
//   },
//   referredBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   userId: {
//     type: Number,
//     default: () => Math.floor(100000 + Math.random() * 900000),
//     unique: true,
//   },
//   companyName: {
//     type: String,
//     required: true,
//   },
// });

// // Methods and middleware
// userSchema.statics.findByEmail = async function (email) {
//   return this.findOne({ email });
// };

// userSchema.methods.comparePassword = async function (inputPassword) {
//   return bcrypt.compare(inputPassword, this.password);
// };

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password') || this.isNew) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   // Generate a unique referral code if it's not set
//   if (!this.referralCode) {
//     this.referralCode = generateReferralCode();
//   }
//   next();
// });

// function generateReferralCode() {
//   return Math.random().toString(36).substr(2, 8).toUpperCase();
// }

// const UserModel = mongoose.model('User', userSchema);

// export default UserModel;

///////////////////////////

// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// // import env from 'env';

// // Define generateReferralCode before the schema
// function generateReferralCode() {
//   return Math.random().toString(36).substr(2, 8).toUpperCase();
// }

// const userSchema = new mongoose.Schema({

//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     default: '',
//   },
//   pincode: {
//     type: String,
//     default: '',
//   },
//   state: {
//     type: String,
//     default: '',
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: '',
//   },
//   status: {
//     type: Boolean,
//     default: true,
//   },
//   referralCode: {
//     type: String,
//     required: true,
//     unique: true,
//     default: generateReferralCode,
//   },
//   referredBy: {
//     type: Number,
//     ref: 'User',
//     default: null
//   },
//   userId: {
//     type: Number,
//     default: () => Math.floor(100000 + Math.random() * 900000),
//     unique: true,
//   },
//   companyName: {
//     type: String,
//     required: true,
//   },
//   referrerName: { type: String },
//   hierarchy:{
//     type: [Number],
//     default: null
//   },
//   level:{
//     type:Number,
//     default:0
//   },
//   membership:{
//     type:Number,
//     default:0
//   },

// });

// // Methods and middleware
// userSchema.statics.findByEmail = async function (email) {
//   return this.findOne({ email });
// };

// userSchema.methods.comparePassword = async function (inputPassword) {
//   return bcrypt.compare(inputPassword, this.password);
// };

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password') || this.isNew) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.post('save', async function (doc, next) {
//   try {
//     if (doc.referredBy) {

//       const User = mongoose.model('User');
//       const directReferrals = await User.countDocuments({ referredBy: doc.referredBy });
//       let levelValue = 0
//       const levels = {
//         5: 1,
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
//       if (directReferrals in levels) {
//         levelValue =  levels[directReferrals];
//       } else {
//         levelValue = 0;
//       }
//       console.log(levelValue)
//       console.log("levelValue -- ", levelValue);
//       console.log(`Parent ${doc.referredBy} has ${directReferrals} direct referrals`);
//       console.log("directReferrals -- ", directReferrals);

//         await User.updateOne(
//           { userId: doc.referredBy },
//           { level: levelValue }
//         );
//         console.log(`Level updated for parent ${doc.referredBy}`);
//      const referredUserList = await User.find({referredBy :  doc.referredBy}).select("userId");
//    console.log("referredUserList -- ", referredUserList);
//     }
//     next();
//   } catch (err) {
//     console.error('Error in post-save hook:', err);
//     next(err);
//   }
// });

// const UserModel = mongoose.model('User', userSchema);

// export default UserModel;

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
    required: true,
  },
  city: { type: String, default: "" },
  pincode: { type: String, default: "" },
  state: { type: String, default: "" },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, default: "" },
  status: { type: Boolean, default: true },

  referralCode: {
    type: String,
    unique: true,
    default: generateReferralCode,
  },

  referredBy: {
    type: Number, 
    ref: 'User',
    default: null,
  },

  userId: {
    type: Number,
    default: () => Math.floor(100000 + Math.random() * 900000),
    unique: true,
  },

  companyName: {
    type: String,
    required: true,
  },

  referrerName: { type: String },
  hierarchy: { type: [Number], default: [] },
  level: { type: Number, default: 0 },
  membership: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

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

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
