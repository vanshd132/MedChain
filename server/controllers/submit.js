import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { User } from '../models/user.models.js'; // Adjust the path to your User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret key
const JWT_EXPIRATION = '1h';  // Token expiration time

const app = express();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    if (!userId) {
      return cb(new Error('User ID is required'), null);
    }
    const uploadDir = path.join('uploads', userId.toString());
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage });

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle user data and file uploads
app.post('/submit3', upload.array('files'), async (req, res) => {
  try {
    const { name, password, phone, category } = req.body;
    const files = req.files;

    // Check for required fields
    if (!name || !password || !phone || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user instance
    const user = new User({
      name,
      password: hashedPassword,
      phone,
      category,
      filename: files.map(file => file.filename) // Save file names in the database
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return the created user and token in the response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        category: user.category,
        filename: user.filename
      },
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


