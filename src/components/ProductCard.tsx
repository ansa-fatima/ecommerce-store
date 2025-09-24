'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/utils/cn';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCartStore();

  // Debug: Log product colors
  console.log('ProductCard - Product:', product.name);
  console.log('ProductCard - Colors:', product.colors);
  console.log('ProductCard - Has colors:', product.colors && product.colors.length > 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      addItem(product, 1);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <div className={cn('product-card group h-full flex flex-col', className)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="product-card-image group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
            Out of Stock
          </div>
        )}

        {/* Action Buttons */}
        <div className="product-card-actions group-hover:opacity-100">
          <button
            onClick={handleWishlistToggle}
            className="icon-btn"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
          
          <Link
            href={`/products/${product._id}`}
            className="icon-btn"
            title="Quick view"
          >
            <EyeIcon className="h-4 w-4 text-gray-600" />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className="product-card-overlay group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isLoading}
            className={cn(
              'w-full btn btn-primary flex items-center justify-center space-x-2',
              (product.stock <= 0 || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>
              {isLoading ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/products/${product._id}`}>
            <h3 className="product-card-title line-clamp-2 text-sm sm:text-base h-10 sm:h-12 flex items-center">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Category */}
        <p className="text-xs sm:text-sm text-indigo-600 mb-1 h-4 sm:h-5 flex items-center font-medium">
          {typeof product.category === 'string' ? product.category : product.category.name}
        </p>

        {/* Brand */}
        <p className="text-xs sm:text-sm text-gray-500 mb-2 h-4 sm:h-5 flex items-center">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2 sm:mb-3 h-4 sm:h-5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={cn(
                  'h-3 w-3 sm:h-4 sm:w-4',
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-500">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 h-6 sm:h-7">
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Colors */}
        <div className="mt-2 mb-2">
          {product.colors && product.colors.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No colors available</div>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-auto pt-2">
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-600 h-4">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
