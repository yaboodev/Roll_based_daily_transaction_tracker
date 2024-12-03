import React, { useState, useEffect } from 'react';
import { createTransaction } from '../services/transactionService'; // Ensure this service exists
import { getBanks } from '../services/bankService';

const TransactionForm = () => {
    const [banks, setBanks] = useState([]); // Stores the list of banks
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(''); // Tracks the selected branch
    const [formData, setFormData] = useState({
        accountNumber: '',
        transactionType: 'deposit',
        amount: '',
        description: '',
    });

    // Fetch banks when the component mounts
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const bankData = await getBanks(); // Fetch all banks
                setBanks(bankData);
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };
        fetchBanks();
    }, []);

    const handleBankChange = (e) => {
        const [bankId, branch] = e.target.value.split('|'); // Split bankId and branch
        setSelectedBank(bankId);
        setSelectedBranch(branch);
        setFormData((prev) => ({
            ...prev,
            accountNumber: '', // Reset account number when bank/branch changes
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const transaction = await createTransaction({
                ...formData,
                bankId: selectedBank, // Attach selected bank ID
            });
            alert('Transaction created successfully!');
            setFormData({
                accountNumber: '',
                transactionType: 'deposit',
                amount: '',
                description: '',
            });
            setSelectedBank('');
            setSelectedBranch('');
        } catch (error) {
            console.error('Error creating transaction:', error);
            alert('Error creating transaction');
        }
    };

    return (
        <div>
            <h1>Create a New Transaction</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Bank and Branch:</label>
                    <select value={`${selectedBank}|${selectedBranch}`} onChange={handleBankChange}>
                        <option value="">Select a bank and branch</option>
                        {banks.map((bank) => (
                            <option
                                key={bank._id}
                                value={`${bank._id}|${bank.branch}`}> 
                                {bank.name} ({bank.branch})
                            </option>
                        ))}
                    </select>
                </div>
                {selectedBank && (
                    <div>
                        <label>Account Number:</label>
                        <select
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                        >
                            <option value="">Select an account</option>
                            {banks
                                .find((bank) => bank._id === selectedBank && bank.branch === selectedBranch)
                                ?.accounts.map((account) => (
                                    <option key={account.accountNumber} value={account.accountNumber}>
                                        {account.accountNumber}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
                <div>
                    <label>Transaction Type:</label>
                    <select
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleChange}
                    >
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;
