import React from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  Package, 
  Plane, 
  TrendingUp, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink 
} from 'lucide-react';

export const metadata = {
  title: 'Ops Center — Lakshmi Stores UK Admin',
  description: 'Enterprise operational dashboard for order fulfillment and inventory control.'
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      
      {/* Top Ops Header */}
      <header className="bg-brand-deep text-white border-b border-brand-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-500 text-brand-deep font-serif font-black text-sm flex items-center justify-center">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-tight">
                LAKSHMI STORES UK OPS CONSOLE
              </span>
              <span className="bg-emerald-500 text-brand-deep text-[9px] font-black uppercase px-1.5 py-0.2 rounded shadow-2xs">
                Active Depot
              </span>
            </div>
            <p className="text-[10px] text-emerald-200">
              🇬🇧 UK Central Fulfillment Depot 1 (Wembley, London HA9)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-800 text-emerald-200 border border-brand-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MongoDB Atlas Live Sync
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {children}
      </main>

    </div>
  );
}
