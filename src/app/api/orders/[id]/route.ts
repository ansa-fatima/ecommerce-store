import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/database';

// GET /api/orders/[id] - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await OrderService.getOrderById(params.id);
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update order by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, paymentStatus, ...updateData } = body;

    let order;

    // Update status if provided
    if (status) {
      order = await OrderService.updateOrderStatus(params.id, status);
    }

    // Update payment status if provided
    if (paymentStatus) {
      order = await OrderService.updateOrderPaymentStatus(params.id, paymentStatus);
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
