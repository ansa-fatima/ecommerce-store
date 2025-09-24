const express = require('express');
const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: 'order-1',
        orderNumber: 'ORD-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        items: [
          { product: 'Gold Bracelet', quantity: 1, price: 1500 }
        ],
        total: 1500,
        status: 'completed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'order-2',
        orderNumber: 'ORD-002',
        customer: { name: 'Jane Smith', email: 'jane@example.com' },
        items: [
          { product: 'Silver Earrings', quantity: 2, price: 800 }
        ],
        total: 1600,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  });
});

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  const { orderNumber, customer, items, total } = req.body;
  
  if (!orderNumber || !customer || !items || !total) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  res.json({
    success: true,
    data: {
      _id: `order-${Date.now()}`,
      orderNumber,
      customer,
      items,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

module.exports = router;
