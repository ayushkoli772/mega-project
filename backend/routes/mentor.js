const express = require('express');
const router = express.Router();
const verifyToken= require('../middlewares/auth.js');
const Mentor = require('../models/mentor'); 
const Query = require('../models/query'); 


router.get('/queries', verifyToken, async (req, res) => {
  try {
    const queries = await Query.find({ mentorId: "ok@gmail.com" });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries', error: error.message });
  }
});

module.exports = router;
