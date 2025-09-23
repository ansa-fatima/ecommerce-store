export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string | { _id: string; name: string; slug: string; description: string; image: string; isActive: boolean; createdAt: string; updatedAt: string; __v: number };
  brand?: string;
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviews?: Review[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user';
  avatar?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user';
  avatar?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'unpaid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}
