import { NextRequest, NextResponse } from 'next/server';

// Mock shipping zones data - in production, this would come from database
let shippingZones = [
  {
    _id: '1',
    name: 'Domestic (Pakistan)',
    countries: ['Pakistan'],
    regions: ['All'],
    freeShippingThreshold: 5000,
    standardRate: 200,
    expressRate: 500,
    estimatedDays: { standard: 3, express: 1 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'International',
    countries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
    regions: ['North America', 'Europe', 'Oceania'],
    freeShippingThreshold: 15000,
    standardRate: 1500,
    expressRate: 3000,
    estimatedDays: { standard: 7, express: 3 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/shipping/zones - Get all shipping zones
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: shippingZones,
      count: shippingZones.length 
    });
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch shipping zones' }, { status: 500 });
  }
}

// POST /api/shipping/zones - Create new shipping zone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, countries, regions, freeShippingThreshold, standardRate, expressRate, estimatedDays, isActive } = body;

    if (!name || !countries || !standardRate || !expressRate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newZone = {
      _id: Date.now().toString(),
      name,
      countries: Array.isArray(countries) ? countries : [countries],
      regions: Array.isArray(regions) ? regions : [regions],
      freeShippingThreshold: freeShippingThreshold || 0,
      standardRate,
      expressRate,
      estimatedDays: estimatedDays || { standard: 3, express: 1 },
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shippingZones.push(newZone);
    return NextResponse.json({ success: true, data: newZone }, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    return NextResponse.json({ success: false, error: 'Failed to create shipping zone' }, { status: 500 });
  }
}

// PUT /api/shipping/zones - Update shipping zone
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

    const zoneIndex = shippingZones.findIndex(zone => zone._id === id);
    if (zoneIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Shipping zone not found' },
        { status: 404 }
      );
    }

    shippingZones[zoneIndex] = {
      ...shippingZones[zoneIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: shippingZones[zoneIndex] });
  } catch (error) {
    console.error('Error updating shipping zone:', error);
    return NextResponse.json({ success: false, error: 'Failed to update shipping zone' }, { status: 500 });
  }
}

// DELETE /api/shipping/zones - Delete shipping zone
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

    const zoneIndex = shippingZones.findIndex(zone => zone._id === id);
    if (zoneIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Shipping zone not found' },
        { status: 404 }
      );
    }

    shippingZones.splice(zoneIndex, 1);
    return NextResponse.json({ success: true, message: 'Shipping zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping zone:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete shipping zone' }, { status: 500 });
  }
}
