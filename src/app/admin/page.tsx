'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { 
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin-login');
    }
  }, [isAdmin, authLoading, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Fetch real data from APIs
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      // Check if API calls were successful
      if (!productsRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data from APIs');
      }
      
      // Extract data from API response
      const products = productsData.data || productsData || [];
      const orders = ordersData.data || ordersData || [];
      
      console.log('Dashboard data loaded:', { products, orders });
      
      // Calculate stats
      const totalProducts = products.length || 0;
      const totalOrders = orders.length || 0;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      
      // Get recent orders (last 4)
      const recentOrders = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map((order: any) => ({
          id: order._id,
          customer: order.customer?.name || 'Unknown Customer',
          amount: order.total || 0,
          status: order.status || 'pending',
          date: new Date(order.createdAt).toLocaleDateString()
        }));
      
      // Get top products (most ordered)
      const topProducts = products
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)
        .map((product: any) => ({
          id: product._id,
          name: product.name,
          sales: Math.floor(Math.random() * 100) + 10, // Mock sales data
          revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 10)
        }));
      
      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        totalUsers: 0, // We don't have users API yet
        recentOrders,
        topProducts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set mock data if API fails
      setStats({
        totalProducts: 12,
        totalOrders: 8,
        totalRevenue: 25000,
        totalUsers: 0,
        recentOrders: [],
        topProducts: []
      });
      alert('Failed to load dashboard data. Showing sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isAdmin]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(price);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect to login
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => loadDashboardData()}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Last updated</p>
                <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <Link href="/admin/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                  View all products
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <Link href="/admin/orders" className="font-medium text-green-600 hover:text-green-500">
                  View all orders
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatPrice(stats.totalRevenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <Link href="/admin/reports" className="font-medium text-yellow-600 hover:text-yellow-500">
                  View reports
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <Link href="/admin/customers" className="font-medium text-purple-600 hover:text-purple-500">
                  View all customers
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
              <div className="space-y-3">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(order.amount)}</p>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">No recent orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Products</h3>
              <div className="space-y-3">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(product.revenue)}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                          Top seller
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-500">No products available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/products" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingBagIcon className="h-6 w-6 text-indigo-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Manage Products</span>
              </Link>
              <Link href="/admin/orders" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">View Orders</span>
              </Link>
              <Link href="/admin/customers" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserGroupIcon className="h-6 w-6 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Manage Customers</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Cog6ToothIcon className="h-6 w-6 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}