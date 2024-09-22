import Hospital from "../models/hospital.models.js"; 

async function getHospitalWithUser(hospitalId) {
    try {
        const hospital = await Hospital.findById(hospitalId).populate('data');
        if (!hospital) {
            throw new Error('Hospital not found');
        }
        return hospital;
    } catch (error) {
        console.error('Error fetching hospital:', error);
        throw error;
    }
}

async function displayHospitalData(hospitalId) {
    try {
        const hospital = await getHospitalWithUser(hospitalId);
        console.log('Hospital Information:', hospital);
        console.log('Associated User Data:', hospital.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export default displayHospitalData;

