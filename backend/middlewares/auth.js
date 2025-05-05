const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async(req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findOne({ email: decoded.email });
    
    next();
  } catch (err) {
    
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
