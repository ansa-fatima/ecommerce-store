import { NextRequest, NextResponse } from 'next/server';
import { ProductService, OrderService, UserService } from '@/lib/database';

// GET /api/reports - Get reports data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30';
    const days = parseInt(range);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch data from database
    const [products, orders, customers] = await Promise.all([
      ProductService.getAllProducts(),
      OrderService.getAllOrders(),
      UserService.getAllUsers()
    ]);

    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Calculate metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (mock data for now)
    const revenueGrowth = 12.5;
    const ordersGrowth = 8.3;
    const customersGrowth = 15.2;

    // Get recent orders
    const recentOrders = filteredOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.orderNumber || order._id,
        customer: order.customer?.name || 'Unknown',
        amount: order.total || 0,
        status: order.status || 'pending',
        date: order.createdAt
      }));

    // Get top products (mock data for now)
    const topProducts = [
      { name: 'Elegant Gold Bracelet', sales: 45, revenue: 9000 },
      { name: 'Pearl Drop Earrings', sales: 38, revenue: 7600 },
      { name: 'Diamond Pendant Necklace', sales: 32, revenue: 6400 },
      { name: 'Charm Keychain Set', sales: 28, revenue: 5600 },
      { name: 'Silver Ring Collection', sales: 25, revenue: 5000 }
    ];

    // Generate monthly revenue data
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Mock data for monthly revenue
      const revenue = Math.floor(Math.random() * 20000) + 20000;
      const orderCount = Math.floor(Math.random() * 20) + 30;
      
      monthlyRevenue.push({
        month: monthName,
        revenue,
        orders: orderCount
      });
    }

    const reportData = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      averageOrderValue,
      topProducts,
      recentOrders,
      monthlyRevenue
    };

    return NextResponse.json({ 
      success: true, 
      data: reportData
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reports' }, { status: 500 });
  }
}
