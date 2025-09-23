import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
let keywords = [
  {
    _id: '1',
    keyword: 'order status',
    response: 'I can help you check your order status. Please provide your order number.',
    category: 'orders',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    keyword: 'shipping',
    response: 'Our standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.',
    category: 'shipping',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    keyword: 'return',
    response: 'We offer a 30-day return policy. Please contact our support team for return instructions.',
    category: 'returns',
    isActive: true,
    priority: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    keyword: 'refund',
    response: 'Refunds are processed within 5-7 business days after we receive your returned item.',
    category: 'returns',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    keyword: 'tracking',
    response: 'You can track your order using the tracking number provided in your confirmation email.',
    category: 'shipping',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    keyword: 'payment',
    response: 'We accept all major credit cards, PayPal, and bank transfers. All payments are secure and encrypted.',
    category: 'general',
    isActive: true,
    priority: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    keyword: 'size guide',
    response: 'Please check our size guide on the product page for accurate measurements and fit information.',
    category: 'general',
    isActive: true,
    priority: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '8',
    keyword: 'contact',
    response: 'You can reach our customer support team at support@example.com or call us at +1-800-123-4567.',
    category: 'general',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/chatbot/keywords - Get all keywords
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

// POST /api/chatbot/keywords - Create new keyword
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, response, category, isActive, priority } = body;

    if (!keyword || !response || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: keyword, response, category' },
        { status: 400 }
      );
    }

    const newKeyword = {
      _id: Date.now().toString(),
      keyword: keyword.toLowerCase().trim(),
      response,
      category,
      isActive: isActive !== false,
      priority: priority || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    keywords.push(newKeyword);
    return NextResponse.json({ success: true, data: newKeyword });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json({ success: false, error: 'Failed to create keyword' }, { status: 500 });
  }
}

// PUT /api/chatbot/keywords - Update keyword
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, keyword, response, category, isActive, priority } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Keyword ID required' }, { status: 400 });
    }

    const keywordIndex = keywords.findIndex(k => k._id === id);
    if (keywordIndex === -1) {
      return NextResponse.json({ success: false, error: 'Keyword not found' }, { status: 404 });
    }

    // Update keyword properties
    if (keyword) keywords[keywordIndex].keyword = keyword.toLowerCase().trim();
    if (response) keywords[keywordIndex].response = response;
    if (category) keywords[keywordIndex].category = category;
    if (typeof isActive === 'boolean') keywords[keywordIndex].isActive = isActive;
    if (priority) keywords[keywordIndex].priority = priority;
    
    keywords[keywordIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: keywords[keywordIndex] });
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json({ success: false, error: 'Failed to update keyword' }, { status: 500 });
  }
}

// DELETE /api/chatbot/keywords - Delete keyword
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Keyword ID required' }, { status: 400 });
    }

    const keywordIndex = keywords.findIndex(k => k._id === id);
    if (keywordIndex === -1) {
      return NextResponse.json({ success: false, error: 'Keyword not found' }, { status: 404 });
    }

    keywords.splice(keywordIndex, 1);
    return NextResponse.json({ success: true, message: 'Keyword deleted successfully' });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete keyword' }, { status: 500 });
  }
}