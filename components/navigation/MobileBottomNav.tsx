'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { Home, Search, ShoppingBag, Heart, LayoutGrid } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { items, toggleCart, getSubtotalGBP, formatPrice } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { setSearchOpen, setSelectedCategory } = useUIStore();

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotalGBP();

  const handleHomeClick = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    const el = document.getElementById('curated-shelves');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-brand-800 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-brand-800 transition-colors"
        >
          <Search className="w-5 h-5 text-brand-700" />
          <span className="text-[10px] font-bold mt-1 text-brand-800">Search</span>
        </button>

        {/* Departments */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-brand-800 transition-colors"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Aisles</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            const el = document.getElementById('curated-shelves');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center justify-center py-1 text-slate-600 hover:text-rose-600 transition-colors"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {wishlistIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Saved</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => toggleCart(true)}
          className="relative flex flex-col items-center justify-center py-1 text-brand-800 hover:text-brand-900 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-gold-500 text-brand-deep font-black text-[9px] px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-xs animate-bounce-short">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold mt-1 text-brand-deep">
            {totalItemCount > 0 ? formatPrice(subtotal) : 'Cart'}
          </span>
        </button>

      </div>
    </nav>
  );
};

