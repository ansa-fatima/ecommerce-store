'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useData } from '@/contexts/DataContext';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const { items, getTotalItems } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isAdmin } = useAdminAuth();
  const { categories } = useData();

  // Function to determine if a tab is active
  const isActiveTab = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }
    // Here you would typically make an API call to change the password
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Welcome Bar */}


      {/* Main Header */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo and Brand - Desktop */}
            <div className="hidden lg:flex items-center">
              <Logo size="xxl" showText={false} />
            </div>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border-b-2 ${
                  isActiveTab('/') 
                    ? 'text-indigo-600 border-indigo-600' 
                    : 'text-gray-700 border-transparent hover:border-black'
                }`}
              >
                HOME
              </Link>
                  <div className="relative group">
                    <Link 
                      href="/products" 
                      className={`px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center border-b-2 ${
                        isActiveTab('/products') 
                          ? 'text-indigo-600 border-indigo-600' 
                          : 'text-gray-700 border-transparent hover:border-black'
                      }`}
                    >
                      SHOP
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </Link>
                    
                    {/* Dropdown menu */}
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        <Link
                          href="/products"
                          className="block px-4 py-2 text-sm text-gray-700"
                        >
                          All Products
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category._id}
                            href={category.href}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                     <Link
                       href="/about"
                       className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border-b-2 ${
                         isActiveTab('/about')
                           ? 'text-gray-900 border-gray-900'
                           : 'link-primary border-transparent'
                       }`}
                     >
                       ABOUT
                     </Link>
                     <Link 
                       href={isAdmin ? "/admin" : "/admin-login"}
                       className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border-b-2 ${
                         isActiveTab('/admin') || isActiveTab('/admin-login')
                           ? 'text-gray-900 border-gray-900' 
                           : 'link-primary border-transparent'
                       }`}
                     >
                       ADMIN
                     </Link>
            </nav>

            {/* Mobile Logo - Center */}
            <div className="lg:hidden flex items-center justify-center flex-1">
              <Logo size="lg" showText={false} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="text-gray-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold" style={{ backgroundColor: '#8a6b4a' }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowChangePassword(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    placeholder="Search products..."
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 pt-6 pb-8 space-y-1">
              <Link
                href="/"
                className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                  isActiveTab('/') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              
              <div className="space-y-1">
                <button
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                    isActiveTab('/products') 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDownIcon 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isShopDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isShopDropdownOpen && (
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/products"
                      className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                        isActiveTab('/products') 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={category.href}
                        className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                          isActiveTab(category.href) 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
                     <Link
                       href="/about"
                       className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                         isActiveTab('/about')
                           ? 'text-indigo-600 bg-indigo-50'
                           : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                       }`}
                       onClick={closeMobileMenu}
                     >
                       About
                     </Link>
                     <Link
                       href={isAdmin ? "/admin" : "/admin-login"}
                       className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                         isActiveTab('/admin') || isActiveTab('/admin-login')
                           ? 'text-purple-600 bg-purple-50' 
                           : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                       }`}
                       onClick={closeMobileMenu}
                     >
                       Admin
                     </Link>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
