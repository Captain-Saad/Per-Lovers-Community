require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRouter = require('./routes/upload');
const petPostsRouter = require('./routes/petPosts');
const authRouter = require('./routes/auth');

// Temporary hardcoded values for testing
const MONGODB_URI = 'mongodb+srv://saadkhaan124:saadkhan1234@petlovers.rt6kajd.mongodb.net/pet-lovers?retryWrites=true&w=majority&appName=PetLovers';
const PORT = 5000;
const JWT_SECRET = 'pet_lovers_jwt_secret_2024';

console.log('Using configuration:', {
  PORT,
  MONGODB_URI: '***set***',
  JWT_SECRET: '***set***'
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public/uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/pet-posts', petPostsRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- GET /api/test');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
      console.log('- GET /api/pet-posts');
      console.log('- POST /api/pet-posts');
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});