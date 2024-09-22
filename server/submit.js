import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { User } from './models/user.models.js'; // Ensure this file exports the User model
import dotenv from 'dotenv';
import connectDB from './db/hospitaldb.js';
import router from './routes/routes.js';
import app from './server.js';


import cors from 'cors'

import { SubmitUser } from './controllers/userController.js';

dotenv.config(); // Load environment variables from .env file

// const app1 = express();
const port = process.env.PORT || 4000;

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGODB_URI;



// Connect to MongoDB
// mongoose.connect(mongoURI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => {
//         console.error('MongoDB connection error:', err);
//         process.exit(1); // Exit process to avoid running with an incomplete setup
//     });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true 
}));

app.use('/',router)
// app.use('/',router1)
app.post('/submit', SubmitUser);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/v1/submit', async (req, res) => {
    try {
        const { name, password, phone, category, filename } = req.body;

        // Ensure all required fields are provided
        if (!name || !password || !phone || !category || !filename) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new user entry
        const newUser = new User({
            name,
            password, // Note: Passwords should be hashed before storing in production
            phone,
            category,
            filename
        });

        await newUser.save();

        res.status(201).json({ message: 'User details saved successfully!', data: newUser });
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ message: 'Error saving user details.', error });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });