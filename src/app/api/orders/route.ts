import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    // Mock data - since database connection is not working
    const mockOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-001',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        items: [
          {
            productId: '1',
            name: 'Gold Bracelet',
            price: 299.99,
            quantity: 1,
            image: '/image-1.png'
          }
        ],
        total: 299.99,
        subtotal: 299.99,
        shipping: 0,
        tax: 0,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'card',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        orderNumber: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891'
        },
        items: [
          {
            productId: '2',
            name: 'Silver Earrings',
            price: 149.99,
            quantity: 2,
            image: '/image-2.png'
          }
        ],
        total: 299.98,
        subtotal: 299.98,
        shipping: 0,
        tax: 0,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    let filteredOrders = mockOrders;

    // Apply filters to mock data
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredOrders,
      count: filteredOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderNumber || !body.customer || !body.items || !body.total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: orderNumber, customer, items, total' },
        { status: 400 }
      );
    }

    const order = await OrderService.createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT /api/orders - Update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, status' },
        { status: 400 }
      );
    }

    const order = await OrderService.updateOrderStatus(body.id, body.status);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}





