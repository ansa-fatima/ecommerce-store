'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { useCartStore } from '@/store/cartStore';
import { useShippingStore } from '@/store/shippingStore';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const { getShippingCost, isFreeShipping, getShippingMessage } = useShippingStore();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setUpdating(itemId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    updateQuantity(itemId, newQuantity);
    setUpdating(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdating(itemId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    removeItem(itemId);
    setUpdating(null);
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const subtotal = getTotalPrice();
  const shipping = getShippingCost(subtotal);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <ShoppingBagIcon className="h-24 w-24 text-secondary-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Your cart is empty</h1>
            <p className="text-secondary-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-primary-600 hover:text-primary-700">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900">Shopping Cart</h1>
          </div>
          <div className="text-sm text-secondary-600">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-secondary-200">
                {items.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 relative bg-secondary-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.product._id}`}
                          className="text-lg font-medium text-secondary-900 hover:text-primary-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-secondary-600 mt-1">{item.product.brand}</p>
                        
                        {item.size && (
                          <p className="text-sm text-secondary-500 mt-1">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-secondary-500">Color: {item.color}</p>
                        )}

                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-semibold text-secondary-900">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-secondary-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={updating === item._id}
                          className="p-1 hover:bg-secondary-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        
                        <div className="w-12 text-center">
                          {updating === item._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent mx-auto"></div>
                          ) : (
                            <span className="text-sm font-medium">{item.quantity}</span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={updating === item._id || item.quantity >= item.product.stock}
                          className="p-1 hover:bg-secondary-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={updating === item._id}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="text-secondary-900">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Shipping</span>
                  <div className="text-right">
                    <div className="text-secondary-900">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {getShippingMessage(subtotal)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Tax</span>
                  <span className="text-secondary-900">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-secondary-900">Total</span>
                    <span className="text-secondary-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700 whitespace-nowrap">
                    Add {formatPrice(1000 - subtotal)} more for free shipping!
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-secondary-500">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
