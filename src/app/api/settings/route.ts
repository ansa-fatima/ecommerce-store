import { NextRequest, NextResponse } from 'next/server';

// Mock settings data - in production, this would come from database
let settings = {
  storeName: 'Bloomy Your Style',
  storeDescription: 'Beautiful jewelry and accessories for every occasion',
  storeEmail: 'info@bloomyourstyle.com',
  storePhone: '+92 300 1234567',
  storeAddress: '123 Fashion Street, Karachi, Pakistan',
  storeLogo: '/logo-image.png',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  language: 'en',
  maintenanceMode: false,
  allowGuestCheckout: true,
  requireEmailVerification: true,
  enableReviews: true,
  enableWishlist: true,
  enableNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  updatedAt: new Date().toISOString()
};

// GET /api/settings - Get all settings
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update settings with new data
    settings = {
      ...settings,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
