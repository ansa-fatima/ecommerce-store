import { NextRequest, NextResponse } from 'next/server';
import { ChatMessageService, OrderService } from '@/lib/database';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  conversationId: string;
}

// Simple in-memory storage for demo purposes
// In production, you'd want to use a database
const conversations = new Map<string, ChatMessage[]>();

// Predefined responses for common queries
const responses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Welcome! I'm here to help with any questions you might have."
  ],
  products: [
    "We have a beautiful collection of jewelry including rings, necklaces, earrings, and bracelets. You can browse our products in the Products section.",
    "Our jewelry collection features elegant designs perfect for any occasion. Would you like to know about a specific type of jewelry?",
    "We offer a wide range of jewelry items. Is there something specific you're looking for?"
  ],
  pricing: [
    "Our prices vary depending on the product. You can see detailed pricing on each product page. We also offer free shipping on orders over RS 1000!",
    "Prices are displayed on each product page. We have competitive pricing and often run special promotions.",
    "All our products have transparent pricing shown on their individual pages. We also have seasonal sales and discounts."
  ],
  shipping: [
    "We offer free shipping on orders over RS 1000! For orders under this amount, shipping costs are calculated at checkout.",
    "Free delivery on orders over RS 1000. For smaller orders, shipping fees apply and will be shown at checkout.",
    "We provide free shipping for orders above RS 1000. Standard shipping rates apply for smaller orders."
  ],
  returns: [
    "We offer a 30-day return policy for all items. Items must be in original condition with tags attached.",
    "You can return any item within 30 days of purchase. Please keep the original packaging and tags.",
    "Our return policy allows 30 days for returns. Items should be unworn and in original packaging."
  ],
  contact: [
    "You can reach us through this chat, or you can email us at support@bloomyourstyle.com",
    "For immediate assistance, you can use this chat. For other inquiries, email us at support@bloomyourstyle.com",
    "I'm here to help! You can also contact us via email at support@bloomyourstyle.com"
  ],
  default: [
    "I understand you're asking about that. Let me help you find the right information. Could you be more specific?",
    "That's a great question! I'd be happy to help you with that. Can you provide more details?",
    "I'm here to assist you! Could you tell me more about what you're looking for?",
    "I want to make sure I give you the best help possible. Could you rephrase your question?"
  ]
};

// Function to extract order ID from message
function extractOrderId(message: string): string | null {
  const orderIdPatterns = [
    /order\s*#?\s*([a-f0-9]{24})/i, // MongoDB ObjectId pattern
    /order\s*#?\s*([a-zA-Z0-9-_]{6,})/i, // Order number with prefix
    /ord-([a-zA-Z0-9-_]{6,})/i, // ORD- prefix
    /order\s*id\s*:?\s*([a-zA-Z0-9-_]{6,})/i, // Order ID with colon
    /tracking\s*#?\s*([a-zA-Z0-9-_]{6,})/i, // Tracking number
    /([a-f0-9]{24})/i, // Just MongoDB ObjectId
    /([a-zA-Z0-9-_]{8,})/i // Any alphanumeric string with 8+ characters
  ];
  
  // Skip common words that shouldn't be treated as order IDs
  const skipWords = ['status', 'check', 'track', 'find', 'look', 'help', 'what', 'how', 'where', 'when', 'why'];
  
  for (const pattern of orderIdPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const extractedId = match[1].toLowerCase();
      
      // Skip if it's a common word
      if (skipWords.includes(extractedId)) {
        continue;
      }
      
      // Skip if it's just "order" or "status" or similar
      if (extractedId === 'order' || extractedId === 'status' || extractedId.length < 6) {
        continue;
      }
      
      console.log(`Extracted order ID: ${match[1]} from message: ${message}`);
      return match[1];
    }
  }
  
  console.log(`No order ID found in message: ${message}`);
  return null;
}

// Function to check order status
async function checkOrderStatus(orderId: string): Promise<string> {
  try {
    const order = await OrderService.getOrderById(orderId);
    
    if (!order) {
      return `I couldn't find an order with ID "${orderId}". Please check your order number and try again.`;
    }
    
    const status = order.status;
    const paymentStatus = order.paymentStatus;
    const total = order.total;
    const createdAt = new Date(order.createdAt).toLocaleDateString();
    
    let statusMessage = `Order #${orderId} Status:<br><br>`;
    statusMessage += `Status: ${status}<br>`;
    statusMessage += `Payment: ${paymentStatus}<br>`;
    statusMessage += `Total: PKR ${total}<br>`;
    statusMessage += `Order Date: ${createdAt}<br><br>`;
    
    // Add specific status information
    switch (status) {
      case 'pending':
        statusMessage += `Your order is being processed. We'll update you once it's confirmed.`;
        break;
      case 'confirmed':
        statusMessage += `Your order has been confirmed and is being prepared for shipment.`;
        break;
      case 'shipped':
        statusMessage += `Your order has been shipped! You should receive it soon.`;
        break;
      case 'delivered':
        statusMessage += `Your order has been delivered! Thank you for your purchase.`;
        break;
      case 'cancelled':
        statusMessage += `This order has been cancelled.`;
        break;
      default:
        statusMessage += `Current status: ${status}`;
    }
    
    return statusMessage;
  } catch (error) {
    console.error('Error checking order status:', error);
    return `Sorry, I encountered an error while checking your order status. Please try again later.`;
  }
}

