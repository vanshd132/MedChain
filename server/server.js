// server.js
import express from 'express';
import multer from 'multer';
import { User } from './models/user.models.js';// Adjust the path to your User model
import path from 'path';
import fs from 'fs';
``
const app = express();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        if (!userId) {
            return cb(new Error('User ID is required'), null);
        }
        const uploadDir = path.join('uploads',userId.toString());
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

// Endpoint to upload files
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const { userId } = req.body;
        const files = req.files;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        const filename = files.map(file => file.filename);

        // // Find user and update filenames
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's filenames
        user.filename = [...user.filename || [], ...filename];
        await user.save();
        

        res.status(200).json({ message: 'Files uploaded successfully', filename });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default app;
