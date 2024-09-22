import express from 'express';
import { submitAppointment } from '../controllers/appointmentController.js';
import multer from 'multer';

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Define routes
router.post('/submit31', upload.array('files'), submitAppointment); // POST /api/submit31

export default router;
