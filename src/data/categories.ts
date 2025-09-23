export interface Category {
  _id: string;
  name: string;
  image: string;
  productCount: number;
  href: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Default categories
const defaultCategories: Category[] = [
  {
    _id: '1',
    name: 'Bracelets',
    image: '/image-6.jpg',
    productCount: 45,
    href: '/products?category=bracelets',
    description: 'Beautiful bracelets for every occasion',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Earrings',
    image: '/image-5.jpg',
    productCount: 68,
    href: '/products?category=earrings',
    description: 'Elegant earrings to complete your look',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Necklaces',
    image: '/image-4.jpg',
    productCount: 52,
    href: '/products?category=necklaces',
    description: 'Stunning necklaces for special moments',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Keychains',
    image: '/image-3.jpg',
    productCount: 32,
    href: '/products?category=keychains',
    description: 'Cute keychains and accessories',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Load categories from localStorage or use defaults
const loadCategories = (): Category[] => {
  if (typeof window === 'undefined') {
    // Server-side: return defaults
    return defaultCategories;
  }
  
  try {
    const stored = localStorage.getItem('ecommerce-categories');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading categories from localStorage:', error);
  }
  
  return defaultCategories;
};

// Save categories to localStorage
const saveCategories = (categories: Category[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('ecommerce-categories', JSON.stringify(categories));
    console.log('💾 Categories saved to localStorage');
  } catch (error) {
    console.error('Error saving categories to localStorage:', error);
  }
};

export let categories: Category[] = loadCategories();

export const getCategories = () => categories;

export const getCategoryById = (id: string) => {
  return categories.find(category => category._id === id);
};

export const addCategory = (category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) => {
  const newCategory: Category = {
    ...category,
    _id: (categories.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  categories = [newCategory, ...categories];
  saveCategories(categories); // Save to localStorage
  console.log('✅ Category added to data store:', newCategory);
  console.log('📊 Total categories in store:', categories.length);
  console.log('🔍 All categories:', categories.map(c => ({ _id: c._id, name: c.name, isActive: c.isActive })));
  return newCategory;
};

export const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
  const index = categories.findIndex(category => category._id === id);
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      ...updatedCategory,
      updatedAt: new Date(),
    };
    saveCategories(categories); // Save to localStorage
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id: string) => {
  const index = categories.findIndex(category => category._id === id);
  if (index !== -1) {
    const deletedCategory = categories[index];
    categories = categories.filter(category => category._id !== id);
    saveCategories(categories); // Save to localStorage
    return deletedCategory;
  }
  return null;
};

export const getActiveCategories = () => {
  return categories.filter(category => category.isActive);
};
