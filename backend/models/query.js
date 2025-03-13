const mongoose = require('mongoose');

const querySchema = mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    Emotional_score: { type: String, required: true },
    mentorId: { type: String, required :true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
