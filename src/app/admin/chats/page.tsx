'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  CogIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
  _id: string;
  sender: 'user' | 'admin' | 'bot';
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

interface Chat {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatbotKeyword {
  _id: string;
  keyword: string;
  response: string;
  category: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [keywords, setKeywords] = useState<ChatbotKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<ChatbotKeyword | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin-login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`/api/admin/chats?conversationId=${conversationId}`);
      const data = await response.json();
      
      if (data.success) {
        const messages = data.data.map((msg: any) => ({
          _id: msg._id,
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
          isRead: msg.isRead,
          attachments: msg.attachments || []
        }));
        
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: messages
        } : null);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [chatsRes, keywordsRes] = await Promise.all([
        fetch('/api/admin/chats'),
        fetch('/api/chatbot/keywords')
      ]);
      
      const chatsData = await chatsRes.json();
      const keywordsData = await keywordsRes.json();
      
      // Convert conversations to chat format
      const conversations = chatsData.data || [];
      const formattedChats = conversations.map((conv: any) => ({
        _id: conv.conversationId,
        customerId: conv.conversationId,
        customerName: 'Customer',
        customerEmail: 'customer@example.com',
        status: 'open' as const,
        priority: 'medium' as const,
        subject: 'Chat Conversation',
        lastMessage: conv.lastMessage.message,
        lastMessageTime: conv.lastMessage.timestamp,
        unreadCount: conv.lastMessage.sender === 'user' ? 1 : 0,
        messages: [],
        tags: [],
        createdAt: conv.lastMessage.timestamp,
        updatedAt: conv.lastMessage.timestamp
      }));
      
      setChats(formattedChats);
      setKeywords(keywordsData.data || keywordsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Set mock data if API fails
      setChats([
        {
          _id: '1',
          customerId: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerAvatar: '/placeholder-avatar.jpg',
          status: 'open',
          priority: 'medium',
          subject: 'Order Status Inquiry',
          lastMessage: 'Hi, I would like to know the status of my order #12345',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 2,
          messages: [
            {
              _id: '1',
              sender: 'user',
              message: 'Hi, I would like to know the status of my order #12345',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              isRead: true
            },
            {
              _id: '2',
              sender: 'bot',
              message: 'Hello! I can help you check your order status. Let me look that up for you.',
              timestamp: new Date(Date.now() - 3500000).toISOString(),
              isRead: true
            },
            {
              _id: '3',
              sender: 'user',
              message: 'Thank you! The order number is ORD-12345',
              timestamp: new Date(Date.now() - 3000000).toISOString(),
              isRead: false
            }
          ],
          tags: ['order', 'status'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
      
      setKeywords([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeyword = async (keywordData: any) => {
    try {
      const response = await fetch('/api/chatbot/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keywordData)
      });
      
      if (response.ok) {
        const newKeyword = await response.json();
        setKeywords([...keywords, newKeyword.data]);
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      const response = await fetch(`/api/chatbot/keywords?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setKeywords(keywords.filter(k => k._id !== id));
      }
    } catch (error) {
      console.error('Error deleting keyword:', error);
    }
  };

  const updateChatStatus = async (chatId: string, status: Chat['status']) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: chatId,
          status
        })
      });

      if (response.ok) {
        setChats(chats.map(chat => 
          chat._id === chatId ? { ...chat, status } : chat
        ));
      }
    } catch (error) {
      console.error('Error updating chat status:', error);
    }
  };

  const updateChatPriority = async (chatId: string, priority: Chat['priority']) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: chatId,
          priority
        })
      });

      if (response.ok) {
        setChats(chats.map(chat => 
          chat._id === chatId ? { ...chat, priority } : chat
        ));
      }
    } catch (error) {
      console.error('Error updating chat priority:', error);
    }
  };

  const sendMessage = async (chatId: string, message: string) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          message,
          sender: 'admin'
        })
      });

      if (response.ok) {
        const newMessage = {
          _id: Date.now().toString(),
          sender: 'admin' as const,
          message,
          timestamp: new Date().toISOString(),
          isRead: true
        };

        setChats(chats.map(chat => 
          chat._id === chatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, newMessage],
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
                unreadCount: 0
              }
            : chat
        ));

        if (selectedChat?._id === chatId) {
          setSelectedChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: message,
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
          } : null);
        }

        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || chat.status === statusFilter;
    const matchesPriority = !priorityFilter || chat.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChats = filteredChats.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout title="Chat Management">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => setShowKeywordModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CogIcon className="h-5 w-5 mr-2" />
            Manage Keywords
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {chats.filter(chat => chat.unreadCount > 0).length} unread chats
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats, customers, or messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredChats.length)} of {filteredChats.length} chats
          </span>
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chats List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Chats ({filteredChats.length})
          </h3>
        </div>
        
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No chats found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || priorityFilter ? 'Try adjusting your filters.' : 'No customer chats available.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedChats.map((chat) => (
              <div key={chat._id} className={`p-6 hover:bg-gray-50 cursor-pointer ${chat.unreadCount > 0 ? 'bg-blue-50' : ''}`}
                   onClick={() => {
                     setSelectedChat(chat);
                     setShowChatModal(true);
                     loadMessages(chat._id);
                   }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {chat.customerAvatar ? (
                        <Image
                          src={chat.customerAvatar}
                          alt={chat.customerName}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {chat.customerName}
                        </h4>
                        {chat.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {chat.unreadCount} new
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.customerEmail}</p>
                      <p className="text-sm text-gray-900 truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                          {chat.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(chat.priority)}`}>
                          {chat.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(chat.lastMessageTime)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <select
                        value={chat.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateChatStatus(chat._id, e.target.value as Chat['status']);
                        }}
                        className="text-xs border-0 bg-transparent focus:ring-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        value={chat.priority}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateChatPriority(chat._id, e.target.value as Chat['priority']);
                        }}
                        className="text-xs border-0 bg-transparent focus:ring-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredChats.length)}</span> of{' '}
                  <span className="font-medium">{filteredChats.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedChat && (
        <ChatModal
          chat={selectedChat}
          onClose={() => setShowChatModal(false)}
          onSendMessage={sendMessage}
          keywords={keywords}
        />
      )}

      {/* Keyword Management Modal */}
      {showKeywordModal && (
        <KeywordModal
          keywords={keywords}
          onClose={() => setShowKeywordModal(false)}
          onSave={handleSaveKeyword}
          onDelete={handleDeleteKeyword}
        />
      )}
    </AdminLayout>
  );
}

// Chat Modal Component
interface ChatModalProps {
  chat: Chat;
  onClose: () => void;
  onSendMessage: (chatId: string, message: string) => void;
  keywords: ChatbotKeyword[];
}

function ChatModal({ chat, onClose, onSendMessage, keywords }: ChatModalProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showKeywords, setShowKeywords] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(chat._id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeywordClick = (keyword: ChatbotKeyword) => {
    setNewMessage(keyword.response);
    setShowKeywords(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{chat.customerName}</h3>
              <p className="text-sm text-gray-500">{chat.customerEmail}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeywords(!showKeywords)}
              className="flex items-center px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
            >
              <TagIcon className="h-4 w-4 mr-1" />
              Keywords
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
              {chat.messages.map((message) => (
                <div key={message._id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'admin' 
                      ? 'bg-indigo-500 text-white' 
                      : message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'admin' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Keywords Panel */}
          <div className="lg:col-span-1">
            {showKeywords && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Responses</h4>
                <div className="space-y-2">
                  {keywords.filter(k => k.isActive).map((keyword) => (
                    <button
                      key={keyword._id}
                      onClick={() => handleKeywordClick(keyword)}
                      className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">{keyword.keyword}</div>
                      <div className="text-xs text-gray-500 truncate">{keyword.response}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Keyword Management Modal
interface KeywordModalProps {
  keywords: ChatbotKeyword[];
  onClose: () => void;
  onSave: (keyword: any) => void;
  onDelete: (id: string) => void;
}

function KeywordModal({ keywords, onClose, onSave, onDelete }: KeywordModalProps) {
  const [editingKeyword, setEditingKeyword] = useState<ChatbotKeyword | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    response: '',
    category: '',
    isActive: true,
    priority: 1
  });

  const handleEdit = (keyword: ChatbotKeyword) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      response: keyword.response,
      category: keyword.category,
      isActive: keyword.isActive,
      priority: keyword.priority
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditingKeyword(null);
    setFormData({
      keyword: '',
      response: '',
      category: '',
      isActive: true,
      priority: 1
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Manage Chatbot Keywords</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keywords List */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Existing Keywords</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {keywords.map((keyword) => (
                <div key={keyword._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{keyword.keyword}</div>
                    <div className="text-sm text-gray-500">{keyword.response}</div>
                    <div className="text-xs text-gray-400">{keyword.category} • Priority: {keyword.priority}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(keyword)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(keyword._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add/Edit Form */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
            </h4>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={formData.keyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter keyword or phrase"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                <textarea
                  value={formData.response}
                  onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter bot response"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="orders">Orders</option>
                    <option value="shipping">Shipping</option>
                    <option value="returns">Returns</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={1}>1 - Highest</option>
                    <option value={2}>2 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Low</option>
                    <option value={5}>5 - Lowest</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingKeyword(null);
                    setFormData({
                      keyword: '',
                      response: '',
                      category: '',
                      isActive: true,
                      priority: 1
                    });
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  {editingKeyword ? 'Update' : 'Add'} Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

