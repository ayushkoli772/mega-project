const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

const User = require('../models/user.js');
const Mentor = require('../models/mentor.js');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role, code } = req.body;

  console.log(role);

  try {
    if(role == 'mentor'){
      const hashedPassword = await bcrypt.hash(password, 10);

      let mentorCode;
      do {
        mentorCode = Array(5).fill()
          .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36)))
          .join('');
        const existingMentor = await Mentor.findOne({ code: mentorCode });
        if (!existingMentor) break;
      } while (true);
      const mentor = new Mentor({ name, email, password: hashedPassword, code:mentorCode });
      await mentor.save();
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      let mentor = await Mentor.findOne({ code:code });
      console.log(mentor);
      const user = new User({ name, email, password: hashedPassword, mentorCode: code});
      await user.save();
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '4h' });


    res.cookie('token', token, {
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict', 
      maxAge: 4* 60 * 60 * 1000, 
    });

    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
