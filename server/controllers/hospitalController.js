import Hospital from '../models/hospital.models.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import displayHospitalData from "./getHospitalwithUser.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret key
const JWT_EXPIRATION = '1h';  // Token expiration time

export const SubmitHospital = async (req,res)=>{
    try{
        const hospital = new Hospital(req.body);
        await hospital.save();
        if(!hospital){
            res.status(400).json({message:"error while storing data of hospital"})
        }
        console.log(displayHospitalData(hospital._id))
        res.status(201).json(hospital)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}