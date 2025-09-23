'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EyeIcon, 
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Mock data - in a real app, you'd fetch from your API
      const mockOrders: Order[] = [
        {
          _id: '1',
          userId: 'user1',
          items: [
            {
              product: {
                _id: '1',
                name: 'Wireless Bluetooth Headphones',
                description: 'High-quality wireless headphones',
                price: 99.99,
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
                category: 'Electronics',
                brand: 'TechSound',
                inStock: true,
                stock: 15,
                status: 'active',
                rating: 4.5,
                reviews: [],
                tags: ['wireless', 'bluetooth'],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              quantity: 1,
              price: 99.99,
            },
          ],
          shippingAddress: {
            _id: '1',
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '555-123-4567',
            isDefault: true,
          },
          billingAddress: {
            _id: '2',
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '555-123-4567',
            isDefault: false,
          },
          paymentMethod: 'card',
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          totalAmount: 99.99,
          shippingCost: 0,
          tax: 8.00,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
        },
        {
          _id: '2',
          userId: 'user1',
          items: [
            {
              product: {
                _id: '2',
                name: 'Smart Fitness Watch',
                description: 'Track your fitness goals',
                price: 199.99,
                images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
                category: 'Electronics',
                brand: 'FitTech',
                inStock: true,
                stock: 8,
                status: 'active',
                rating: 4.8,
                reviews: [],
                tags: ['smartwatch', 'fitness'],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              quantity: 1,
              price: 199.99,
            },
          ],
          shippingAddress: {
            _id: '1',
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '555-123-4567',
            isDefault: true,
          },
          billingAddress: {
            _id: '2',
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '555-123-4567',
            isDefault: false,
          },
          paymentMethod: 'card',
          paymentStatus: 'paid',
          orderStatus: 'shipped',
          totalAmount: 199.99,
          shippingCost: 9.99,
          tax: 16.80,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-22'),
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Please sign in to view your orders</h1>
            <Button onClick={() => router.push('/login')}>Sign In</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Your Orders</h1>
          <p className="text-secondary-600 mt-2">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <TruckIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No orders yet</h3>
            <p className="text-secondary-600 mb-8">Start shopping to see your orders here</p>
            <Button onClick={() => router.push('/products')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Order #{order._id}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-12 h-12 relative bg-secondary-100 rounded-lg overflow-hidden">
                              <img
                                src={item.product.images[0] || '/placeholder-product.jpg'}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-secondary-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-secondary-600">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Subtotal</span>
                          <span className="text-secondary-900">
                            {formatPrice(order.totalAmount - order.shippingCost - order.tax)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Shipping</span>
                          <span className="text-secondary-900">
                            {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">Tax</span>
                          <span className="text-secondary-900">{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-secondary-200">
                          <span className="text-secondary-900">Total</span>
                          <span className="text-secondary-900">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
