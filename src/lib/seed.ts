import { getDatabase } from './mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';

export async function seedDatabase() {
  try {
    const db = await getDatabase();

    // Clear existing data
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Insert categories
    const categories = [
      {
        name: 'Hijabs',
        slug: 'hijabs',
        description: 'Beautiful and comfortable hijabs',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Abayas',
        slug: 'abayas',
        description: 'Elegant and modest abayas',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Casual',
        slug: 'casual',
        description: 'Comfortable everyday wear',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const categoryResult = await db.collection('categories').insertMany(categories);
    const categoryIds = Object.values(categoryResult.insertedIds);

    // Insert products
    const products = [
      {
        name: 'Elegant Hijab Collection',
        description: 'Beautiful and comfortable hijabs made from premium materials',
        price: 2500,
        originalPrice: 3000,
        image: '/Hijab Girl #16.jpg',
        images: ['/Hijab Girl #16.jpg', '/image-2.png'],
        category: 'Hijabs',
        stock: 50,
        isActive: true,
        isFeatured: true,
        tags: ['hijab', 'modest', 'elegant'],
        specifications: {
          material: 'Premium Cotton',
          size: 'One Size',
          color: 'Various'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Designer Abaya Set',
        description: 'Luxurious abaya with matching accessories',
        price: 8500,
        originalPrice: 10000,
        image: '/image-3.jpg',
        images: ['/image-3.jpg', '/image-4.jpg'],
        category: 'Abayas',
        stock: 25,
        isActive: true,
        isFeatured: true,
        tags: ['abaya', 'luxury', 'designer'],
        specifications: {
          material: 'Premium Fabric',
          size: 'S, M, L, XL',
          color: 'Black, Navy'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Casual Modest Wear',
        description: 'Comfortable everyday modest clothing',
        price: 1800,
        originalPrice: 2200,
        image: '/image-5.jpg',
        images: ['/image-5.jpg', '/image-6.jpg'],
        category: 'Casual',
        stock: 75,
        isActive: true,
        isFeatured: false,
        tags: ['casual', 'modest', 'everyday'],
        specifications: {
          material: 'Cotton Blend',
          size: 'XS, S, M, L, XL',
          color: 'Various'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Premium Silk Hijab',
        description: 'Luxurious silk hijab with elegant design',
        price: 3500,
        originalPrice: 4000,
        image: '/image-2.png',
        images: ['/image-2.png'],
        category: 'Hijabs',
        stock: 30,
        isActive: true,
        isFeatured: true,
        tags: ['hijab', 'silk', 'luxury'],
        specifications: {
          material: '100% Silk',
          size: 'One Size',
          color: 'Various'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Everyday Abaya',
        description: 'Simple and comfortable abaya for daily wear',
        price: 4500,
        originalPrice: 5500,
        image: '/image-4.jpg',
        images: ['/image-4.jpg'],
        category: 'Abayas',
        stock: 40,
        isActive: true,
        isFeatured: false,
        tags: ['abaya', 'everyday', 'comfortable'],
        specifications: {
          material: 'Cotton Blend',
          size: 'S, M, L, XL',
          color: 'Black, Navy, Gray'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('products').insertMany(products);

    // Insert test orders
    const testOrders = [
      {
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        items: [
          {
            productId: categoryIds[0], // First product
            name: 'Elegant Hijab Collection',
            price: 2500,
            quantity: 2,
            image: '/Hijab Girl #16.jpg'
          }
        ],
        shippingAddress: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        total: 5000,
        subtotal: 5000,
        shipping: 0,
        tax: 0,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891'
        },
        items: [
          {
            productId: categoryIds[1], // Second product
            name: 'Designer Abaya Set',
            price: 8500,
            quantity: 1,
            image: '/image-3.jpg'
          }
        ],
        shippingAddress: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        total: 8500,
        subtotal: 8500,
        shipping: 0,
        tax: 0,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date()
      },
      {
        customer: {
          name: 'Ahmed Hassan',
          email: 'ahmed@example.com',
          phone: '+1234567892'
        },
        items: [
          {
            productId: categoryIds[2], // Third product
            name: 'Casual Modest Wear',
            price: 1800,
            quantity: 3,
            image: '/image-5.jpg'
          }
        ],
        shippingAddress: {
          street: '789 Pine Road',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        total: 5400,
        subtotal: 5400,
        shipping: 0,
        tax: 0,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date()
      }
    ];

    await db.collection('orders').insertMany(testOrders);

    console.log('Database seeded successfully with test orders!');
    return { success: true, message: 'Database seeded successfully with test orders' };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
