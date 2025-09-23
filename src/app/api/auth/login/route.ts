import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Admin credentials
    const ADMIN_CREDENTIALS = {
      email: 'admin@bloomyourstyle.com',
      password: 'admin123'
    };

    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        _id: 'admin1',
        email: email,
        name: 'Admin User',
        role: 'admin',
        avatar: undefined
      };

      // Create response with admin user data
      const response = NextResponse.json({
        success: true,
        user: adminUser,
        message: 'Login successful'
      });

      // Set cookie for admin session
      response.cookies.set('adminUser', JSON.stringify(adminUser), {
        path: '/',
        maxAge: 86400, // 24 hours
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
