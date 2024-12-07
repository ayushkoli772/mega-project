const express = require('express');
const router = express.Router();

const Mentor = require('../models/mentor'); // Adjust the model import if necessary
const Query = require('../models/query');  // Assuming a query model exists

// GET: Fetch queries assigned to the mentor
router.get('/queries', async (req, res) => {
  try {
    const queries = await Query.find({ mentorId: req.user.id });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries', error: error.message });
  }
});

module.exports = router;
