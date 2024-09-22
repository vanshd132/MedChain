import mongoose from "mongoose";

const hospitalSchema2 = new mongoose.Schema({
    hospitalname:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    password:{
        type: String,
        required: [true, 'Password is complusory'],
        trim: true,
        minlength: [8, 'Password have length of atleast 8'],
        maxlength: [20,'length exceeded']
    },
    patientname: {
        type: String,
        required: [false, 'Patient name is required'],
        trim: true,
        minlength: [1, 'Patient name cannot be empty'],
        maxlength: [100, 'Patient name cannot exceed 100 characters']
    },
    speciality:{
        type: String,
        required: false,
      
    },
    address:{
        type: String,
        required: true,
        unique: true
    },
    data:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    filename:{
        type: [String],
        required: false,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export const Hospital2 = mongoose.model('Hospital2', hospitalSchema2);


