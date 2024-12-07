const mongoose = require('mongoose');

const querySchema = mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    studentName: { type: String, required: true },
    question: { type: String, required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }, // Optional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
