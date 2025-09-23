import { NextRequest, NextResponse } from 'next/server';
import { ChatMessageService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await ChatMessageService.getMessagesByConversation(conversationId);
      return NextResponse.json({
        success: true,
        data: messages,
        count: messages.length
      });
    } else {
      // Get all conversations
      const conversations = await ChatMessageService.getConversations();
      return NextResponse.json({
        success: true,
        data: conversations,
        count: conversations.length
      });
    }

  } catch (error) {
    console.error('Admin chats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Mark messages as read
    await ChatMessageService.markAsRead(conversationId);

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Admin chats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const deleted = await ChatMessageService.deleteMessage(messageId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Admin chats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
