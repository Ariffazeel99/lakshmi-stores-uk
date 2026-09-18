'use client';

import React from 'react';
import { Plane, ThermometerSnowflake, ShieldCheck, Truck } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const PILLARS = [
    {
      icon: Plane,
      title: 'Weekly Air Freight Fresh',
      desc: 'Direct import flights from Tamil Nadu & Kerala farms every Tuesday & Friday.',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: ThermometerSnowflake,
      title: 'Chilled Express Delivery',
      desc: 'Insulated thermal boxes with temperature gel packs for fresh produce.',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic Origin',
      desc: 'Authentic Indian grocery brands (MDH, Aashirvaad, Haldiram’s, Priya).',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: Truck,
      title: 'Free UK Shipping > £50',
      desc: 'Fast express dispatch across London, Birmingham, Manchester & all UK postal codes.',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border ${p.color} flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 transition-transform hover:-translate-y-1 shadow-2xs`}
            >
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white shadow-2xs flex-shrink-0">
                <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">{p.title}</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 leading-snug line-clamp-2 sm:line-clamp-none">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

