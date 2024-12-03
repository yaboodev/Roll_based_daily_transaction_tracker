import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch all transactions when the component mounts
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions(); // Use service to fetch transactions
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);
    useEffect(() => {
        console.log(transactions); // Log transactions to check if bank info is populated
    }, [transactions]);

    return (
        <div>
            <h1>Transactions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Bank Name</th>
                        <th>Branch</th>
                        <th>Account Number</th>
                        <th>Transaction Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Account Balance</th> {/* Add column for account balance */}
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => {
                         console.log(transaction.bank.accounts); // Log the accounts array for each transaction
                       return (
                        
                        <tr key={transaction._id}>
                            <td>{transaction.bank.name}</td> {/* Bank name */}
                            <td>{transaction.bank.branch}</td> {/* Branch */}
                            <td>{transaction.accountNumber}</td> {/* Account number */}
                            <td>{transaction.transactionType}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            
                            <td>
    {transaction.balance !== undefined ? transaction.balance : 'N/A'}
</td>
                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};


export default TransactionList;




