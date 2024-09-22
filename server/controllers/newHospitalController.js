import Hospital from "../models/hospital.models.js";

export const getHospitalsByCategory = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ category: req.query.category });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctorsByHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital.doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
