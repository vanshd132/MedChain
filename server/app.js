import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { User } from './models/user.models.js'; // Adjust path to your User model

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/hospitaldb.js';
import { SubmitUser } from './controllers/userController.js';
import HospitalRoutes from './routes/HospitalRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'

import router from './routes/routes.js';

import { NewUser } from './models/newuser.models.js';
import Hospital from './models/hospital.models.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import updateUserFileInHospital from './controllers/updateUserFiles.js';
import { Server } from 'socket.io';
import http from 'http'
import bodyParser from 'body-parser';

//Vansh
import paymnetRouter from './routes/paymentRoutes.js'

dotenv.config();

// Set up JWT and MongoDB configurations
const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret key
const JWT_EXPIRATION = '1h';  // Token expiration time
const mongoURI = process.env.MONGODB_URI; // MongoDB connection URI
const secretKey = process.env.TOKEN_KEY;

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true,
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.options('*', cors());
// app.use('/api', HospitalRoutes);
// app.use('/api', appointmentRoutes);
app.use('/', router)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Corrected variable name
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/api/payment', paymnetRouter)

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file by prefixing the current timestamp to the original filename.
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process to avoid running with an incomplete setup
  });



// Route to handle user data and file uploads
app.post('/submit', SubmitUser)
app.post('/submit3', upload.array('files'), async (req, res) => {
  try {
    const { name, password, phone, category } = req.body;
    const files = req.files;

    // Check for required fields
    if (!name || !password || !phone || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user instance
    const user = new User({
      name,
      password: hashedPassword,
      phone,
      category,
      filename: files.map(file => file.filename) // Save file names in the database
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return the created user and token in the response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        category: user.category,
        filename: user.filename
      },
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Route to handle file uploads
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const { userId } = req.body;
    const files = req.files;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }

    const filename = files.map(file => file.filename);

    // Find user and update filenames
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's filenames
    user.filename = [...user.filename || [], ...filename];
    await user.save();

    res.status(200).json({ message: 'Files uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//extra part

app.get('/hospitals', async (req, res) => {
  const { name } = req.query;
  try {
    // Query based on hospital name
    const query = name ? { hospitalname: new RegExp(name, 'i') } : {};
    const hospitals = await Hospital.find(query);
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals', error });
  }
});

// Route to get doctors for a specific hospital
app.get('/hospital/:id/doctor', async (req, res) => {
  const { id } = req.params;
  try {
    const hospital = await Hospital.findById(id).select('doctors');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital.doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

app.post('/api/submit31', upload.array('files'), async (req, res) => {
  try {
    const { name, password, phone, hospital, doctor, email } = req.body;
    const files = req.files;

    const existingUser = await NewUser.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exits" });
    }

    // Check for required fields
    if (!name || !password || !phone || !hospital || !doctor || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user instance
    const user = new NewUser({
      name,
      password: hashedPassword,
      phone,
      hospital,
      doctor,
      filename: files.map(file => file.filename), // Save file names in the database
      email: email
    });

    // Save the user to the database
    await user.save();
    const hospitalRecord = await Hospital.findById(hospital);
    if (!hospitalRecord) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update the hospital's data field with the new user's ID
    hospitalRecord.data.push(user._id);
    await hospitalRecord.save();

    // Generate a JWT token (if needed)
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET, // Set your JWT secret in an environment variable
      { expiresIn: '1h' }
    );

    // Return the created user and token in the response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        hospital,
        doctor,
        filename: user.filename,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

app.post('/api/updateUserDetails', upload.array('files'), async (req, res) => {
  const { name, phone, email, hospital, doctor } = req.body;
  const files = req.files; // Array of uploaded files

  try {
    const user = await NewUser.findOne({ name });
    if (!user) return res.status(404).json({ message: 'User not found' });


    // Create a new user instance


    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.hospital = hospital || user.hospital;
    user.doctor = doctor || user.doctor;
    const filename = files.map(file => file.filename);
    //   if (files.length > 0) {
    //     user.filename = files.map(file => file.filename); // Save filenames to the database
    //   }
    user.filename = [...user.filename || [], ...filename];

    await user.save();
    const hospitalRecord = await Hospital.findById(hospital);
    if (!hospitalRecord) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update the hospital's data field with the new user's ID
    hospitalRecord.data.push(user._id);
    await hospitalRecord.save();
    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// it should be details only
app.get('/user-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await NewUser.findById(userId).populate('hospital').populate('doctor'); // Populate if you want to include hospital and doctor details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      phone: user.phone,
      hospital: user.hospital,
      doctor: user.doctor,
      files: user.filename
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// by name
app.get('/user-details1', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'User name is required' });
  }

  try {
    const user = await NewUser.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      phone: user.phone,
      hospital: user.hospital,
      doctor: user.doctor,
      files: user.filename,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
});

//token check

app.post('/check-token', (req, res) => {
  const { token } = req.body; // Get token from JSON body

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err); // Log the error
      return res.status(401).json({ valid: false, message: 'Token is invalid or expired' });
    }

    res.json({ valid: true, user: decoded });
  });
});

//by email
app.get('/user-details1/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // First, check if the email belongs to a hospital
    const hospital = await Hospital.findOne({ email });
    if (hospital) {
      const token = jwt.sign(
        { name: hospital.name, role: 'hospital' }, // Claims for hospital
        secretKey,
        { expiresIn: '1h' } // Token expiration time
      );

      return res.json({
        name: hospital.name,
        exists: true,
        role: "hospital",
        token
      });
    }

    // If not a hospital, check if the email belongs to a user
    const user = await NewUser.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { name: user.name, role: 'user' }, // Claims for user
        secretKey,
        { expiresIn: '1h' } // Token expiration time
      );

      return res.json({
        name: user.name,
        exists: true,
        role: "user",
        token
      });
    }

    // If email is not found in both collections
    return res.status(404).json({ message: 'Email not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user details', error });
  }
});




//hospital side
app.post('/api/hospitals/users/:userName/upload', upload.single('file'), async (req, res) => {
  try {
    const { userName } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    
    const user = await NewUser.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.filename.push(file.filename);
    await user.save();

    res.status(200).json({ message: 'File uploaded and user updated successfully', filename: file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//hospital page
app.get('/api/hospitals/:hospitalName', async (req, res) => {
  try {
    const { hospitalName } = req.params;
    const hospital = await Hospital.findOne({ hospitalname: hospitalName }).populate('data');

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//chat
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Change this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Define the message schema and model
const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// In-memory user tracking
const users = {}; // { username: socket.id }
app.use(express.static(join(__dirname, '../frontend/dist')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/dist', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', async (data) => {
    try {
      users[data.username] = socket.id;

      const pastMessages = await Message.find({
        $or: [
          { sender: data.username },
          { recipient: data.username }
        ]
      }).sort('timestamp');

      pastMessages.forEach((msg) => {
        socket.emit('private message', {
          sender: msg.sender,
          recipient: msg.recipient,
          message: msg.message,
          timestamp: msg.timestamp
        });
      });

      io.emit('user list', Object.keys(users));
      console.log(`${data.username} joined the chat`);
    } catch (err) {
      console.error('Error in register event:', err);
    }
  });

  socket.on('private message', async (data) => {
    try {
      const recipientSocketId = users[data.recipient];

      const newMessage = new Message({
        sender: data.sender,
        recipient: data.recipient,
        message: data.message
      });

      await newMessage.save();

      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('private message', {
          sender: data.sender,
          recipient: data.recipient,
          message: data.message,
          timestamp: newMessage.timestamp
        });
      } else {
        console.log(`Recipient ${data.recipient} not connected`);
      }
    } catch (err) {
      console.error('Error in private message event:', err);
    }
  });

  socket.on('ice-candidate', (data) => {
    try {
      const recipientSocketId = users[data.recipient];
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('ice-candidate', data.candidate);
      }
    } catch (err) {
      console.error('Error in ice-candidate event:', err);
    }
  });

  socket.on('offer', (data) => {
    try {
      const recipientSocketId = users[data.recipient];
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('offer', {
          offer: data.offer,
          sender: data.sender
        });
      }
    } catch (err) {
      console.error('Error in offer event:', err);
    }
  });

  socket.on('answer', (data) => {
    try {
      const recipientSocketId = users[data.recipient];
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('answer', {
          answer: data.answer,
          sender: data.sender
        });
      }
    } catch (err) {
      console.error('Error in answer event:', err);
    }
  });

  socket.on('disconnect', () => {
    try {
      const username = Object.keys(users).find(user => users[user] === socket.id);
      if (username) {
        delete users[username];
        io.emit('user list', Object.keys(users));
        console.log(`${username}, disconnected`);
      }
    } catch (err) {
      console.error('Error in disconnect event:', err);
    }
  });

});


//second opinion
app.post('/hospital/second-opinion', upload.single('file'), async (req, res) => {
  const { hospitalname, name, description } = req.body;
  const file = req.file;

  console.log('Received data:', { hospitalname, name, description });
  console.log('Received file:', file);

  if (!hospitalname || !name || !description) {
    return res.status(400).json({ error: 'Hospital name, name, and description are required' });
  }

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const hospital = await Hospital.findOne({ hospitalname });

    if (!hospital) {
      console.error('Hospital not found');
      return res.status(404).json({ error: 'Hospital not found' });
    }

    console.log('Hospital found:', hospital);

    // Add the new second opinion
    hospital.secondOpinions.push({
      name,
      description,
      filename: file.filename
    });

    console.log('Second opinion to be saved:', {
      name,
      description,
      filename: file.filename
    });

    // Save the updated hospital document
    const updatedHospital = await hospital.save();

    console.log('Hospital updated successfully:', updatedHospital);

    res.json({ message: 'Second opinion added successfully', hospital: updatedHospital });
  } catch (error) {
    console.error('Error adding second opinion:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});



// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});