import mongoose from 'mongoose';


const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: String, // Fixed typo from 'flot' to 'Number'
      required: true,
      
    },
    status: {
      type: Boolean, // Correct type
      default: true,
    },
    walletId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
       unique: true,
    },
    userId: {
        type: Number,
        default: () => Math.floor(100000 + Math.random() * 900000),
         unique: true,
      },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Corrected model name and schema reference
const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
