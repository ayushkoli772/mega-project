const express = require('express');
const router = express.Router();
const axios = require('axios');
const verifyToken= require('../middlewares/auth.js');
const Mentor = require('../models/mentor');
const Query = require('../models/query');

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const PROMPT_TEXT = "You are a supportive and empathetic AI assistant designed to monitor and not only assess students' mental health through indirect and conversational means but also become a close buddy and supportive friend. Your task is to engage users in a friendly, non-judgmental chat by asking indirect questions related to their emotional well-being, stress, social connections, motivation, sleep, and overall mindset. But don't just focus on asking questions as it might not be good to just ask questions, also ask and talk about other things to user to feel comfortable. Keep the questions and conversation short, concise and not giving any note in response. Use the conversation history to avoid repeating questions and generate follow-up questions based on user responses."
let conversationHistory = [
  { role: "system", content: PROMPT_TEXT },
];


router.get('/mentors',verifyToken , async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
});


router.post('/ai-chat', verifyToken ,async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    
    conversationHistory.push({ role: "user", content: question });

    
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: conversationHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content || "No response received from the AI.";

    conversationHistory.push({ role: "assistant", content: assistantMessage });

    res.status(201).json({
      question,
      response: assistantMessage,
    });
  } catch (error) {
    console.error("Error in ai-chat:", error.response?.data || error.message);
    res.status(500).json({ message: 'Error interacting with AI', error: error.message });
  }
});

module.exports = router;
