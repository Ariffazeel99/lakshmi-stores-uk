import { create } from 'zustand';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: ['prod-001', 'prod-005', 'prod-010'],
  toggleWishlist: (productId: string) => {
    const current = get().wishlistIds;
    if (current.includes(productId)) {
      set({ wishlistIds: current.filter((id) => id !== productId) });
    } else {
      set({ wishlistIds: [...current, productId] });
    }
  },
  isInWishlist: (productId: string) => get().wishlistIds.includes(productId),
}));

