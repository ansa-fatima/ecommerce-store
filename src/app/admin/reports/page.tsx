'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState<'overview' | 'sales' | 'customers' | 'products'>('overview');
  
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin-login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadReportData();
    }
  }, [isAdmin, dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?range=${dateRange}`);
      const data = await response.json();
      setReportData(data.data || data);
    } catch (error) {
      console.error('Error loading report data:', error);
      // Set mock data if API fails
      setReportData({
        totalRevenue: 125000,
        totalOrders: 156,
        totalCustomers: 89,
        totalProducts: 45,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        averageOrderValue: 801.28,
        topProducts: [
          { name: 'Elegant Gold Bracelet', sales: 45, revenue: 9000 },
          { name: 'Pearl Drop Earrings', sales: 38, revenue: 7600 },
          { name: 'Diamond Pendant Necklace', sales: 32, revenue: 6400 },
          { name: 'Charm Keychain Set', sales: 28, revenue: 5600 },
          { name: 'Silver Ring Collection', sales: 25, revenue: 5000 }
        ],
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 1250, status: 'delivered', date: '2024-01-15' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 850, status: 'shipped', date: '2024-01-14' },
          { id: 'ORD-003', customer: 'Ahmed Hassan', amount: 2000, status: 'processing', date: '2024-01-13' },
          { id: 'ORD-004', customer: 'Sarah Wilson', amount: 650, status: 'delivered', date: '2024-01-12' },
          { id: 'ORD-005', customer: 'Mike Johnson', amount: 1200, status: 'shipped', date: '2024-01-11' }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 25000, orders: 45 },
          { month: 'Feb', revenue: 32000, orders: 52 },
          { month: 'Mar', revenue: 28000, orders: 48 },
          { month: 'Apr', revenue: 35000, orders: 58 },
          { month: 'May', revenue: 40000, orders: 62 },
          { month: 'Jun', revenue: 45000, orders: 68 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin || !reportData) {
    return null;
  }

  return (
    <AdminLayout title="Reports & Analytics">
      {/* Date Range Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'sales', name: 'Sales', icon: CurrencyDollarIcon },
              { id: 'customers', name: 'Customers', icon: UserGroupIcon },
              { id: 'products', name: 'Products', icon: ShoppingBagIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setReportType(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    reportType === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice(reportData.totalRevenue)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(reportData.revenueGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(reportData.revenueGrowth)}`}>
                    {Math.abs(reportData.revenueGrowth)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.totalOrders}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(reportData.ordersGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(reportData.ordersGrowth)}`}>
                    {Math.abs(reportData.ordersGrowth)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.totalCustomers}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(reportData.customersGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(reportData.customersGrowth)}`}>
                    {Math.abs(reportData.customersGrowth)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice(reportData.averageOrderValue)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
              <div className="space-y-4">
                {reportData.monthlyRevenue.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(month.revenue)}</p>
                      <p className="text-xs text-gray-500">{month.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-4">
                {reportData.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(product.revenue)}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {reportType === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h3>
            <p className="text-gray-500">Detailed sales reports and analytics will be displayed here.</p>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {reportType === 'customers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Analytics</h3>
            <p className="text-gray-500">Customer insights and analytics will be displayed here.</p>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {reportType === 'products' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Analytics</h3>
            <p className="text-gray-500">Product performance and analytics will be displayed here.</p>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>
    </AdminLayout>
  );
}
