const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const mentorRoutes = require('./routes/mentors');
const studentRoutes = require('./routes/students');

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
