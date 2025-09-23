export interface ChatbotKeyword {
  _id: string;
  keyword: string;
  variations: string[];
  response: string;
  category: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Default chatbot keywords and responses
const defaultKeywords: ChatbotKeyword[] = [
  {
    _id: '1',
    keyword: 'price',
    variations: ['cost', 'expensive', 'cheap', 'discount', 'pricing', 'how much', 'price range'],
    response: 'Our prices vary depending on the product. You can see detailed pricing on each product page. We also offer free shipping on orders over RS 1000!',
    category: 'pricing',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    keyword: 'shipping',
    variations: ['delivery', 'free shipping', 'shipping cost', 'how long', 'delivery time'],
    response: 'We offer free shipping on orders over RS 1000! For orders under this amount, shipping costs are calculated at checkout. Standard delivery takes 3-5 business days.',
    category: 'shipping',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    keyword: 'return',
    variations: ['refund', 'exchange', 'return policy', 'can i return', 'return item'],
    response: 'We offer a 30-day return policy for all items. Items must be in original condition with tags attached. Please contact us for return instructions.',
    category: 'returns',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    keyword: 'product',
    variations: ['jewelry', 'ring', 'necklace', 'earring', 'bracelet', 'what do you have', 'collection'],
    response: 'We have a beautiful collection of jewelry including rings, necklaces, earrings, and bracelets. You can browse our products in the Products section.',
    category: 'products',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    keyword: 'contact',
    variations: ['email', 'phone', 'support', 'help', 'contact us', 'reach us'],
    response: 'You can reach us through this chat, or you can email us at support@bloomyourstyle.com. We\'re here to help!',
    category: 'contact',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    keyword: 'size',
    variations: ['sizing', 'size guide', 'what size', 'measurement', 'fit'],
    response: 'We provide detailed size guides for all our jewelry. You can find size information on each product page or contact us for personalized sizing assistance.',
    category: 'sizing',
    priority: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '7',
    keyword: 'material',
    variations: ['gold', 'silver', 'diamond', 'pearl', 'what is it made of', 'material'],
    response: 'Our jewelry is made from high-quality materials including gold, silver, diamonds, and pearls. Each product page lists the specific materials used.',
    category: 'materials',
    priority: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '8',
    keyword: 'order',
    variations: ['place order', 'buy', 'purchase', 'checkout', 'how to order'],
    response: 'To place an order, simply add items to your cart and proceed to checkout. You can pay securely with your preferred payment method.',
    category: 'ordering',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '9',
    keyword: 'order status',
    variations: ['order tracking', 'track order', 'where is my order', 'order update', 'check order', 'order progress'],
    response: 'I can help you check your order status! Please provide your order number (e.g., "order #123" or "ORD-123") and I\'ll look it up for you.',
    category: 'order_status',
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Load keywords from localStorage or use defaults
const loadKeywords = (): ChatbotKeyword[] => {
  if (typeof window === 'undefined') {
    return defaultKeywords;
  }
  
  try {
    const stored = localStorage.getItem('ecommerce-chatbot-keywords');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((keyword: any) => ({
        ...keyword,
        createdAt: new Date(keyword.createdAt),
        updatedAt: new Date(keyword.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading keywords from localStorage:', error);
  }
  
  return defaultKeywords;
};

// Save keywords to localStorage
const saveKeywords = (keywords: ChatbotKeyword[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('ecommerce-chatbot-keywords', JSON.stringify(keywords));
    console.log('💾 Chatbot keywords saved to localStorage');
  } catch (error) {
    console.error('Error saving keywords to localStorage:', error);
  }
};

export let keywords: ChatbotKeyword[] = loadKeywords();

export const getKeywords = () => keywords;

export const getKeywordById = (id: string) => {
  return keywords.find(keyword => keyword._id === id);
};

export const addKeyword = (keyword: Omit<ChatbotKeyword, '_id' | 'createdAt' | 'updatedAt'>) => {
  const newKeyword: ChatbotKeyword = {
    ...keyword,
    _id: (keywords.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  keywords = [newKeyword, ...keywords];
  saveKeywords(keywords);
  console.log('✅ Keyword added:', newKeyword);
  return newKeyword;
};

export const updateKeyword = (id: string, updatedKeyword: Partial<ChatbotKeyword>) => {
  const index = keywords.findIndex(keyword => keyword._id === id);
  if (index !== -1) {
    keywords[index] = {
      ...keywords[index],
      ...updatedKeyword,
      updatedAt: new Date(),
    };
    saveKeywords(keywords);
    return keywords[index];
  }
  return null;
};

export const deleteKeyword = (id: string) => {
  const index = keywords.findIndex(keyword => keyword._id === id);
  if (index !== -1) {
    const deletedKeyword = keywords[index];
    keywords = keywords.filter(keyword => keyword._id !== id);
    saveKeywords(keywords);
    return deletedKeyword;
  }
  return null;
};

export const getActiveKeywords = () => {
  return keywords.filter(keyword => keyword.isActive);
};

export const findMatchingKeyword = (message: string): ChatbotKeyword | null => {
  const lowerMessage = message.toLowerCase();
  
  // Sort by priority (higher priority first)
  const sortedKeywords = getActiveKeywords().sort((a, b) => b.priority - a.priority);
  
  for (const keyword of sortedKeywords) {
    // Check main keyword
    if (lowerMessage.includes(keyword.keyword.toLowerCase())) {
      return keyword;
    }
    
    // Check variations
    for (const variation of keyword.variations) {
      if (lowerMessage.includes(variation.toLowerCase())) {
        return keyword;
      }
    }
  }
  
  return null;
};
