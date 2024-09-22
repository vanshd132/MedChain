import express from 'express';
import { getDoctorsByHospital,getHospitalsByCategory } from '../controllers/newHospitalController.js';

const router = express.Router();

// Define routes
router.get('/hospital', getHospitalsByCategory); // GET /api/hospitals
router.get('/hospital/:hospitalId/doctor', getDoctorsByHospital); // GET /api/hospitals/:hospitalId/doctors

export default router;
