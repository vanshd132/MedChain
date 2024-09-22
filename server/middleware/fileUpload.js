import express from 'express';
import multer from 'multer';
import Hospital from '../models/hospital.models.js'; // Adjust the path as needed
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where the file will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Handle PDF upload and save file metadata
router.post('/hospital1', upload.single('file'), async (req, res) => {
  try {
    const { patientname, password, speciality, address, data } = req.body;
    const file = req.files;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

    // Create a new hospital entry
    const newHospital = new Hospital({
      patientname,
      password,
      speciality,
      address,
      data,
      file: {
        url: file.path, // Store the path to the uploaded file
        filename: file.filename,
        size: file.size,
      }
    });

    // Save to the database
    await newHospital.save();

    res.status(201).json({ message: 'Hospital entry created successfully', hospital: newHospital });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

export default router;
