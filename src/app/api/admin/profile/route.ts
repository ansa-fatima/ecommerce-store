import { NextRequest, NextResponse } from 'next/server';

// Mock admin profile data - in production, this would come from database
let adminProfile = {
  _id: '1',
  name: 'Admin User',
  email: 'admin@bloomyourstyle.com',
  phone: '+92 300 1234567',
  avatar: '/placeholder-avatar.jpg',
  role: 'Super Admin',
  permissions: ['products', 'orders', 'customers', 'settings', 'reports', 'notifications', 'shipping'],
  lastLogin: new Date().toISOString(),
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  updatedAt: new Date().toISOString()
};

// GET /api/admin/profile - Get admin profile
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: adminProfile
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

// PUT /api/admin/profile - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, avatar } = body;

    // Update profile with new data
    adminProfile = {
      ...adminProfile,
      name: name || adminProfile.name,
      email: email || adminProfile.email,
      phone: phone || adminProfile.phone,
      avatar: avatar || adminProfile.avatar,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      data: adminProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin profile' }, { status: 500 });
  }
}
