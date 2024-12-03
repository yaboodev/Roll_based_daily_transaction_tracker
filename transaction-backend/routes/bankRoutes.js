const express = require('express');
const Bank = require('../models/bank');
const router = express.Router();

// Create a new bank (POST)
router.post('/', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const bank = new Bank(req.body);
        await bank.save();
        res.status(201).json(bank);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all banks (GET)
// router.get('/', async (req, res) => {
//     try {
//         const banks = await Bank.find();
//         res.status(200).json(banks);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// Get all banks
router.get('/', async (req, res) => {
    try {
        const banks = await Bank.find(); // Fetch all banks
        res.status(200).json(banks); // Send the banks as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});

// Get bank by ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.id);
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(bank);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a bank (PUT)
router.put('/:id', async (req, res) => {
    try {
        const bank = await Bank.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(bank);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a bank (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const bank = await Bank.findByIdAndDelete(req.params.id);
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json({ message: 'Bank deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add an account to a bank (POST)
router.post('/:bankId/accounts', async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.bankId);
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        const newAccount = req.body;
        bank.accounts.push(newAccount); // Add the new account to the accounts array
        await bank.save();
        res.status(201).json(bank);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get accounts of a bank (GET)
router.get('/:bankId/accounts', async (req, res) => {
    try {
        const bank = await Bank.findById(req.params.bankId);
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(bank.accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
