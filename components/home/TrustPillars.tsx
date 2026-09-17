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
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${p.color} flex items-start gap-4 transition-transform hover:-translate-y-1 shadow-xs`}
            >
              <div className="p-3 rounded-xl bg-white shadow-xs flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{p.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

