'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Truck, PhoneCall, ShieldCheck, Globe } from 'lucide-react';

export const TopAnnouncementBar: React.FC = () => {
  const { currency, setCurrency } = useCartStore();

  return (
    <div className="bg-brand-deep text-white text-xs font-medium border-b border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left Promo message */}
        <div className="flex items-center gap-2 text-amber-300">
          <Truck className="w-4 h-4 text-gold-400 animate-pulse-subtle" />
          <span className="font-semibold text-white">FREE UK Express Delivery</span>
          <span className="hidden md:inline text-emerald-200">on orders over £50</span>
          <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-1">
            Same Day Dispatch
          </span>
        </div>

        {/* Right Controls: Currency Switcher & Helpline */}
        <div className="flex items-center gap-5 text-emerald-100">
          <div className="hidden lg:flex items-center gap-1 text-emerald-200">
            <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
            <span>UK Helpline: <strong className="text-white">+44 (0) 20 8123 4567</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Air Freight Fresh Arrival Everyday</span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 bg-brand-800/80 px-2 py-0.5 rounded-md border border-brand-700/60">
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span className="mr-1 text-[11px] font-semibold">Currency:</span>
            <button
              onClick={() => setCurrency('GBP')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currency === 'GBP'
                  ? 'bg-gold-500 text-brand-deep shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              GBP £
            </button>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currency === 'EUR'
                  ? 'bg-gold-500 text-brand-deep shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              EUR €
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

