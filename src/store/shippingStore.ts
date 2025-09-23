import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingSettings {
  enabled: boolean;
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  overnightShippingRate: number;
  freeShippingMessage: string;
  standardShippingMessage: string;
  expressShippingMessage: string;
  overnightShippingMessage: string;
}

interface ShippingStore {
  settings: ShippingSettings;
  updateSettings: (newSettings: Partial<ShippingSettings>) => void;
  getShippingCost: (subtotal: number, shippingType?: 'standard' | 'express' | 'overnight') => number;
  isFreeShipping: (subtotal: number) => boolean;
  getShippingMessage: (subtotal: number, shippingType?: 'standard' | 'express' | 'overnight') => string;
}

const defaultSettings: ShippingSettings = {
  enabled: true,
  freeShippingThreshold: 1000,
  standardShippingRate: 9.99,
  expressShippingRate: 19.99,
  overnightShippingRate: 39.99,
  freeShippingMessage: 'Free shipping on orders over $1000',
  standardShippingMessage: 'Standard shipping (5-7 business days)',
  expressShippingMessage: 'Express shipping (2-3 business days)',
  overnightShippingMessage: 'Overnight shipping (1 business day)',
};

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      getShippingCost: (subtotal, shippingType = 'standard') => {
        const { settings } = get();
        
        if (!settings.enabled) {
          return 0;
        }
        
        if (subtotal >= settings.freeShippingThreshold) {
          return 0;
        }
        
        switch (shippingType) {
          case 'express':
            return settings.expressShippingRate;
          case 'overnight':
            return settings.overnightShippingRate;
          default:
            return settings.standardShippingRate;
        }
      },
      
      isFreeShipping: (subtotal) => {
        const { settings } = get();
        return !settings.enabled || subtotal >= settings.freeShippingThreshold;
      },
      
      getShippingMessage: (subtotal, shippingType = 'standard') => {
        const { settings } = get();
        
        if (!settings.enabled) {
          return 'No shipping charges';
        }
        
        if (subtotal >= settings.freeShippingThreshold) {
          return settings.freeShippingMessage;
        }
        
        switch (shippingType) {
          case 'express':
            return settings.expressShippingMessage;
          case 'overnight':
            return settings.overnightShippingMessage;
          default:
            return settings.standardShippingMessage;
        }
      },
    }),
    {
      name: 'shipping-settings-storage',
    }
  )
);





