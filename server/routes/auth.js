const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  // Mock implementation for login
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  // For demo purposes, we'll always succeed with a mock user and token
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: 123,
      name: 'Demo User',
      email: email
    }
  });
});

router.post('/register', (req, res) => {
  // Mock implementation for registration
  const { name, email, password } = req.body;
  
  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  
  // For demo purposes, we'll always succeed with a mock user and token
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: 123,
      name: name,
      email: email
    }
  });
});

module.exports = router;
