import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    linkableId: {
        type: Number,
        required: true
    },
    linkableType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },

    transactionType: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    transactionId: {
        type: Number,
        default: () => Math.floor(100000 + Math.random() * 900000), // 6-digit number
        unique: true
    },
    response: { 
        type: String 
    }
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
