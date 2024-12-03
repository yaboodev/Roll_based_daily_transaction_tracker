const express = require('express');
const Transaction = require('../models/Transaction');
const Bank = require('../models/bank');
const router = express.Router();

// Create a new transaction (POST)
router.post('/', async (req, res) => {
    try {
        const { bankId, accountNumber, transactionType, amount, description } = req.body;


         // Validate and convert amount to a number
         const transactionAmount = Number(amount); // Explicit conversion to a number
         if (isNaN(transactionAmount) || transactionAmount <= 0) {
             return res.status(400).json({ message: 'Invalid amount provided' });
         }

        // Find the bank by its ID
        const bank = await Bank.findById(bankId);
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        // Find the account associated with the given account number in the bank
        const account = bank.accounts.find(acc => acc.accountNumber === accountNumber);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // // Create a new transaction
        // const transaction = new Transaction({
        //     bank: bank._id,  // Store the bank ID
        //     accountNumber: account.accountNumber,
        //     transactionType,
        //     amount,
        //     balance: updateBalance ,
        //     description,
        // });

        // // Save the transaction
        // await transaction.save();

        // Optionally, update the bank account balance
        if (transactionType === 'deposit') {
            account.balance += amount;
        } else if (transactionType === 'withdrawal') {
            console.log('Current Balance:', account.balance, 'Withdrawal Amount:', amount);
            account.balance -= amount;
        }
          // Create a new transaction with the updated balance
          const transaction = new Transaction({
            bank: bank._id,
            accountNumber: account.accountNumber,
            transactionType,
            amount,
            balance: updatedBalance, // Save the balance at the time of the transaction
            description,
        });

        // Save the transaction and the updated account balance
        account.balance = updatedBalance;
        await transaction.save();
        await bank.save();

        // await bank.save();  // Save the updated bank document

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all transactions with optional filters (GET)
router.get('/', async (req, res) => {
    try {
        // Destructure query parameters
        const { date, transactionType, accountNumber } = req.query;

        // Build the filter object based on the provided query parameters
        const filter = {};

        if (date) {
            filter.createdAt = { $gte: new Date(date) }; // Filter by date
        }

        if (transactionType) {
            filter.transactionType = transactionType; // Filter by transaction type (deposit, withdrawal, transfer)
        }

        if (accountNumber) {
            filter.accountNumber = accountNumber; // Filter by account number
        }

        // Get transactions based on the filter
        const transactions = await Transaction.find(filter)
        .populate({
            path: 'bank',  // Populate the bank field
            select: 'name branch accounts' // Only select relevant fields
        })
        // .populate({
        //     path: 'bank.accounts',  // Populate accounts inside the bank
        //     select: 'accountNumber balance'  // Select accountNumber and balance fields
        
        //     });

        console.log('Transactions with accounts:', JSON.stringify(transactions, null, 2));

    res.status(200).json(transactions);



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get total deposits for a specific account (GET)
router.get('/total-deposits', async (req, res) => {
    try {
        const { accountNumber } = req.query;

        if (!accountNumber) {
            return res.status(400).json({ message: 'Account number is required' });
        }

        const totalDeposits = await Transaction.aggregate([
            { $match: { accountNumber, transactionType: 'deposit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({ totalDeposits: totalDeposits.length > 0 ? totalDeposits[0].total : 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
