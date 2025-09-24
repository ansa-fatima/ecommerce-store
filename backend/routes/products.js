const express = require('express');
const router = express.Router();

// Mock data (replace with database)
let products = [
  {
    _id: '1',
    name: 'Elegant Gold Bracelet',
    description: 'Beautiful gold bracelet with intricate design',
    price: 200,
    originalPrice: 300,
    images: ['/image-6.jpg'],
    category: 'Bracelets',
    brand: 'AZH Collection',
    inStock: true,
    stock: 15,
    status: 'active',
    rating: 4.5,
    reviews: [],
    tags: ['gold', 'bracelet', 'elegant'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    // Search
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    res.json({ success: true, data: filteredProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
  try {
    const newProduct = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date(),
    };
    
    res.json({ success: true, data: products[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1)[0];
    res.json({ success: true, data: deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

module.exports = router;











