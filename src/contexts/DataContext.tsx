'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { Category } from '@/data/categories';
// Remove old API imports - we'll use fetch directly

interface DataContextType {
  products: Product[];
  categories: Category[];
  refreshProducts: () => void;
  refreshCategories: () => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      console.log('🔄 Refreshing products...');
      console.log('🔄 typeof window:', typeof window);
      console.log('🔄 Fetching from: /api/products');
      
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        console.log('⚠️ Running on server side, skipping fetch');
        return;
      }
      
      const response = await fetch(`/api/products?t=${Date.now()}`);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 API Response:', data);
      console.log('📦 Data type:', typeof data);
      console.log('📦 Data keys:', Object.keys(data || {}));
      
      if (data.success && data.data) {
        console.log('📦 Setting products:', data.data.length, 'items');
        console.log('📦 First product colors:', data.data[0]?.colors);
        setProducts(data.data);
        console.log('✅ Products set successfully');
      } else if (Array.isArray(data)) {
        // Handle case where API returns array directly
        console.log('📦 Setting products (array format):', data.length, 'items');
        setProducts(data);
        console.log('✅ Products set successfully (array format)');
      } else if (data.data && Array.isArray(data.data)) {
        // Handle case where API returns { data: [...] } format
        console.log('📦 Setting products (data.data format):', data.data.length, 'items');
        setProducts(data.data);
        console.log('✅ Products set successfully (data.data format)');
      } else {
        console.warn('⚠️ Unexpected API response format:', data);
        console.warn('⚠️ Data type:', typeof data);
        console.warn('⚠️ Data keys:', Object.keys(data || {}));
        // Set empty array as fallback
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error refreshing products:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : error);
    }
  };

  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        // Convert MongoDB categories to frontend format
        const frontendCategories = data.data
          .filter((cat: any) => cat.isActive) // Only show active categories on store
          .map((cat: any) => {
            // Calculate actual product count for this category
            const categoryProducts = products.filter(product => {
              if (typeof product.category === 'string') {
                return product.category === cat._id;
              } else if (typeof product.category === 'object' && product.category !== null) {
                return product.category._id === cat._id;
              }
              return false;
            });
            
            return {
              _id: cat._id,
              id: cat._id,
              name: cat.name,
              description: cat.description,
              image: cat.image,
              href: `/products?category=${cat._id}`,
              isActive: cat.isActive,
              productCount: categoryProducts.length
            };
          });
        setCategories(frontendCategories);
        console.log('🔄 Categories refreshed for customer side:', frontendCategories.length, 'active categories');
      }
    } catch (error) {
      console.error('Error refreshing categories:', error);
      // Fallback to default categories if API fails
      const defaultCategories = [
        {
          _id: '1',
          id: '1',
          name: 'Bracelets',
          description: 'Beautiful bracelets for every occasion',
          image: '/image-6.jpg',
          href: '/products?category=1',
          isActive: true,
          productCount: 45
        },
        {
          _id: '2',
          id: '2',
          name: 'Earrings',
          description: 'Elegant earrings to complete your look',
          image: '/image-5.jpg',
          href: '/products?category=2',
          isActive: true,
          productCount: 68
        },
        {
          _id: '3',
          id: '3',
          name: 'Necklaces',
          description: 'Stunning necklaces for special moments',
          image: '/image-4.jpg',
          href: '/products?category=3',
          isActive: true,
          productCount: 52
        },
        {
          _id: '4',
          id: '4',
          name: 'Keychains',
          description: 'Cute keychains and accessories',
          image: '/image-3.jpg',
          href: '/products?category=4',
          isActive: true,
          productCount: 32
        }
      ];
      setCategories(defaultCategories);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Starting data load...');
      setLoading(true);
      try {
        console.log('📡 Starting product fetch...');
        await refreshProducts();
        console.log('📂 Starting category fetch...');
        await refreshCategories();
        console.log('✅ Data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    loadData();

    // Refresh data every 10 seconds to catch new products faster
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Refresh categories when products change to update counts
  useEffect(() => {
    if (products.length > 0) {
      refreshCategories();
    }
  }, [products]);

  return (
    <DataContext.Provider value={{ 
      products, 
      categories, 
      refreshProducts, 
      refreshCategories, 
      loading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    // Return default values instead of throwing an error
    return {
      products: [],
      categories: [],
      refreshProducts: () => {},
      refreshCategories: () => {},
      loading: false
    };
  }
  return context;
};
