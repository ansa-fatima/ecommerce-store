import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestOrder {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'unpaid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

interface GuestOrderStore {
  orders: GuestOrder[];
  addOrder: (order: Omit<GuestOrder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  getOrder: (id: string) => GuestOrder | undefined;
  updateOrderStatus: (id: string, status: GuestOrder['status']) => void;
  updatePaymentStatus: (id: string, paymentStatus: GuestOrder['paymentStatus']) => void;
  getAllOrders: () => GuestOrder[];
}

export const useGuestOrderStore = create<GuestOrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (orderData) => {
        const id = `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        
        const newOrder: GuestOrder = {
          ...orderData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          orders: [...state.orders, newOrder]
        }));
        
        return id;
      },
      
      getOrder: (id) => {
        return get().orders.find(order => order.id === id);
      },
      
      updateOrderStatus: (id, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === id 
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },
      
      updatePaymentStatus: (id, paymentStatus) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === id 
              ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },
      
      getAllOrders: () => {
        return get().orders;
      },
    }),
    {
      name: 'guest-orders-storage',
    }
  )
);





