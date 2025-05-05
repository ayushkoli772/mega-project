const express = require('express');
const mongoose = require('mongoose');
const { initEmotionService } = require('./services/emotionModelService');

const cors = require('cors');
require('dotenv').config();


const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.js');
const mentorRoutes = require('./routes/mentor.js');
const studentRoutes = require('./routes/students.js');
const allowedOrigins = ['http://localhost:3000'];

const app = express();
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials
}));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
(async () => {
  await initEmotionService();
  // Start your app after model & tokenizer are loaded
  console.log('Model is loaded');
  
})();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
