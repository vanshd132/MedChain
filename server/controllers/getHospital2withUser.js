import { Hospital2 } from "../models/hospital2.models.js";

async function getHospitalWithUser(hospitalId) {
    try {
        const hospital = await Hospital2.findById(hospitalId).populate('data');
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        console.error('Error fetching hospital:', error);
        throw error;
    }
}

async function displayHospitalData2(hospitalId) {
    try {
        const hospital = await getHospitalWithUser(hospitalId);
        console.log('Hospital Information:', hospital);
        console.log('Associated User Data:', hospital.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export default displayHospitalData2;

