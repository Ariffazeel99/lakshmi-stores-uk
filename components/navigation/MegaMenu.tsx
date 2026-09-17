'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { ChevronDown, Sparkles, Plane, Flame, Tag } from 'lucide-react';

export const MegaMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="bg-brand-deep text-white border-b border-brand-800 hidden lg:block relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between text-xs font-semibold">
          
          {/* Main All Categories Trigger */}
          <li className="relative group py-3">
            <button className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-brand-deep px-4 py-1.5 rounded-lg font-extrabold uppercase tracking-wider transition-colors shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Shop All Departments</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </li>

          {/* Featured Air Freight Direct Navigation Item */}
          <li className="py-3">
            <a
              href="#fresh-produce"
              className="flex items-center gap-1.5 text-amber-300 hover:text-white px-2 py-1 rounded transition-colors font-bold"
            >
              <Plane className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Air Freight Vegetables</span>
              <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded font-black uppercase">
                Direct TN / KL
              </span>
            </a>
          </li>

          {/* Dynamic Mega Menu Items */}
          {CATEGORIES.map((cat) => (
            <li
              key={cat.id}
              className="relative group py-3"
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <a
                href={`#${cat.slug}`}
                className="flex items-center gap-1 text-emerald-100 hover:text-gold-400 px-2.5 py-1 rounded transition-colors font-medium text-xs"
              >
                <span>{cat.name}</span>
                <ChevronDown className="w-3 h-3 text-emerald-400 group-hover:rotate-180 transition-transform" />
              </a>

              {/* Mega Dropdown Panel */}
              {activeCategory === cat.id && (
                <div className="absolute top-full left-0 w-80 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-100 p-5 grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-serif font-bold text-base text-brand-deep flex items-center justify-between">
                      <span>{cat.name}</span>
                      <span className="text-xs text-brand-600 font-sans font-normal">{cat.itemCount}+ Items</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.description}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subcategories</p>
                    {cat.subcategories.map((sub, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-800 hover:bg-emerald-50/60 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <span>{sub}</span>
                        <span className="text-[10px] text-slate-400">→</span>
                      </a>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-200/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={cat.featuredImg} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Featured Offer</p>
                      <p className="text-xs font-semibold text-slate-800">Save up to 20% on weekly bundles</p>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}

          {/* Festival Specials */}
          <li className="py-3">
            <a
              href="#festive-specials"
              className="flex items-center gap-1.5 text-gold-400 hover:text-white px-2 py-1 rounded font-bold transition-colors"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-gold-400" />
              <span>Festive & Pooja Specials</span>
            </a>
          </li>

        </ul>
      </div>
    </nav>
  );
};

