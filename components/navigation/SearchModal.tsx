'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { ALL_PRODUCTS, Product } from '@/data/products';
import { Search, X, ShoppingBag, ArrowRight, Sparkles, Star } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, setQuickViewProduct } = useUIStore();
  const { addItem, formatPrice } = useCartStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? ALL_PRODUCTS.slice(0, 6) // trending / featured products
    : ALL_PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.includes(query)) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
        );
      }).slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <Search className="w-5 h-5 text-brand-700 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search small onions, toor dal, sona masoori rice, MDH..."
            className="w-full bg-transparent text-base text-slate-800 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-white border border-slate-200 shadow-sm"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Shortcuts */}
        <div className="px-5 py-2.5 bg-brand-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-brand-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-500" /> Popular:
          </span>
          {['Air Freight Veggies', 'Toor Dal', 'Sona Masoori Rice', 'Pooja Diyas', 'MDH Deggi Mirch'].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-brand-800 hover:text-white text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors whitespace-nowrap shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold uppercase tracking-wider">
            <span>{query ? `Search Results (${filteredProducts.length})` : 'Trending & Air Freight Fresh Items'}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-sm">No matching items found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Rice", "Atta", "Chinna Vengayam", or "Sambhar"</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                  onClick={() => {
                    setQuickViewProduct(prod);
                    setSearchOpen(false);
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-brand-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {prod.brand}
                      </span>
                      {prod.isAirFreightFresh && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          ✈ Air Freight
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-800 transition-colors mt-0.5">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Origin: {prod.origin}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" /> {prod.rating}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-brand-deep">
                      {formatPrice(prod.options[0].priceGBP)}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {prod.options[0].weight}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addItem(prod, prod.options[0]);
                      setSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-brand-800 text-gold-400 hover:bg-brand-900 transition-colors shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

