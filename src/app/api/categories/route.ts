import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Creating category:', body);
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const category = await CategoryService.createCategory(body);
    console.log('✅ Category created successfully:', category);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT /api/categories - Update category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    console.log('📝 Updating category:', id, updateData);
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const category = await CategoryService.updateCategory(id, updateData);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.log('✅ Category updated successfully:', category);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/categories - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }
    console.log('🗑️ Deleting category:', id);
    const deleted = await CategoryService.deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.log('✅ Category deleted successfully');
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}

