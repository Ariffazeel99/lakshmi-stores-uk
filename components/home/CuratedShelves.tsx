'use client';

import React, { useState } from 'react';
import { PRODUCTS, ALL_PRODUCTS, Product } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, Plane, Flame, Tag, Percent, ShoppingBasket, ChevronDown } from 'lucide-react';

import { useUIStore } from '@/store/useUIStore';

export const CuratedShelves: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useUIStore();
  const [activeTab, setActiveTab] = useState<'all' | 'live-catalog' | 'air-freight' | 'weekly-offers' | 'bestsellers' | 'festive'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  let filteredProducts: Product[] = PRODUCTS;
  if (selectedCategory) {
    filteredProducts = ALL_PRODUCTS.filter((p) =>
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(selectedCategory.toLowerCase()))
    );
  } else if (activeTab === 'live-catalog') {
    filteredProducts = ALL_PRODUCTS;
  } else if (activeTab === 'air-freight') {
    filteredProducts = ALL_PRODUCTS.filter((p) => p.isAirFreightFresh);
  } else if (activeTab === 'weekly-offers') {
    filteredProducts = ALL_PRODUCTS.filter((p) => p.isWeeklyOffer || p.options.some(o => o.originalPriceGBP));
  } else if (activeTab === 'bestsellers') {
    filteredProducts = ALL_PRODUCTS.filter((p) => p.isBestseller);
  } else if (activeTab === 'festive') {
    filteredProducts = ALL_PRODUCTS.filter((p) => p.isFestiveSpecial);
  }

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="curated-shelves" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Curated Indian Grocery Shelves
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-brand-deep">
            Weekly Specials & Fresh Arrivals
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: '⭐ Curated Specials', icon: Sparkles },
            { id: 'live-catalog', label: '🛒 All 2,433+ Live Products', icon: ShoppingBasket },
            { id: 'air-freight', label: '✈ Air Freight Veggies', icon: Plane },
            { id: 'weekly-offers', label: '🏷 Weekly Offers', icon: Percent },
            { id: 'bestsellers', label: '🔥 UK Bestsellers', icon: Tag },
            { id: 'festive', label: '🪔 Festive & Pooja', icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setVisibleCount(12);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-800 text-gold-400 shadow-sm scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Filter Indicator */}
      {selectedCategory && (
        <div className="mb-6 p-3 sm:p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs animate-in fade-in">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs text-emerald-800 font-medium">Department:</span>
            <span className="bg-brand-800 text-gold-400 text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
              {selectedCategory}
            </span>
            <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold">
              ({filteredProducts.length} items found)
            </span>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto px-1.5 py-0.5 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Clear Filter (Show All)
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="mt-10 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-700">{displayedProducts.length}</span> of <span className="font-bold text-slate-700">{filteredProducts.length}</span> products
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <span>Load More Products</span>
            <ChevronDown className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      )}

    </section>
  );
};

