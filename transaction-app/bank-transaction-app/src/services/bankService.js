import axios from 'axios';

const API_URL = 'http://localhost:5000/api/banks'; // Backend endpoint for banks

// Fetch all banks
export const getBanks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Return the bank data
    } catch (error) {
        console.error('Error fetching banks:', error);
        throw error;
    }
};
