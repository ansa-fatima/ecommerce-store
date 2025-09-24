'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCartStore } from '@/store/cartStore';
import { Product, Review } from '@/types';
import { formatPrice, calculateDiscount } from '@/utils/format';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        // Convert MongoDB product to frontend format
        const mongoProduct = data.data;
        const product: Product = {
          _id: mongoProduct._id,
          name: mongoProduct.name,
          description: mongoProduct.description,
          price: mongoProduct.price,
          originalPrice: mongoProduct.originalPrice,
          images: mongoProduct.images || [],
          category: mongoProduct.category?.name || 'Uncategorized',
          brand: 'Store Brand',
          stock: mongoProduct.stock,
          isActive: mongoProduct.isActive,
          rating: 4.5, // Default rating
          reviews: [], // Default empty reviews
          tags: [],
          createdAt: mongoProduct.createdAt,
          updatedAt: mongoProduct.updatedAt
        };
        setProduct(product);
      } else {
        // Fallback to mock data if API fails
        const mockProduct: Product = {
          _id: productId,
          name: 'Wireless Bluetooth Headphones',
          description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best audio experience.',
          price: 99.99,
          originalPrice: 149.99,
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
            'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800'
          ],
          category: 'Electronics',
          brand: 'TechSound',
          stock: 15,
          isActive: true,
          rating: 4.5,
          reviews: [
            {
              _id: '1',
              userId: 'user1',
              userName: 'John Doe',
              rating: 5,
              comment: 'Excellent sound quality and very comfortable to wear for long periods.',
              createdAt: new Date('2024-01-15'),
            },
            {
              _id: '2',
              userId: 'user2',
              userName: 'Jane Smith',
              rating: 4,
              comment: 'Great headphones, battery life is amazing. Only minor issue is the noise cancellation could be better.',
              createdAt: new Date('2024-01-10'),
            },
            {
              _id: '3',
              userId: 'user3',
              userName: 'Mike Johnson',
              rating: 5,
              comment: 'Perfect for my daily commute. The sound is crisp and clear.',
              createdAt: new Date('2024-01-05'),
            },
          ],
          tags: ['wireless', 'bluetooth', 'headphones', 'noise-cancellation'],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        };
        setProduct(mockProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to mock data on network error
      const mockProduct: Product = {
        _id: productId,
        name: 'Wireless Bluetooth Headphones',
        description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best audio experience.',
        price: 99.99,
        originalPrice: 149.99,
        images: ['/images/headphone1.jpg', '/images/headphone2.jpg'],
        category: 'Electronics',
        brand: 'Store Brand',
        stock: 50,
        isActive: true,
        rating: 4.5,
        reviews: [
          { _id: 'r1', userId: 'u1', userName: 'Alice', rating: 5, comment: 'Excellent sound quality!', createdAt: new Date() },
          { _id: 'r2', userId: 'u2', userName: 'Bob', rating: 4, comment: 'Comfortable but a bit pricey.', createdAt: new Date() },
        ],
        tags: ['audio', 'wireless', 'headphones'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProduct(mockProduct);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      addItem(product, quantity, selectedSize, selectedColor);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Product not found</h1>
            <p className="text-secondary-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-secondary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative bg-white rounded-lg overflow-hidden border border-secondary-200">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-secondary-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">{product.name}</h1>
              <p className="text-lg text-secondary-600 mb-4">{product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-secondary-600">
                  {product.rating} ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-secondary-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-secondary-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-secondary-700">Quantity:</span>
                <div className="flex items-center border border-secondary-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-secondary-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addingToCart}
                  loading={addingToCart}
                  className="flex-1"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="px-4"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Free Shipping</p>
                  <p className="text-xs text-secondary-600 whitespace-nowrap">On orders over RS 1000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Secure Payment</p>
                  <p className="text-xs text-secondary-600">100% secure</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowPathIcon className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Easy Returns</p>
                  <p className="text-xs text-secondary-600">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-secondary-700 leading-relaxed">{product.description}</p>
              </div>
            )}


            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {(product.reviews || []).map((review) => (
                  <div key={review._id} className="border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-secondary-900">{review.userName}</h4>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-secondary-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-secondary-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-secondary-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
