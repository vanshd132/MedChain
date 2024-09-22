import { User } from '../models/user.models.js';
import Hospital from '../models/hospital.models.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const submitAppointment = async (req, res) => {
  try {
    const { name, password, phone, category, hospital, doctor } = req.body;

    const newUser = new User({
      name,
      password,
      phone,
      category,
      filename: req.files.map(file => file.filename), // Add filenames from uploaded files
    });

    await newUser.save();

    const hospitalData = await Hospital.findById(hospital);
    if (!hospitalData) return res.status(404).json({ message: 'Hospital not found' });

    hospitalData.data.push(newUser._id);
    await hospitalData.save();

    res.json({ message: 'Appointment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
