'use client';

import React from 'react';
import { BRANDS } from '@/data/brands';
import { Sparkles } from 'lucide-react';

export const BrandShowcase: React.FC = () => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Trusted Heritage Brands
          </span>
          <h2 className="font-serif font-extrabold text-2xl text-brand-deep">
            Popular Indian Grocery Brands
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {BRANDS.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border border-slate-200/70 text-center flex flex-col justify-center items-center hover:scale-105 transition-all shadow-2xs ${b.bgColor}`}
          >
            <span className="font-serif font-black text-base tracking-wider block">
              {b.logoText}
            </span>
            <span className="text-[9px] font-semibold opacity-75 mt-1 line-clamp-1">
              {b.tagline}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

