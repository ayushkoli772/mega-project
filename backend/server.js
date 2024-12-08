const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const mentorRoutes = require('./routes/mentor.js');
const studentRoutes = require('./routes/students.js');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
