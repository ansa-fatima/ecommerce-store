import { NextRequest, NextResponse } from 'next/server';

// POST /api/admin/change-password - Change admin password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Mock password validation - in production, this would verify against database
    const ADMIN_CREDENTIALS = {
      email: 'admin@bloomyourstyle.com',
      password: 'admin123'
    };

    // Verify current password
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Hash the new password
    // 2. Update the password in the database
    // 3. Invalidate existing sessions if needed

    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to change password' 
    }, { status: 500 });
  }
}
