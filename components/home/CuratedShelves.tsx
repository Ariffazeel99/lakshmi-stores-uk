'use client';

import React, { useState } from 'react';
import { PRODUCTS, Product } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, Plane, Flame, Tag, Percent } from 'lucide-react';

export const CuratedShelves: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'air-freight' | 'weekly-offers' | 'bestsellers' | 'festive'>('all');

  let filteredProducts: Product[] = PRODUCTS;
  if (activeTab === 'air-freight') {
    filteredProducts = PRODUCTS.filter((p) => p.isAirFreightFresh);
  } else if (activeTab === 'weekly-offers') {
    filteredProducts = PRODUCTS.filter((p) => p.isWeeklyOffer || p.options.some(o => o.originalPriceGBP));
  } else if (activeTab === 'bestsellers') {
    filteredProducts = PRODUCTS.filter((p) => p.isBestseller);
  } else if (activeTab === 'festive') {
    filteredProducts = PRODUCTS.filter((p) => p.isFestiveSpecial);
  }

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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Products', icon: Sparkles },
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
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};

