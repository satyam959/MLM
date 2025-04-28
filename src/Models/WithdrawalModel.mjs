import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    walletId: { type: Number, required: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
