import { NextRequest, NextResponse } from 'next/server';

// Mock shipping methods data - in production, this would come from database
let shippingMethods = [
  {
    _id: '1',
    name: 'Standard Shipping',
    description: 'Regular delivery within estimated timeframe',
    type: 'standard',
    baseRate: 200,
    freeShippingThreshold: 5000,
    estimatedDays: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Express Shipping',
    description: 'Fast delivery for urgent orders',
    type: 'express',
    baseRate: 500,
    freeShippingThreshold: 10000,
    estimatedDays: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Overnight Delivery',
    description: 'Next day delivery for premium orders',
    type: 'overnight',
    baseRate: 1000,
    freeShippingThreshold: 20000,
    estimatedDays: 1,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/shipping/methods - Get all shipping methods
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: shippingMethods,
      count: shippingMethods.length 
    });
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch shipping methods' }, { status: 500 });
  }
}

// POST /api/shipping/methods - Create new shipping method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, baseRate, freeShippingThreshold, estimatedDays, isActive } = body;

    if (!name || !type || !baseRate || !estimatedDays) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMethod = {
      _id: Date.now().toString(),
      name,
      description: description || '',
      type,
      baseRate,
      freeShippingThreshold: freeShippingThreshold || 0,
      estimatedDays,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shippingMethods.push(newMethod);
    return NextResponse.json({ success: true, data: newMethod }, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping method:', error);
    return NextResponse.json({ success: false, error: 'Failed to create shipping method' }, { status: 500 });
  }
}

// PUT /api/shipping/methods - Update shipping method
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const methodIndex = shippingMethods.findIndex(method => method._id === id);
    if (methodIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Shipping method not found' },
        { status: 404 }
      );
    }

    shippingMethods[methodIndex] = {
      ...shippingMethods[methodIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: shippingMethods[methodIndex] });
  } catch (error) {
    console.error('Error updating shipping method:', error);
    return NextResponse.json({ success: false, error: 'Failed to update shipping method' }, { status: 500 });
  }
}

// DELETE /api/shipping/methods - Delete shipping method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const methodIndex = shippingMethods.findIndex(method => method._id === id);
    if (methodIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Shipping method not found' },
        { status: 404 }
      );
    }

    shippingMethods.splice(methodIndex, 1);
    return NextResponse.json({ success: true, message: 'Shipping method deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete shipping method' }, { status: 500 });
  }
}
