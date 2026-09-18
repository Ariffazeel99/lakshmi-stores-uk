'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { fetchCatalog } from '@/lib/api/catalog';
import { useUIStore } from '@/store/useUIStore';
import { Sparkles, Plane, Flame, Tag, Percent, ShoppingBasket, ChevronDown, Loader2 } from 'lucide-react';

interface CuratedShelvesProps {
  initialProducts?: Product[];
  initialTotal?: number;
}

export const CuratedShelves: React.FC<CuratedShelvesProps> = ({
  initialProducts = [],
  initialTotal = 2433
}) => {
  const { selectedCategory, setSelectedCategory } = useUIStore();
  const [activeTab, setActiveTab] = useState<'all' | 'live-catalog' | 'air-freight' | 'weekly-offers' | 'bestsellers' | 'festive'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadProducts = useCallback(async (tab: string, category: string | null, limit: number) => {
    setIsLoading(true);
    try {
      const tabParam = (tab !== 'all' && tab !== 'live-catalog') ? (tab as any) : undefined;
      const catSlug = category ? category.toLowerCase().trim().replace(/[\s\W-]+/g, '-') : undefined;

      const res = await fetchCatalog({
        tab: tabParam,
        categorySlug: catSlug,
        limit,
        page: 1
      });

      if (res.success) {
        setProducts(res.data);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load products from MongoDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when tab or category changes
  useEffect(() => {
    loadProducts(activeTab, selectedCategory, visibleCount);
  }, [activeTab, selectedCategory, visibleCount, loadProducts]);

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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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
              ({totalCount} items in database)
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
      <div className="relative">
        {isLoading && products.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Fetching live products from MongoDB...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {visibleCount < totalCount && (
        <div className="mt-10 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-700">{products.length}</span> of{' '}
            <span className="font-bold text-slate-700">{totalCount}</span> live database products
          </p>
          <button
            disabled={isLoading}
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <span>Load More Products</span>
                <ChevronDown className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
