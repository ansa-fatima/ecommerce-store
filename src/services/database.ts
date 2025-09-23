import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Category } from '@/data/categories';

// Products
export const dbProducts = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(product => ({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      images: product.images,
      category: product.category,
      brand: product.brand,
      inStock: product.in_stock,
      stock: product.stock,
      status: product.status,
      rating: product.rating,
      reviews: [], // You can add reviews table later
      tags: product.tags,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }));
  },

  async create(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images,
        category: product.category,
        brand: product.brand,
        in_stock: product.inStock,
        stock: product.stock,
        status: product.status,
        rating: product.rating,
        tags: product.tags,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      _id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      images: data.images,
      category: data.category,
      brand: data.brand,
      inStock: data.in_stock,
      stock: data.stock,
      status: data.status,
      rating: data.rating,
      reviews: [],
      tags: data.tags,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images,
        category: product.category,
        brand: product.brand,
        in_stock: product.inStock,
        stock: product.stock,
        status: product.status,
        rating: product.rating,
        tags: product.tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      _id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      images: data.images,
      category: data.category,
      brand: data.brand,
      inStock: data.in_stock,
      stock: data.stock,
      status: data.status,
      rating: data.rating,
      reviews: [],
      tags: data.tags,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Categories
export const dbCategories = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(category => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image,
      productCount: category.product_count || 0,
      href: category.href,
      isActive: category.is_active,
      createdAt: new Date(category.created_at),
      updatedAt: new Date(category.updated_at),
    }));
  },

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description,
        image: category.image,
        product_count: category.productCount,
        href: category.href,
        is_active: category.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      _id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      productCount: data.product_count,
      href: data.href,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        image: category.image,
        product_count: category.productCount,
        href: category.href,
        is_active: category.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      _id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      productCount: data.product_count,
      href: data.href,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};



