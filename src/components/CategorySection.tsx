'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useData } from '@/contexts/DataContext';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  href: string;
}

export default function CategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { categories, loading } = useData();

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products across different categories
          </p>
        </div>

        {/* Mobile: Horizontal Scrollable Categories */}
        <div className="block md:hidden">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.length > 0 ? categories.map((category, index) => (
              <Link
                key={category._id}
                href={category.href}
                className="category-item group flex-shrink-0"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  {/* Circular Image */}
                  <div className="category-circle w-20 h-20">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                  
                  {/* Category Text */}
                  <div className="text-center">
                    <h3 className="category-text text-gray-900 font-semibold text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      {category.productCount} items
                    </p>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-500">No categories available</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.length > 0 ? categories.map((category, index) => (
            <Link
              key={category._id}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content - Always Visible */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  {/* Always visible text with dark background for readability */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-2">
                    <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm drop-shadow-lg">
                      {category.productCount} products
                    </p>
                  </div>
                  
                  {/* Hover overlay for additional effect */}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-gradient-to-t from-black/60 to-transparent rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white/80 text-sm">
                        Shop {category.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-colors duration-300" />
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
