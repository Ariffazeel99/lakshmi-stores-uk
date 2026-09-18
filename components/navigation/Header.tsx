'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Category } from '@/data/categories';
import { fetchCategories } from '@/lib/api/catalog';
import { Search, ShoppingBag, Heart, User, Sparkles, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  categories?: Category[];
}

export const Header: React.FC<HeaderProps> = ({ categories: initialCategories }) => {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories || []);
  const { items, toggleCart, getSubtotalGBP, formatPrice } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { setSearchOpen, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useUIStore();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  React.useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetchCategories().then(setCategories).catch(console.error);
    }
  }, [initialCategories]);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotalGBP();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-800 via-brand-700 to-emerald-600 flex items-center justify-center text-gold-400 font-serif font-black text-xl shadow-emerald-glow group-hover:scale-105 transition-transform">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-brand-deep">
                  LAKSHMI
                </span>
                <span className="bg-gold-500 text-brand-deep text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded shadow-sm">
                  STORES UK
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide uppercase flex items-center gap-1">
                <span>Authentic Indian Grocery</span>
                <span className="text-emerald-600 font-bold">•</span>
                <span className="text-emerald-700">Fresh Produce</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Search Bar with Category Select */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center relative">
          <div className="flex w-full rounded-xl border-2 border-brand-700/80 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-brand-500/40 focus-within:border-brand-600 transition-all bg-slate-50">
            
            {/* Category Dropdown Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const val = e.target.value || null;
                setSelectedCategory(val);
                document.getElementById('curated-shelves')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-200/60 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.itemCount})
                </option>
              ))}
            </select>

            {/* Input field trigger */}
            <div
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center px-3 text-slate-400 cursor-pointer bg-white"
            >
              <Search className="w-4 h-4 text-brand-700 mr-2" />
              <input
                type="text"
                readOnly
                value={searchQuery}
                placeholder="Search Sona Masoori, Chinna Vengayam, Toor Dal, MDH..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none cursor-pointer"
              />
              <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                ⌘K
              </span>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="bg-brand-800 hover:bg-brand-900 text-gold-400 px-5 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

          </div>
        </div>

        {/* Action Triggers: Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2.5 rounded-lg text-slate-600 hover:text-brand-800 hover:bg-slate-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account */}
          <button 
            onClick={() => openAuthModal()}
            className="flex items-center gap-2 text-slate-700 hover:text-brand-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              {isAuthenticated && user ? (
                <span className="text-brand-800 uppercase">{user.firstName.charAt(0)}</span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[11px] font-medium text-slate-400 leading-none">
                {isAuthenticated && user ? `Hi, ${user.firstName}` : 'Account'}
              </p>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {isAuthenticated ? 'My Account' : 'Sign In / Register'}
              </p>
            </div>
          </button>

          {/* Wishlist */}
          <button className="relative p-2.5 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 transition-colors">
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Animated Shopping Cart Trigger */}
          <button
            onClick={() => toggleCart(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-900 hover:to-brand-800 text-white px-3.5 py-2 rounded-xl shadow-emerald-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-brand-deep font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce-short shadow">
                  {totalItemCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] uppercase font-semibold text-emerald-200 leading-none">My Cart</p>
              <p className="text-xs font-black text-white leading-tight">
                {formatPrice(subtotal)}
              </p>
            </div>
          </button>

        </div>

      </div>

      {/* Mobile Prominent Search Bar & Category Quick Bar */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5 space-y-2 border-t border-slate-100 bg-white">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center w-full bg-slate-100/90 hover:bg-slate-200/60 rounded-xl px-3.5 py-2.5 border border-slate-200 text-slate-400 cursor-pointer shadow-2xs transition-colors"
        >
          <Search className="w-4 h-4 text-brand-700 mr-2 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-medium truncate flex-1 text-left">
            Search 2,433+ items (onions, rice, dal, MDH)...
          </span>
          <span className="text-[10px] font-bold bg-brand-800 text-gold-400 px-2 py-0.5 rounded shadow-2xs">
            Search
          </span>
        </div>

        {/* Horizontal Category Quick Scroll Bar for Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              !selectedCategory
                ? 'bg-brand-800 text-gold-400 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-800 text-gold-400 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

