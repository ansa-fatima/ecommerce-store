'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
  _id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatbotKeyword {
  _id: string;
  keyword: string;
  response: string;
  category: string;
  isActive: boolean;
  priority: number;
}

interface SmartChatBotProps {
  keywords?: ChatbotKeyword[];
  onNewChat?: (chatData: any) => void;
}

export default function SmartChatBot({ keywords = [], onNewChat }: SmartChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        _id: 'welcome',
        sender: 'bot',
        message: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date().toISOString(),
        isRead: true
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const findBestResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase();
    
    // Check for order status queries first
    if (message.includes('order status') || message.includes('order') && message.includes('status') || 
        message.includes('track order') || message.includes('where is my order')) {
      return 'I can help you check your order status! Please provide your order number (e.g., "order #123" or "ORD-123") and I\'ll look it up for you.';
    }
    
    // Sort keywords by priority (lower number = higher priority)
    const sortedKeywords = keywords
      .filter(k => k.isActive)
      .sort((a, b) => a.priority - b.priority);

    // Check for exact keyword matches first
    for (const keyword of sortedKeywords) {
      if (message.includes(keyword.keyword.toLowerCase())) {
        return keyword.response;
      }
    }

    // Check for partial matches
    for (const keyword of sortedKeywords) {
      const keywordWords = keyword.keyword.toLowerCase().split(' ');
      const messageWords = message.split(' ');
      
      // Check if any keyword words are in the message
      const hasMatch = keywordWords.some(word => 
        messageWords.some(msgWord => msgWord.includes(word) || word.includes(msgWord))
      );
      
      if (hasMatch) {
        return keyword.response;
      }
    }

    // Default responses based on common patterns
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! How can I assist you today?';
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return 'Goodbye! Feel free to reach out if you need any help. Have a great day!';
    }
    
    if (message.includes('help')) {
      return 'I\'m here to help! You can ask me about order status, shipping, returns, payments, or any other questions about our products and services.';
    }

    // If no specific response found, provide a helpful default
    return 'I understand you\'re looking for help. While I don\'t have a specific response for that, I can assist you with order status, shipping information, returns, payments, or connect you with our support team. What would you like to know?';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      sender: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Check if this is an order status query
      const message = userMessage.message.toLowerCase();
      if (message.includes('order status') || message.includes('order') && message.includes('status') || 
          message.includes('track order') || message.includes('where is my order')) {
        
        // Call the API for order status
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.message,
            conversationId: 'default'
          }),
        });

        const data = await response.json();
        
        if (data.success && data.response) {
          const botMessage: ChatMessage = {
            _id: (Date.now() + 1).toString(),
            sender: 'bot',
            message: data.response,
            timestamp: new Date().toISOString(),
            isRead: true
          };

          setMessages(prev => [...prev, botMessage]);
        } else {
          // Fallback to local response
          const botResponse = findBestResponse(userMessage.message);
          if (botResponse) {
            const botMessage: ChatMessage = {
              _id: (Date.now() + 1).toString(),
              sender: 'bot',
              message: botResponse,
              timestamp: new Date().toISOString(),
              isRead: true
            };

            setMessages(prev => [...prev, botMessage]);
          }
        }
      } else {
        // Use local response for other queries
        const botResponse = findBestResponse(userMessage.message);
        
        if (botResponse) {
          const botMessage: ChatMessage = {
            _id: (Date.now() + 1).toString(),
            sender: 'bot',
            message: botResponse,
            timestamp: new Date().toISOString(),
            isRead: true
          };

          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Fallback to local response
      const botResponse = findBestResponse(userMessage.message);
      
      if (botResponse) {
        const botMessage: ChatMessage = {
          _id: (Date.now() + 1).toString(),
          sender: 'bot',
          message: botResponse,
          timestamp: new Date().toISOString(),
          isRead: true
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    if (onNewChat && messages.length > 1) {
      const chatData = {
        customerId: 'guest',
        customerName: 'Guest User',
        customerEmail: 'guest@example.com',
        subject: 'Chatbot Conversation',
        message: messages[messages.length - 1].message
      };
      onNewChat(chatData);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message._id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.message }}></p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </form>
            
            {/* New Chat Button */}
            {messages.length > 1 && (
              <button
                onClick={handleNewChat}
                className="mt-2 w-full text-xs text-indigo-600 hover:text-indigo-800 text-center"
              >
                Start new chat with support
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

