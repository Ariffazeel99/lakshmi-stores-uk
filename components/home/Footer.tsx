'use client';

import React from 'react';
import { PhoneCall, Mail, MapPin, ShieldCheck, Heart, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-deep text-white border-t border-brand-800 mt-16">
      
      {/* Top Newsletter Bar */}
      <div className="bg-brand-800 border-b border-brand-700/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif font-extrabold text-xl text-white">
              Get Weekly Fresh Arrival Alerts & Festive Discounts
            </h3>
            <p className="text-xs text-emerald-200">
              Subscribe to get notified when air-freight vegetable shipments land in the UK.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 bg-brand-deep text-xs text-white placeholder-emerald-300/60 px-4 py-3 rounded-xl border border-brand-700 outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-brand-deep font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-emerald-100">
        
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gold-500 text-brand-deep font-serif font-black text-xl flex items-center justify-center">
              L
            </div>
            <div>
              <span className="font-serif font-extrabold text-xl tracking-tight text-white">
                LAKSHMI STORES UK
              </span>
              <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                Authentic Indian Supermarket
              </p>
            </div>
          </div>

          <p className="text-emerald-200/90 leading-relaxed text-xs">
            Lakshmi Stores UK is the premier online South & North Indian grocery store serving families across London, Birmingham, Manchester, Edinburgh, and mainland Europe. Bringing authentic regional taste, fresh air produce, and traditional pooja essentials directly to your doorstep.
          </p>

          <div className="space-y-2 text-xs pt-2">
            <p className="flex items-center gap-2 text-white font-medium">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Lakshmi Stores UK HQ, Wembley, London HA9 7AJ</span>
            </p>
            <p className="flex items-center gap-2 text-white font-medium">
              <PhoneCall className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Helpline: +44 (0) 20 8123 4567</span>
            </p>
            <p className="flex items-center gap-2 text-white font-medium">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Support: support@lakshmistores.co.uk</span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-sm text-gold-400 mb-3 uppercase tracking-wider">
            Departments
          </h4>
          <ul className="space-y-2 text-emerald-200">
            <li><a href="#" className="hover:text-white transition-colors">Fresh Air Produce</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Dals, Lentils & Pulses</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sona Masoori & Basmati Rice</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Whole Spices & Masalas</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Instant Breakfast Mixes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Brass Pooja Diyas & Lamps</a></li>
          </ul>
        </div>

        {/* Popular Brands */}
        <div>
          <h4 className="font-serif font-bold text-sm text-gold-400 mb-3 uppercase tracking-wider">
            Popular Brands
          </h4>
          <ul className="space-y-2 text-emerald-200">
            <li><a href="#" className="hover:text-white transition-colors">Aashirvaad Whole Wheat</a></li>
            <li><a href="#" className="hover:text-white transition-colors">MDH Deggi Mirch & Spices</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Haldiram’s Namkeen Mixes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">MTR Breakfast Mixes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Priya South Indian Pickles</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Grand Sweets Chennai</a></li>
          </ul>
        </div>

        {/* Delivery & Policies */}
        <div>
          <h4 className="font-serif font-bold text-sm text-gold-400 mb-3 uppercase tracking-wider">
            Customer Care
          </h4>
          <ul className="space-y-2 text-emerald-200">
            <li><a href="#" className="hover:text-white transition-colors">UK Express Shipping Rates</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Temperature Packaging Info</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-brand-800 bg-brand-950 pt-4 pb-20 md:pb-4 text-center text-[11px] text-emerald-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Lakshmi Stores UK. All Rights Reserved. Modernized E-Commerce Storefront.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for authentic Indian grocery lovers across UK & Europe</span>
          </p>
        </div>
      </div>

    </footer>
  );
};

