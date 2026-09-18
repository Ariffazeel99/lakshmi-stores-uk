'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Plane, Sparkles, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'FESTIVAL OF FLAVOURS 2026',
    title: 'Authentic Indian Grocery Delivered Across UK & Europe',
    subtitle: 'Direct air-shipped vegetables from Tamil Nadu & Kerala, premium Sona Masoori, Toor Dal, and heritage spices.',
    badge: 'FREE Shipping over £50',
    bgGradient: 'from-brand-deep via-brand-800 to-emerald-900',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Shop Air Freight Vegetables',
  },
  {
    id: 2,
    tag: 'DIWALI & PONGAL GRAND OFFERS',
    title: 'Up to 30% OFF Monthly Ration Bundles & Pooja Essentials',
    subtitle: 'High-grade Brass Diyas, Incense, Aashirvaad Atta, and Haldirams Snacks for your family celebrations.',
    badge: 'Limited Time Savings',
    bgGradient: 'from-amber-950 via-brand-900 to-brand-800',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Explore Festive Deals',
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white rounded-2xl sm:rounded-3xl my-2 sm:my-4 mx-3 sm:mx-6 lg:mx-8 shadow-2xl border border-brand-800">
      <div className={`relative min-h-[380px] md:min-h-[480px] flex items-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-700`}>
        
        {/* Background Subtle Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400" />
                {slide.tag}
              </span>
              <span className="bg-emerald-500/30 text-emerald-200 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                <Plane className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" /> {slide.badge}
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white drop-shadow-md">
              {slide.title}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl font-normal opacity-90">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#curated-shelves"
                className="bg-gold-500 hover:bg-gold-400 text-brand-deep font-black text-sm px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-gold-glow"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-4 text-xs text-emerald-200 font-semibold sm:border-l sm:border-brand-700/80 sm:pl-4">
                <div className="text-left">
                  <p className="text-white font-extrabold text-base leading-tight">2,433+</p>
                  <p className="text-[10px] text-gold-300 uppercase">Live Products In Stock</p>
                </div>
                <div className="text-left border-l border-brand-700/60 pl-3">
                  <p className="text-white font-extrabold text-base leading-tight">10,000+</p>
                  <p className="text-[10px] text-emerald-300 uppercase">5-Star UK Reviews</p>
                </div>
              </div>
            </div>

          </div>

          {/* Image Showcase Column */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-500/30 group">
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-brand-deep/90 backdrop-blur-md p-3 rounded-xl border border-brand-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">Chilled Express Packing Guarantee</span>
                </div>
                <span className="text-gold-400 font-black">Same-Day UK Dispatch</span>
              </div>
            </div>
          </div>

        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-gold-400' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

