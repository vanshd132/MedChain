import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret key
const JWT_EXPIRATION = '1h';  // Token expiration time

export const SubmitUser = async (req, res) => {
    try {
        const { name, password, phone, category, filename } = req.body;

        // Log received data
        console.log("Received data:", { name, password, phone, category, filename });

        // Check for required fields
        if (!name || !password || !phone || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Log hashed password (avoid logging in production)
        console.log("Hashed password:", hashedPassword);

        // Create a new user instance
        const user = new User({
            name,
            password: hashedPassword,
            phone,
            category,
            filename
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
        console.error("Error creating user:", error);

        // Return a more detailed error message if possible
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};
