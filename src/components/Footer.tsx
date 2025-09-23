import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo size="md" className="text-black" />
            <p className="text-gray-700 text-sm leading-relaxed">
              Your one-stop destination for quality products at amazing prices. 
              We're committed to providing the best shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-700 hover:text-black transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-700 hover:text-black transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-700 hover:text-black transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500" />
              <span>by Ecommerce Store Team</span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>&copy; 2024 Ecommerce Store. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
