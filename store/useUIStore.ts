import { create } from 'zustand';
import { Product } from '@/data/products';

interface UIState {
  searchQuery: string;
  isSearchOpen: boolean;
  selectedCategory: string | null;
  quickViewProduct: Product | null;
  isCheckoutOpen: boolean;

  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
  setSelectedCategory: (category: string | null) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setCheckoutOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  isSearchOpen: false,
  selectedCategory: null,
  quickViewProduct: null,
  isCheckoutOpen: false,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
  setQuickViewProduct: (product: Product | null) => set({ quickViewProduct: product }),
  setCheckoutOpen: (open: boolean) => set({ isCheckoutOpen: open }),
}));

