const express = require('express');
const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Bracelets', slug: 'bracelets', isActive: true },
      { id: 2, name: 'Earrings', slug: 'earrings', isActive: true },
      { id: 3, name: 'Necklaces', slug: 'necklaces', isActive: true },
      { id: 4, name: 'Rings', slug: 'rings', isActive: true }
    ]
  });
});

// POST /api/categories - Create new category
router.post('/', (req, res) => {
  const { name, slug, isActive = true } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({
      success: false,
      error: 'Name and slug are required'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: Date.now(),
      name,
      slug,
      isActive
    }
  });
});

module.exports = router;
