import { create } from 'zustand';
import { OrderDocument } from '@/types/mongodb';

export type AdminViewTab = 'orders' | 'inventory' | 'intake';
export type OrderSegment = 'all' | 'unfulfilled' | 'chilled_prep' | 'packing' | 'dispatched';

interface AdminState {
  activeTab: AdminViewTab;
  orderSegment: OrderSegment;
  searchQuery: string;
  inspectedOrder: OrderDocument | null;
  isDrawerOpen: boolean;

  setActiveTab: (tab: AdminViewTab) => void;
  setOrderSegment: (segment: OrderSegment) => void;
  setSearchQuery: (query: string) => void;
  openOrderDrawer: (order: OrderDocument) => void;
  closeOrderDrawer: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  activeTab: 'orders',
  orderSegment: 'all',
  searchQuery: '',
  inspectedOrder: null,
  isDrawerOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setOrderSegment: (segment) => set({ orderSegment: segment }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openOrderDrawer: (order) => set({ inspectedOrder: order, isDrawerOpen: true }),
  closeOrderDrawer: () => set({ isDrawerOpen: false, inspectedOrder: null })
}));
