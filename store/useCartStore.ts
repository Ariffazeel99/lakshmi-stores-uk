import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WeightOption } from '@/data/products';

export interface CartItem {
  id: string; // unique cart item id: `${productId}-${weight}`
  product: Product;
  selectedOption: WeightOption;
  quantity: number;
}

export type Currency = 'GBP' | 'EUR';

interface CartState {
  items: CartItem[];
  currency: Currency;
  exchangeRateEUR: number; // 1 GBP = 1.17 EUR
  isCartOpen: boolean;
  freeShippingThresholdGBP: number; // £50

  // Actions
  addItem: (product: Product, selectedOption: WeightOption, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: Currency) => void;
  toggleCart: (open?: boolean) => void;
  
  // Computed helpers
  getSubtotalGBP: () => number;
  formatPrice: (amountInGBP: number) => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'GBP',
      exchangeRateEUR: 1.17,
      isCartOpen: false,
      freeShippingThresholdGBP: 50.0,

      addItem: (product, selectedOption, quantity = 1) => {
        const cartItemId = `${product.id}-${selectedOption.weight}`;
        const items = get().items;
        const existingIndex = items.findIndex((item) => item.id === cartItemId);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isCartOpen: true });
        } else {
          set({
            items: [...items, { id: cartItemId, product, selectedOption, quantity }],
            isCartOpen: true,
          });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((item) => item.id !== cartItemId) });
      },

      updateQuantity: (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        const updated = get().items.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      setCurrency: (currency) => set({ currency }),

      toggleCart: (open) =>
        set((state) => ({ isCartOpen: open !== undefined ? open : !state.isCartOpen })),

      getSubtotalGBP: () => {
        return get().items.reduce((sum, item) => sum + item.selectedOption.priceGBP * item.quantity, 0);
      },

      formatPrice: (amountInGBP) => {
        const { currency, exchangeRateEUR } = get();
        if (currency === 'EUR') {
          const amountEUR = amountInGBP * exchangeRateEUR;
          return `€${amountEUR.toFixed(2)}`;
        }
        return `£${amountInGBP.toFixed(2)}`;
      },
    }),
    {
      name: 'lakshmi_shopping_cart',
      partialize: (state) => ({
        items: state.items,
        currency: state.currency
      })
    }
  )
);
