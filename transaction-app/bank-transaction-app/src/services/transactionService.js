// src/services/transactionService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

// Fetch all transactions
export const getTransactions = async (filters = {}) => {
    try {
        const response = await axios.get(API_URL, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
    try {
        const response = await axios.post(API_URL, transactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

// Fetch total deposits for a specific account
export const getTotalDeposits = async (accountNumber) => {
    try {
        const response = await axios.get(`${API_URL}/total-deposits`, {
            params: { accountNumber },
        });
        return response.data.totalDeposits;
    } catch (error) {
        console.error('Error fetching total deposits:', error);
        throw error;
    }
};
