import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/database';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  
  try {

    let products;

    // Get products based on filters
    if (search) {
      products = await ProductService.searchProducts(search);
    } else if (category && category !== 'all') {
      products = await ProductService.getProductsByCategory(category);
    } else {
      products = await ProductService.getAllProducts();
    }

    // Filter by featured if requested
    if (featured === 'true') {
      products = products.filter(product => product.isFeatured);
    }

    // Only return active products
    products = products.filter(product => product.isActive);

    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return mock data when database fails
    const mockProducts = [
      {
        _id: '1',
        name: 'Gold Bracelet',
        description: 'Beautiful gold bracelet with intricate design',
        price: 1500,
        originalPrice: 2000,
        images: ['/image-1.png'],
        category: 'bracelets',
        stock: 25,
        isFeatured: true,
        isActive: true,
        colors: ['Gold', '#FFD700', 'Rose Gold'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Silver Earrings',
        description: 'Elegant silver earrings perfect for any occasion',
        price: 800,
        images: ['/image-2.png'],
        category: 'earrings',
        stock: 15,
        isFeatured: false,
        isActive: true,
        colors: ['Silver', '#C0C0C0', 'White Gold'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Pearl Necklace',
        description: 'Classic pearl necklace for special events',
        price: 2500,
        images: ['/image-3.jpg'],
        category: 'necklaces',
        stock: 8,
        isFeatured: true,
        isActive: true,
        colors: ['White', '#F5F5DC', 'Cream'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '4',
        name: 'Diamond Ring',
        description: 'Stunning diamond ring with vintage design',
        price: 5000,
        originalPrice: 6000,
        images: ['/image-4.jpg'],
        category: 'rings',
        stock: 3,
        isFeatured: true,
        isActive: true,
        colors: ['White Gold', '#FFD700', 'Platinum'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Apply filters to mock data
    let filteredProducts = mockProducts;
    
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isFeatured);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredProducts,
      count: filteredProducts.length
    });
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category' },
        { status: 400 }
      );
    }

    const product = await ProductService.createProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT /api/products - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const product = await ProductService.updateProduct(id, updateData);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const deleted = await ProductService.deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}