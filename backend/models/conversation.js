const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  mentalHealthMetrics: {
    valence: Number,
    arousal: Number,
    emotions: {
      type: Map,
      of: Number
    },
    score: Number
  }
});

const conversationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    messages: [messageSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    mentalHealth: {
      lastUpdated: {
        type: Date,
        default: Date.now
      },
      valence: {
        type: Number,
        default: 0
      },
      arousal: {
        type: Number,
        default: 0
      },
      emotions: {
        type: Map,
        of: Number,
        default: {}
      },
      overallScore: {
        type: Number,
        default: 0 
      },
      messageCount: {
        type: Number,
        default: 0 
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);