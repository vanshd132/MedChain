import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const NewuserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    hospital: {
        type: String,
        required: [false, 'Hospital is compulsory'],
        trim: true

    },
    doctor: {
        type: String,
        required: [false, 'Doctor is compulsory']
    },
    
    filename: {
        type: [String],
        required: false,
        trim: true, 
    },
    email: {
        type: String,  // Add this field
        required: false,
        trim: true
        ,uniqy: true
    }
}, { timestamps: true });

// Middleware to hash the password before saving the user
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next(); // Skip hashing if password is not modified
//     }

//     try {
//         const salt = await bcrypt.genSalt(10); // Generate salt
//         this.password = await bcrypt.hash(this.password, salt); // Hash password
//         next(); // Continue to save the user
//     } catch (error) {
//         next(error); // Pass any errors to the next middleware
//     }
// });

// // Method to compare given password with hashed password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     try {
//         return await bcrypt.compare(candidatePassword, this.password);
//     } catch (error) {
//         throw new Error(error);
//     }
// };

export const NewUser = mongoose.model('NewUser', NewuserSchema);


