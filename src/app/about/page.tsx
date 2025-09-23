'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    row1: false,
    row2: false,
    row3: false,
  });

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          if (target.dataset.row === '1') {
            setIsVisible(prev => ({ ...prev, row1: true }));
          } else if (target.dataset.row === '2') {
            setIsVisible(prev => ({ ...prev, row2: true }));
          } else if (target.dataset.row === '3') {
            setIsVisible(prev => ({ ...prev, row3: true }));
          }
        }
      });
    }, observerOptions);

    if (row1Ref.current) observer.observe(row1Ref.current);
    if (row2Ref.current) observer.observe(row2Ref.current);
    if (row3Ref.current) observer.observe(row3Ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/Hijab%20Girl%20%2316.jpg"
              alt="About Us Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
            <div className="text-center w-full">
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-3 lg:space-y-4">
                  <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none whitespace-nowrap text-white drop-shadow-2xl">
                    About Us
                  </h1>
                  <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
                    Discover our story and passion for creating beautiful jewelry that tells your unique story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are passionate about creating beautiful, unique jewelry that celebrates your individuality and helps you express your personal style.
              </p>
            </div>
            
            {/* Row 1 - Left Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
              <div className="order-2 lg:order-1 group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src="/image-2.png"
                    alt="Our Journey Begins"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out animate-float"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div 
                ref={row1Ref}
                data-row="1"
                className={`order-1 lg:order-2 transition-all duration-1000 delay-300 ${
                  isVisible.row1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Journey Begins</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                  Founded in 2020, our story began with a simple vision: to create jewelry that tells your unique story. 
                  What started as a small workshop has grown into a passionate community of artisans and jewelry lovers.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  We believe that every piece of jewelry should be more than just an accessory – it should be a reflection 
                  of your personality, your dreams, and your journey through life.
                </p>
              </div>
            </div>

            {/* Row 2 - Right Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
              <div 
                ref={row2Ref}
                data-row="2"
                className={`order-1 transition-all duration-1000 delay-300 ${
                  isVisible.row2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Crafting Excellence</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                  Our master craftsmen bring decades of experience to every piece we create. Using traditional techniques 
                  combined with modern innovation, we ensure each item meets our exacting standards of quality and beauty.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  From the initial design concept to the final polish, every step is carefully executed to create jewelry 
                  that will be treasured for generations to come.
                </p>
              </div>
              <div className="order-2 group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src="/image-3.jpg"
                    alt="Crafting Excellence"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out animate-pulse-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            {/* Row 3 - Left Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src="/image-4.jpg"
                    alt="Our Community"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div 
                ref={row3Ref}
                data-row="3"
                className={`order-1 lg:order-2 transition-all duration-1000 delay-300 ${
                  isVisible.row3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Building Our Community</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                  Today, we're proud to serve thousands of customers worldwide who share our passion for beautiful, 
                  meaningful jewelry. Our community continues to grow as we introduce new designs and collections.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  We're committed to sustainability, ethical sourcing, and giving back to the communities that inspire 
                  our designs. Every purchase helps us continue our mission of spreading beauty and joy.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
