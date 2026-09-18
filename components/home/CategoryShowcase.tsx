'use client';

import React from 'react';
import { Category } from '@/data/categories';
import { fetchCategories } from '@/lib/api/catalog';
import { useUIStore } from '@/store/useUIStore';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryShowcaseProps {
  categories?: Category[];
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories: initialCategories }) => {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories || []);
  const { setSelectedCategory } = useUIStore();

  React.useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetchCategories().then(setCategories).catch(console.error);
    }
  }, [initialCategories]);

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    const shelvesEl = document.getElementById('curated-shelves');
    if (shelvesEl) {
      shelvesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-6 border-b border-slate-200/80 pb-3">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Explore Departments
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-brand-deep mt-0.5">
            Popular Grocery Categories
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:block">
          Authentic Sourcing Across India
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {categories.slice(0, 8).map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="group relative bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-200/80 shadow-2xs hover:shadow-card-hover hover:border-brand-600/50 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 mb-1.5 sm:mb-3 border-2 border-emerald-100 group-hover:border-gold-400 transition-colors shadow-2xs relative">
              <img
                src={cat.featuredImg}
                alt={cat.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-deep/10 group-hover:bg-transparent transition-colors" />
            </div>

            <div>
              <h3 className="font-bold text-[11px] sm:text-sm text-slate-800 group-hover:text-brand-800 transition-colors leading-snug line-clamp-2">
                {cat.name}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 sm:mt-1">
                {cat.itemCount}+ Items
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

