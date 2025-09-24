'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ImageUpload from './ImageUpload';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, '_id'>) => Promise<void>;
  product?: Product | null;
  categories: Category[];
}

export default function ProductModal({ isOpen, onClose, onSave, product, categories }: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, '_id'>>({
    name: '',
    description: '',
    price: undefined as any,
    originalPrice: undefined as any,
    images: [],
    category: '',
    stock: undefined as any,
    isFeatured: false,
    isActive: true,
    colors: [],
  });
  const [loading, setLoading] = useState(false);
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    if (product) {
      // Handle both string and object category types
      let categoryId = '';
      if (typeof product.category === 'string') {
        categoryId = product.category;
      } else if (typeof product.category === 'object' && product.category !== null) {
        categoryId = product.category._id;
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        images: product.images,
        category: categoryId,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        colors: product.colors || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        images: [],
        category: '',
        stock: 0,
        isFeatured: false,
        isActive: true,
        colors: [],
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), colorInput.trim()]
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter(color => color !== colorToRemove) || []
    }));
  };

  const handleColorKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddColor();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Debug: Log form data including colors
    console.log('ProductModal - Submitting form data:', formData);
    console.log('ProductModal - Colors:', formData.colors);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Edit Product' : 'Create New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (PKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (PKR)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ''}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Colors Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎨 Available Colors
            </label>
            <div className="space-y-3">
              {/* Color Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyPress={handleColorKeyPress}
                  placeholder="Enter color name or code (e.g., Red, #FF0000)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add Color
                </button>
              </div>
              
              {/* Color Tags */}
              {formData.colors && formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                        title={color}
                      />
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={10}
          />

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
