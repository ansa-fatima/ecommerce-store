import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1, size, color) => {
        const items = get().items;
        const existingItem = items.find(
          item => item.product._id === product._id && 
          item.size === size && 
          item.color === color
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product._id === product._id && 
              item.size === size && 
              item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, {
              _id: `${product._id}-${size || 'default'}-${color || 'default'}`,
              product,
              quantity,
              size,
              color,
            }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item._id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
