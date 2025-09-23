'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useData } from '@/contexts/DataContext';

export default function ProductsPage() {
  const { products, categories, loading, refreshProducts } = useData();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [brandFilter, setBrandFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeFilter && !(event.target as Element).closest('.relative')) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilter]);

  // Memoize filtered and sorted products for better performance
  const sortedProducts = useMemo(() => {
    const filteredProducts = products.filter(product => {
      const isActive = product.isActive === true;
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' ||
        (typeof product.category === 'string' ? product.category : product.category?._id) === filterCategory;
      const matchesBrand = brandFilter === 'all' || (product.brand && product.brand === brandFilter);
      
      // Price range filter
      const productPrice = product.price;
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
      
      // Rating filter
      const productRating = product.rating || 0;
      const ratingThreshold = ratingFilter === 'all' ? 0 : parseFloat(ratingFilter);
      const matchesRating = productRating >= ratingThreshold;
      
      // Availability filter
      const isInStock = (product.stock || 0) > 0;
      const matchesAvailability = availabilityFilter === 'all' || 
                                (availabilityFilter === 'in-stock' && isInStock) ||
                                (availabilityFilter === 'out-of-stock' && !isInStock);
      
      return isActive && matchesSearch && matchesCategory && matchesBrand && 
             matchesPrice && matchesRating && matchesAvailability;
    });

    // Sort products
    return filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [products, debouncedSearchTerm, filterCategory, brandFilter, priceRange, ratingFilter, availabilityFilter, sortBy, sortOrder]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 Manual refresh triggered');
      await refreshProducts();
      console.log('✅ Manual refresh completed');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get unique brands from products
  const uniqueBrands = useMemo(() => {
    const brands = products
      .map(product => product.brand)
      .filter((brand, index, self) => brand && self.indexOf(brand) === index);
    return brands.sort();
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover our collection of amazing products
              </p>
        </div>

            {/* Search Bar */}
            <div className="mt-4 sm:mt-0">
              <div className="relative max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
            </div>
            
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section - Simple Dropdown Style */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'category' ? null : 'category')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === 'category' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Category
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeFilter === 'category' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'category' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setFilterCategory('all');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            filterCategory === 'all' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => {
                              setFilterCategory(category._id);
                              setActiveFilter(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              filterCategory === category._id 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'brand' ? null : 'brand')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === 'brand' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Brand
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeFilter === 'brand' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'brand' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setBrandFilter('all');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            brandFilter === 'all' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Brands
                        </button>
                        {uniqueBrands.map((brand) => (
                          <button
                            key={brand}
                            onClick={() => {
                              setBrandFilter(brand);
                              setActiveFilter(null);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              brandFilter === brand 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'price' ? null : 'price')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === 'price' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Price
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeFilter === 'price' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'price' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Price Range</label>
                        <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                          <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                        <button
                          onClick={() => setActiveFilter(null)}
                          className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'rating' ? null : 'rating')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === 'rating' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Rating
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeFilter === 'rating' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'rating' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setRatingFilter('all');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            ratingFilter === 'all' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Ratings
                        </button>
                        <button
                          onClick={() => {
                            setRatingFilter('4');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            ratingFilter === '4' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          4+ Stars
                        </button>
                        <button
                          onClick={() => {
                            setRatingFilter('3');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            ratingFilter === '3' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          3+ Stars
                        </button>
                        <button
                          onClick={() => {
                            setRatingFilter('2');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            ratingFilter === '2' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          2+ Stars
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Filter */}
              <div className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === 'availability' ? null : 'availability')}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === 'availability' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Availability
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeFilter === 'availability' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'availability' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setAvailabilityFilter('all');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            availabilityFilter === 'all' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          All Products
                        </button>
                        <button
                          onClick={() => {
                            setAvailabilityFilter('in-stock');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            availabilityFilter === 'in-stock' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          In Stock
                        </button>
                        <button
                          onClick={() => {
                            setAvailabilityFilter('out-of-stock');
                            setActiveFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            availabilityFilter === 'out-of-stock' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Out of Stock
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sort and Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="createdAt">Newest</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronDownIcon className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                {isRefreshing ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading || isRefreshing ? (
          <div className="text-center py-12">
            <LoadingSpinner />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Loading products...</h3>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
            ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters, or add new products from the admin panel.
            </p>
              </div>
            )}
      </div>

      <Footer />
    </div>
  );
}