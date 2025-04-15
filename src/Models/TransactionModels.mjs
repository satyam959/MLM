import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
        type: String,
        default: () => uuidv4(), 
        unique: true
    },
    response: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true,
});


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
