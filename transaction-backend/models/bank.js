const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true
    },
    accountType: {
        type: String, // e.g., 'savings', 'checking'
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    location: {
        type: String, // optional field for the location of the bank
    },
    accounts: [accountSchema] // Array of accounts
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
