'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  HeartIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSection from '@/components/ProductSection';
import CategorySection from '@/components/CategorySection';
import TrendingSection from '@/components/TrendingSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import SmartChatBot from '@/components/SmartChatBot';
import { Product } from '@/types';
import { useData } from '@/contexts/DataContext';

export default function HomePage() {
  const { products, loading } = useData();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [chatbotKeywords, setChatbotKeywords] = useState<any[]>([]);

  useEffect(() => {
    // Filter products for featured and bestsellers
    const activeProducts = products.filter(product => product.status === 'active');
    
    // Featured products (first 4 active products)
    setFeaturedProducts(activeProducts.slice(0, 4));
    
    // Bestsellers (products with highest rating, first 4)
    const sortedByRating = [...activeProducts].sort((a, b) => b.rating - a.rating);
    setBestsellers(sortedByRating.slice(0, 4));

    // Load chatbot keywords
    const loadKeywords = async () => {
      try {
        const response = await fetch('/api/chatbot/keywords');
        const data = await response.json();
        if (data.success) {
          setChatbotKeywords(data.data);
        }
      } catch (error) {
        console.error('Error loading chatbot keywords:', error);
      }
    };
    
    loadKeywords();
  }, [products]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative text-white overflow-hidden h-[70vh]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/Hijab%20Girl%20%2316.jpg"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10 h-full flex items-center">
            <div className="w-full text-center">
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-3 lg:space-y-4">
                  <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none whitespace-nowrap text-white drop-shadow-2xl">
                    Bloom Your Style
                  </h1>
                  <p className="text-lg sm:text-xl text-white leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
                    Shop our unique collection of bracelets, earrings, and more, all made to elevate your style.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                    Shop Now
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300">
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="section-title text-lg font-semibold text-gray-800">Free Shipping</h3>
                <p className="text-gray-600 whitespace-nowrap">Free delivery on orders over RS 1000</p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="section-title text-lg font-semibold text-gray-800">Secure Payment</h3>
                <p className="text-gray-600">100% secure payment processing</p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="section-title text-lg font-semibold text-gray-800">Easy Returns</h3>
                <p className="text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="section-title text-lg font-semibold text-gray-800">Customer Care</h3>
                <p className="text-gray-600">24/7 customer support</p>
              </div>
            </div>
          </div>
        </section>


        {/* Category Section */}
        <CategorySection />

        {/* Featured Products */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ProductSection
            title="Featured Products"
            subtitle="Handpicked items just for you"
            products={featuredProducts}
            viewAllHref="/products"
            className="bg-gray-50"
          />
        )}


        {/* Newsletter Signup */}
        <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#e4d9d2' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="section-title text-3xl font-bold text-gray-800 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Subscribe to our newsletter and get 10% off your first order!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
              />
              <button className="bg-gray-700 text-white hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Smart Chatbot */}
      <SmartChatBot 
        keywords={chatbotKeywords}
        onNewChat={(chatData) => {
          console.log('New chat started:', chatData);
          // Here you could redirect to a contact page or open a support form
        }}
      />
    </div>
  );
}
