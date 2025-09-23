'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FireIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const trendingItems = [
  { name: 'Electronics', href: '/products?category=electronics', icon: '📱' },
  { name: 'Fashion', href: '/products?category=clothing', icon: '👕' },
  { name: 'Home & Garden', href: '/products?category=home-kitchen', icon: '🏠' },
  { name: 'Sports', href: '/products?category=sports', icon: '⚽' },
  { name: 'Books', href: '/products?category=books', icon: '📚' },
  { name: 'Beauty', href: '/products?category=beauty', icon: '💄' },
];

export default function TrendingSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FireIcon className="h-8 w-8 text-orange-500 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trending Now
            </h2>
          </div>
          <p className="text-gray-600">
            Discover what's popular right now
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {item.name}
              </h3>
              
              {/* Hover Arrow */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRightIcon className="w-4 h-4 text-blue-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