// Function to get keywords from database
async function getKeywordsFromDB(): Promise<any[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chatbot/keywords`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return [];
  }
}

async function getResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Check for order status queries first - try to extract order ID first
  const orderId = extractOrderId(message);
  if (orderId) {
    return await checkOrderStatus(orderId);
  }
  
  // If no order ID found, check for order status related phrases
  if (lowerMessage.includes('order status') || lowerMessage.includes('order') && lowerMessage.includes('status') || 
      lowerMessage.includes('track order') || lowerMessage.includes('where is my order') ||
      lowerMessage.includes('check order') || lowerMessage.includes('order update') ||
      lowerMessage.includes('my order') || lowerMessage.includes('order number')) {
    
    return "I can help you check your order status! Please provide your order number (e.g., 'order #123' or 'ORD-123') and I'll look it up for you.";
  }
  
  // Try to get response from database keywords
  try {
    const keywords = await getKeywordsFromDB();
    const sortedKeywords = keywords
      .filter(k => k.isActive)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    for (const keyword of sortedKeywords) {
      if (lowerMessage.includes(keyword.keyword.toLowerCase())) {
        return keyword.response;
      }
    }
  } catch (error) {
    console.error('Error checking keywords:', error);
  }
  
  // Fallback to original pattern matching for greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  // Product-related queries
  if (lowerMessage.includes('product') || lowerMessage.includes('jewelry') || lowerMessage.includes('ring') || 
      lowerMessage.includes('necklace') || lowerMessage.includes('earring') || lowerMessage.includes('bracelet')) {
    return responses.products[Math.floor(Math.random() * responses.products.length)];
  }
  
  // Pricing queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || 
      lowerMessage.includes('cheap') || lowerMessage.includes('discount')) {
    return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
  }
  
  // Shipping queries
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('free shipping')) {
    return responses.shipping[Math.floor(Math.random() * responses.shipping.length)];
  }
  
  // Returns queries
  if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
    return responses.returns[Math.floor(Math.random() * responses.returns.length)];
  }
  
  // Contact queries
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || 
      lowerMessage.includes('support')) {
    return responses.contact[Math.floor(Math.random() * responses.contact.length)];
  }
  
  // Default response if no keyword matches
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId = 'default' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate bot response
    const botResponse = await getResponse(message);
    
    // Save user message to database
    const userMessage = await ChatMessageService.createMessage({
      conversationId,
          sender: 'user',
      message: message,
      timestamp: new Date(),
          isRead: false
    });

    // Save bot response to database
    const botMessage = await ChatMessageService.createMessage({
      conversationId,
      sender: 'bot',
      message: botResponse,
      timestamp: new Date(),
      isRead: true
    });

    // Also store in memory for immediate response
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    
    const conversation = conversations.get(conversationId)!;
    conversation.push({
      id: userMessage._id.toString(),
      text: userMessage.message,
      sender: userMessage.sender,
      timestamp: userMessage.timestamp,
      conversationId: userMessage.conversationId
    });
    conversation.push({
      id: botMessage._id.toString(),
      text: botMessage.message,
      sender: botMessage.sender,
      timestamp: botMessage.timestamp,
      conversationId: botMessage.conversationId
    });

    // Keep only last 50 messages per conversation
    if (conversation.length > 50) {
      conversation.splice(0, conversation.length - 50);
    }

    return NextResponse.json({
      response: botResponse,
      conversationId,
      messageId: botMessage.id
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId') || 'default';

    // Fetch messages from database
    const dbMessages = await ChatMessageService.getMessagesByConversation(conversationId);
    
    // Convert to the expected format
    const conversation = dbMessages.map(msg => ({
      id: msg._id.toString(),
      text: msg.message,
      sender: msg.sender,
      timestamp: msg.timestamp,
      conversationId: msg.conversationId
    }));
    
    return NextResponse.json({
      conversation,
      conversationId
    });

  } catch (error) {
    console.error('Chatbot GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
