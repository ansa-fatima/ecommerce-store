import { NextRequest, NextResponse } from 'next/server';

// Mock notifications data - in production, this would come from database
let notifications = [
  {
    _id: '1',
    title: 'New Order Received',
    message: 'Order #ORD-001 has been placed by John Doe',
    type: 'info',
    priority: 'medium',
    target: 'admins',
    isActive: true,
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Low Stock Alert',
    message: 'Product "Gold Bracelet" is running low on stock (5 items left)',
    type: 'warning',
    priority: 'high',
    target: 'admins',
    isActive: true,
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Payment Failed',
    message: 'Payment for order #ORD-002 failed. Please contact customer.',
    type: 'error',
    priority: 'urgent',
    target: 'admins',
    isActive: true,
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Welcome to Our Store!',
    message: 'Thank you for joining us. Enjoy 10% off your first order with code WELCOME10',
    type: 'success',
    priority: 'low',
    target: 'customers',
    isActive: true,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/notifications - Get all notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    let filteredNotifications = [...notifications];

    // Filter by type if provided
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(notification => notification.type === type);
    }

    // Filter by priority if provided
    if (priority && priority !== 'all') {
      filteredNotifications = filteredNotifications.filter(notification => notification.priority === priority);
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredNotifications,
      count: filteredNotifications.length 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, priority, target, isActive, scheduledAt } = body;

    if (!title || !message || !type || !priority || !target) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newNotification = {
      _id: Date.now().toString(),
      title,
      message,
      type,
      priority,
      target,
      isActive: isActive !== false,
      scheduledAt: scheduledAt || null,
      sentAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notifications.push(newNotification);
    return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
  }
}

// PUT /api/notifications - Update notification
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const notificationIndex = notifications.findIndex(notification => notification._id === id);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: notifications[notificationIndex] });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const notificationIndex = notifications.findIndex(notification => notification._id === id);
    if (notificationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    notifications.splice(notificationIndex, 1);
    return NextResponse.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete notification' }, { status: 500 });
  }
}
