import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
    {
        walletHistoryId: {
            type: Number,
            default: () => Math.floor(100000 + Math.random() * 900000),
            unique: true,
        },
        userId: {
            type: Number,
            unique: true,
        },
        amount: { type: Number, required: true }, // transaction amount
        type: { type: String, enum: ['credit', 'debit'], required: true },
        transactionType: { type: String, enum: ['membership', 'dailyPayout'], required: true },
        source: { type: String }, // like 'bank', 'paypal', 'betting', 'referral', etc.
        balanceAfter: { type: Number }, // wallet balance after transaction (for history)
        status: {
            type: String, enum: ['pending', 'completed', 'failed'], default: 'completed'
        },
    },
    { timestamps: true }

);

const WalletHistories = mongoose.model('WalletHistories', walletSchema);

export default WalletHistories;
