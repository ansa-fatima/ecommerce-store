'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { PhotoIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    
    // Convert files to data URLs (in a real app, you'd upload to a server)
    const uploadPromises = imageFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises).then((dataUrls) => {
      onImagesChange([...images, ...dataUrls]);
      setUploading(false);
    });
  }, [images, onImagesChange, maxImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      if (images.length >= maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }
      onImagesChange([...images, url.trim()]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Images ({images.length}/{maxImages})
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Click to upload
            </button>
            {' '}or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-center">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add URL Button */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={handleAddImageUrl}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PhotoIcon className="h-4 w-4 mr-2" />
          Add Image URL
        </button>
      )}

      {/* Image Reorder Instructions */}
      {images.length > 1 && (
        <p className="text-xs text-gray-500">
          First image will be used as the main product image. Drag to reorder (coming soon).
        </p>
      )}
    </div>
  );
}

