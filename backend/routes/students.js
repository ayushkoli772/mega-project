const express = require('express');
const router = express.Router();

const Mentor = require('../models/mentor'); // Adjust the model import if necessary
const Query = require('../models/query');  // Assuming a query model exists

// GET: Fetch all available mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
});

// POST: Submit a query
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;
    const newQuery = await Query.create({
      studentId: req.user.id,
      studentName: req.user.name,
      question,
    });
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting query', error: error.message });
  }
});

module.exports = router;
