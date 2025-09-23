import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/database';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    let orders = await OrderService.getAllOrders();

    // Filter by status if provided
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status);
    }

    // Filter by payment status if provided
    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter(order => order.paymentStatus === paymentStatus);
    }

    return NextResponse.json({ 
      success: true, 
      data: orders,
      count: orders.length 
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





