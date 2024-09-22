import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema2 = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
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
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    filename: {
        type: String,
        required: [true, 'Filename is required'],
       
        trim: true
    }
}, { timestamps: true });

// Middleware to hash the password before saving the user
userSchema2.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // Skip hashing if password is not modified
    }

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
        next(); 
    } catch (error) {
        next(error); 
    }
});


userSchema2.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

export const User2 = mongoose.model('User2', userSchema2);


