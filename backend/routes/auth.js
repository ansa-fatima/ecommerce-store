const express = require('express');
const router = express.Router();

// POST /api/auth/login - Admin login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple admin credentials check
  if (email === 'admin@bloomyourstyle.com' && password === 'admin123') {
    res.json({
      success: true,
      user: {
        _id: 'admin-1',
        email: 'admin@bloomyourstyle.com',
        name: 'Admin User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

module.exports = router;
