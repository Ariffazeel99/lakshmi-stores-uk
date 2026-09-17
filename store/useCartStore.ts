import { create } from 'zustand';
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

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Pre-populate with a couple of items for initial state
    {
      id: 'prod-001-500g',
      product: {
        id: 'prod-001',
        name: 'Fresh Air-Shipped Small Onions / Shallots (Chinna Vengayam)',
        tamilName: 'சின்ன வெங்காயம்',
        category: 'Fresh Vegetables & Greens',
        subCategory: 'Fresh Air Produce',
        brand: 'Lakshmi Fresh Sourced',
        description: 'Authentic high-flavor small onions imported via direct express air-freight from Tamil Nadu farms.',
        origin: 'Madurai, Tamil Nadu',
        rating: 4.9,
        reviewCount: 184,
        isAirFreightFresh: true,
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?q=80&w=800&auto=format&fit=crop',
        dietaryTags: ['Fresh Produce', 'Air Freight Fresh'],
        options: [
          { weight: '250g', priceGBP: 1.99, originalPriceGBP: 2.49, inStock: true },
          { weight: '500g', priceGBP: 3.49, originalPriceGBP: 4.29, inStock: true },
        ],
      },
      selectedOption: { weight: '500g', priceGBP: 3.49, originalPriceGBP: 4.29, inStock: true },
      quantity: 2,
    },
    {
      id: 'prod-003-5kg',
      product: {
        id: 'prod-003',
        name: 'Sona Masoori Raw Rice (5kg Pack)',
        tamilName: 'சோனா மசூரி அரிசி',
        category: 'Rice & Flours',
        subCategory: 'Rice',
        brand: 'Royal Harvest',
        description: 'Lightweight, aromatic medium-grain rice grown in Andhra Pradesh.',
        origin: 'Andhra Pradesh, India',
        rating: 4.9,
        reviewCount: 520,
        isBestseller: true,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
        dietaryTags: ['Gluten-Free', 'Low GI'],
        options: [
          { weight: '5kg', priceGBP: 9.99, originalPriceGBP: 12.49, inStock: true },
        ],
      },
      selectedOption: { weight: '5kg', priceGBP: 9.99, originalPriceGBP: 12.49, inStock: true },
      quantity: 1,
    }
  ],
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
}));

