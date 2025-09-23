import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/database';

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let customers = await UserService.getAllUsers();

    // Filter by status if provided
    if (status && status !== 'all') {
      customers = customers.filter(customer => 
        status === 'active' ? customer.isActive : !customer.isActive
      );
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        (customer.phone && customer.phone.includes(search))
      );
    }

    // Transform customers to include additional fields
    const customersWithStats = customers.map(customer => ({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      avatar: customer.avatar,
      isActive: customer.isActive,
      totalOrders: 0, // This would need to be calculated from orders
      totalSpent: 0, // This would need to be calculated from orders
      lastOrderDate: null, // This would need to be calculated from orders
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }));

    return NextResponse.json({ 
      success: true, 
      data: customersWithStats,
      count: customersWithStats.length 
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// PUT /api/customers - Update customer status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, isActive' },
        { status: 400 }
      );
    }

    const customer = await UserService.updateUser(id, { isActive });
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 });
  }
}
