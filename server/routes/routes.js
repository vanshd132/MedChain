import express from 'express';
import { SubmitUser } from "../controllers/userController.js";
import { SubmitUser2 } from "../controllers/user2Controller.js";
import { SubmitHospital } from "../controllers/hospitalController.js";
import { SubmitHospital2 } from "../controllers/hospital2Controller.js";
import { chatbotController } from '../controllers/vansh/chatbotController.js';
import { PresController } from '../controllers/vansh/DescriptionController.js';

import { NewUser } from '../models/newuser.models.js';

import Hospital from '../models/hospital.models.js'

const router = express.Router();

router.post('/submit', SubmitUser);
router.post('/submit2', SubmitUser2);
router.post('/hospital', SubmitHospital);
router.post('/hospital2', SubmitHospital2);

 

// Vansh Chat endpoint
router.post('/api/chat', chatbotController);
router.post('/prescription',PresController)

router.put('/add-email', async (req, res) => {
    const { name, email } = req.body;

    // Check if both name and email are provided
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        // Find the user by name and update the email field
        const updatedUser = await NewUser.findOneAndUpdate(
            { name }, // Find by name
            { $set: { email } }, // Set the email field
            { new: true } // Return the updated document
        );

        // If no user found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Success response
        res.json({ message: 'Email added successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

router.post('/signup', async (req, res) => {
    try {
        if (req.body.role === 'user') {
            // Create a new user
            const { name, email, phone, password } = req.body;

            // Check if all required fields are provided
            if (!name || !email || !phone || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Create a new user
            const user = await NewUser.create({ name, email, phone, password });

            // Send success response with the created user
            return res.status(201).json({ success: true, user });
        }else{
            // Create a new Hospital
            const { hospitalname, email, phone, password ,address} = req.body;

            // Check if all required fields are provided
            if (!hospitalname || !email || !phone || !password || !address) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Create a new user
            const hospital = await Hospital.create({ hospitalname, email, phone, password });

            // Send success response with the created user
            return res.status(201).json({ success: true, hospital });
        }

    } catch (error) {
        // Send error response in case of failure
        return res.status(500).json({ error: 'Failed to create user', error });
    }
});



export default router;
