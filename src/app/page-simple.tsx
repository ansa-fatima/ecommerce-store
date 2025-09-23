'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useData } from '@/contexts/DataContext';

export default function SimpleHomePage() {
  const { products, loading } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Our Store</h1>
        
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Products loaded: {products.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}





