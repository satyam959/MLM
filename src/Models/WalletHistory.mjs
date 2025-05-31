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
        },
        transactionId: {
            type: String,
            unique: true,
            default: () => `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        },
        amount: { type: String, required: true }, // transaction amount
        type: { type: String, enum: ['credit', 'debit'], required: true },
        transactionType: { type: String, enum: ['membership', 'dailyPayout','teamPerformance','referral_bonus_10_users','royaltyIncome','monthlyReward','wallet_recharge'], required: true },
        source: { type: String }, // like 'bank', 'paypal', 'betting', 'referral', etc.
        balanceAfter: { type: String }, // wallet balance after transaction (for history)
        status: {
            type: String, enum: ['pending', 'completed', 'failed'], default: 'completed'
        },
    },
    { timestamps: true }

);

const WalletHistories = mongoose.model('WalletHistories', walletSchema);

export default WalletHistories;
