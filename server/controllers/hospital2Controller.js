import { Hospital2 } from "../models/hospital2.models.js";
import displayHospitalData2 from "./getHospital2withUser.js";

export const SubmitHospital2 = async (req,res)=>{
    try{
        const hospital = new Hospital2(req.body);
        await hospital.save();
        if(!hospital){
            res.status(400).json({message:"error while storing data of hospital"})
        }
        console.log(displayHospitalData2(hospital._id))
        res.status(201).json(hospital)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}