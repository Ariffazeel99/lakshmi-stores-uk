'use client';

import React from 'react';
import { CATEGORIES } from '@/data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.slug}`}
            className="group relative bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-card-hover hover:border-brand-600/50 transition-all duration-300 text-center flex flex-col items-center justify-between"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-emerald-100 group-hover:border-gold-400 transition-colors shadow-sm relative">
              <img
                src={cat.featuredImg}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-deep/10 group-hover:bg-transparent transition-colors" />
            </div>

            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-brand-800 transition-colors leading-snug line-clamp-2">
                {cat.name}
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">
                {cat.itemCount}+ Items
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

