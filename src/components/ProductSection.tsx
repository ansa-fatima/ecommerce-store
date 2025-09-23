'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import ProductCard from './ProductCard';
import Button from './Button';
import { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
  showViewAll?: boolean;
  className?: string;
}

export default function ProductSection({ 
  title, 
  subtitle, 
  products, 
  viewAllHref, 
  showViewAll = true,
  className = ''
}: ProductSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`transform transition-all duration-500 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Link href={viewAllHref}>
              <Button 
                variant="outline" 
                size="lg"
                className="group"
              >
                View All Products
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
