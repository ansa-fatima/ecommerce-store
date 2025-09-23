'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { useGuestOrderStore } from '@/store/guestOrderStore';
import { formatPrice } from '@/utils/format';

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrder } = useGuestOrderStore();

  useEffect(() => {
    if (orderId) {
      const orderData = getOrder(orderId);
      setOrder(orderData);
    }
  }, [orderId, getOrder]);
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          {order && (
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Details</h2>
              <div className="space-y-2 text-left">
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">Customer:</span> {order.customer.firstName} {order.customer.lastName}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                <p><span className="font-medium">Total:</span> {formatPrice(order.total)}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize text-green-600">{order.status}</span></p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">What's Next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">1</span>
                </div>
                <span className="text-secondary-700">You'll receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">2</span>
                </div>
                <span className="text-secondary-700">We'll prepare your items for shipping</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">3</span>
                </div>
                <span className="text-secondary-700">You'll get a tracking number once shipped</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">
                <HomeIcon className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/orders">
              <Button variant="outline" size="lg">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
