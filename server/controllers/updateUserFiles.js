import mongoose from 'mongoose';
import { NewUser } from '../models/newuser.models.js';
import Hospital from '../models/hospital.models.js';

async function updateUserFileInHospital(hospitalName, userName, newFilename) {
    try {
        // Step 1: Find the hospital by name
        const hospital = await Hospital.findOne({ hospitalname: hospitalName }).populate('data');
        if (!hospital) {
            throw new Error('Hospital not found');
        }

        // Step 2: Extract user IDs from the hospital's data field
        const userIds = hospital.data.map(user => user._id);

        // Step 3: Find the specific user by name among the extracted user IDs
        const user = await NewUser.findOne({ name: userName, _id: { $in: userIds } });
        if (!user) {
            throw new Error('User not found');
        }

        // Step 4: Add the new filename to the user's filename array
        user.filename = [...new Set([...user.filename, newFilename])]; // Avoid duplicates

        // Save the updated user document
        await user.save();

        console.log('User filename updated successfully');
    } catch (error) {
        console.error('Error updating user filename:', error);
    }
}
export default updateUserFileInHospital;

// Example usage
// updateUserFileInHospital('Some Hospital Name', 'John Doe', 'newfile.pdf');
