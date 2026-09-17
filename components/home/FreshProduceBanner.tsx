'use client';

import React from 'react';
import { Plane, Truck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const FreshProduceBanner: React.FC = () => {
  return (
    <section id="fresh-produce" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-brand-800 to-brand-deep text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-brand-700">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="bg-amber-500/20 text-gold-300 border border-gold-400/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              DIRECT FROM SOUTH INDIA AIR FREIGHT
            </span>

            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              Fresh Air-Shipped Vegetables Flown Direct to London & UK
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl opacity-90">
              We import fresh Chinna Vengayam (Small Onions), Tindora, Drumstick, Karuveppilai (Curry Leaves), Snake Gourd, Yam, and South Indian Banana Leaves twice weekly. Enjoy farm-to-kitchen freshness with temperature-controlled chilled delivery.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#curated-shelves"
                className="bg-gold-500 hover:bg-gold-400 text-brand-deep font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-gold-glow"
              >
                <span>Browse Air-Shipped Veggies</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-brand-deep/80 px-4 py-2.5 rounded-xl border border-brand-700">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Next Arrival Flight: Friday Morning</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative aspect-square w-56 sm:w-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/40">
              <img
                src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?q=80&w=600&auto=format&fit=crop"
                alt="Air Freight Produce"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[10px] font-black uppercase text-gold-400 bg-brand-deep/90 px-2 py-1 rounded border border-brand-700">
                  Coimbatore & Madurai Direct
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

