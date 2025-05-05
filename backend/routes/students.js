const express = require('express');
const router = express.Router();
const axios = require('axios');
const verifyToken= require('../middlewares/auth.js');
const Mentor = require('../models/mentor');
const Query = require('../models/query');
const Conversation = require('../models/conversation.js');
const { getEmotionModel, getTokenizer } = require('./services/emotionModelService');
const tf = require('@tensorflow/tfjs-node')

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const PROMPT_TEXT = "You are a supportive and empathetic AI assistant designed to monitor and not only assess students' mental health through indirect and conversational means but also become a close buddy and supportive friend. Your task is to engage users in a friendly, non-judgmental chat by asking indirect questions related to their emotional well-being, stress, social connections, motivation, sleep, and overall mindset. But don't just focus on asking questions as it might not be good to just ask questions, also ask and talk about other things to user to feel comfortable. Keep the questions and conversation short, concise and not giving any note in response. Use the conversation history to avoid repeating questions and generate follow-up questions based on user responses."


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
    const email = req.user.email;
    const name = req.user.name;
    const MAX_CONTEXT_MESSAGES = 10;
    const emotionModel = getEmotionModel();
    const tokenizer = getTokenizer();

    if (!question) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    let conversation = await Conversation.findOne({ 
      email: email,
      isActive: true 
    });

    if (!conversation) {
      
      conversation = new Conversation({
        email: email,
        studentName: name,
        messages: [
          { role: 'system', content: PROMPT_TEXT }
        ]
      });
    
    }
    const encoded = tokenizer.encode(question);
    const inputIds = tf.tensor([encoded.ids], undefined, 'int32');
    const attentionMask = tf.tensor([encoded.attentionMask], undefined, 'int32');

    const prediction = await emotionModel.predict({ input_ids: inputIds, attention_mask: attentionMask });

    const emotionProbsTensor = prediction[0];
    const vaValuesTensor = prediction[1];

    const emotionProbs = (await emotionProbsTensor.array())[0];
    const vaValues = (await vaValuesTensor.array())[0];

    const result = {
      text: question,
      emotions: emotionProbs,
      valence: vaValues[0],
      arousal: vaValues[1]
    };

    const score = ((result.valence + 1) / 2) * 100 - (Math.abs(result.arousal) * 20);

    // Save the message with mental health metrics

    conversation.messages.push({
      role: 'user',
      content: question,
      mentalHealthMetrics: {
        valence: result.valence,
        arousal: result.arousal,
        emotions: result.emotions,
        score: score
      }
    });

    tf.dispose([inputIds, attentionMask, emotionProbsTensor, vaValuesTensor]);

    let contextMessages = [];
    const systemMessage = conversation.messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      contextMessages.push(systemMessage);
    }

    const recentMessages = conversation.messages
      .filter(msg => msg.role !== 'system')
      .slice(-MAX_CONTEXT_MESSAGES);

    contextMessages = [...contextMessages, ...recentMessages];

    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: contextMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content || "No response received from the AI.";

    conversation.messages.push({
      role: 'assistant',
      content: assistantMessage
    });

    await conversation.save();

    res.status(201).json({
      question,
      response: assistantMessage,
    });
  } catch (error) {
    console.error("Error in ai-chat:", error.response?.data || error.message);
    res.status(500).json({ message: 'Error interacting with AI', error: error.message });
  }
});

router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    const conversation = await Conversation.findOne({
      email:email,
      isActive: true
    });
    
    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }
    
    const formattedMessages = conversation.messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        text: msg.content
      }));
    
    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

module.exports = router;
