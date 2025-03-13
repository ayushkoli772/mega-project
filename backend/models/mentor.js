const mongoose = require('mongoose');

const mentorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mentor', mentorSchema);
