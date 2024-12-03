const mongoose = require('mongoose');

// Reference to Bank model
const transactionSchema = new mongoose.Schema({
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank', // Reference to the Bank model
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number, // New field to store balance at the time of transaction
        required: true
    },
    description: {
        type: String
    }
    
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
