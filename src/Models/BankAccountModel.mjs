import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
  bank: { type: String, required: true },
  branch: { type: String, required: true },
  userId: { type: String, required: true, unique: true }, // Add this
  bankId: { type: Number, default: () => Math.floor(100000 + Math.random() * 900000), unique: true },
  isPrimary: { type: Boolean, default: false }

}, { timestamps: true });

export const Bank = mongoose.model('Bank', bankSchema);