const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactionRoutes');
const bankRoutes = require('./routes/bankRoutes');  // Import bank routes
dotenv.config(); // Load environment variables from .env file
const cors = require('cors');


const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Enable CORS
app.use(cors());

// MongoDB connection (we'll set this up later)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};


// Use transaction routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/banks', bankRoutes);  // Bank routes


// Start server
const PORT = 5000;
app.listen(PORT, async () => {
    await connectDB(); // Connect to MongoDB before starting the server
    console.log(`Server running on port ${PORT}`);
});
