import mongoose from 'mongoose';
import { User } from './user.models.js';
import { NewUser } from './newuser.models.js';

// Define a sub-schema for Doctor details
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    experience: {
        type: Number,
        required: true,
        min: [0, 'Experience cannot be negative'] // Ensure experience is a non-negative number
    },
    speciality: {
        type: String,
        required: true,
         // Add other specialities as needed
    }
}, { _id: false }); // Do not create an _id for sub-documents

// const secondOpinionRequestSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'NewUser',
//         required: true
//     },
//     hospitalId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Hospital',
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Accepted', 'Rejected'],
//         default: 'Pending'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// }, { _id: false });

const secondOpinionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: false
    }
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
    hospitalname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is compulsory'],
        trim: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [20, 'Password cannot exceed 20 characters']
    },
    doctors: [doctorSchema], // Use the doctorSchema for details
    // patient: {
    //     type: [Object.Schema.Types.ObjectId],
    //     ref: 'User',
    //     required: [true, 'Patient name is required'],
    //     trim: true,
    //     minlength: [1, 'Patient name cannot be empty'],
    //     maxlength: [100, 'Patient name cannot exceed 100 characters']
    // },
    address: {
        type: String,
        required: true,
        unique: true
    },
    // category: { // Add this field
    //     type: String,
    //     required: [true, 'Category is required']
    // }, //optionaly made
    data: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'NewUser',
        required: true
    },
    email: {
        type: String,
        requird: true
    },
    secondOpinions: [secondOpinionSchema]
    // filename: {
    //     type: [String],
    //     required: false,
    //     trim: true
    // }
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;