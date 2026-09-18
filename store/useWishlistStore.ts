import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        const current = get().wishlistIds;
        if (current.includes(productId)) {
          set({ wishlistIds: current.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...current, productId] });
        }
      },
      isInWishlist: (productId: string) => get().wishlistIds.includes(productId),
    }),
    {
      name: 'lakshmi_wishlist'
    }
  )
);
