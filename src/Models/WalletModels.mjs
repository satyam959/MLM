// import mongoose from 'mongoose';


// const walletSchema = new mongoose.Schema(
//   {
//     balance: {
//       type: String, 
//       required: true,

//     },
//     status: {
//       type: Boolean, 
//       default: true,
//     },
//     walletId: {
//       type: Number,
//       default: () => Math.floor(100000 + Math.random() * 900000),
//        unique: true,
//     },
//     userId: {
//         type: Number,
//         default: () => Math.floor(100000 + Math.random() * 900000),
//          unique: true,
//       },
//   },
//   { timestamps: true } 
// );

// // Corrected model name and schema reference
// const Wallet = mongoose.model('Wallet', walletSchema);

// export default Wallet;
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    walletId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },
    userId: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
