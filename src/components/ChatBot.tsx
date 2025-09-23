'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export default function ChatBot({ className }: ChatBotProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you with any questions about our products or services. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationId: 'default' // You can implement conversation tracking later
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, there was an error processing your message. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-ivory-50 rounded-lg shadow-2xl border border-ivory-200 flex flex-col">
          {/* Header */}
          <div className="bg-ivory-600 text-ivory-900 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span className="font-semibold">Bloomy</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ivory-700 hover:text-ivory-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-ivory-600 text-ivory-900'
                      : 'bg-ivory-100 text-ivory-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 bg-ivory-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ChatBubbleLeftIcon className="h-3 w-3 text-ivory-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text }}></p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-ivory-700' : 'text-ivory-600'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 bg-ivory-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserIcon className="h-3 w-3 text-ivory-700" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-ivory-100 text-ivory-800 max-w-xs px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-ivory-200 rounded-full flex items-center justify-center">
                      <ChatBubbleLeftIcon className="h-3 w-3 text-ivory-700" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-ivory-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-ivory-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-ivory-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-ivory-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-ivory-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivory-500 focus:border-transparent text-sm bg-ivory-50"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-ivory-600 text-ivory-900 p-2 rounded-lg hover:bg-ivory-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-ivory-600 text-ivory-900 p-4 rounded-full shadow-lg hover:bg-ivory-700 transition-all duration-200 hover:scale-105"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
