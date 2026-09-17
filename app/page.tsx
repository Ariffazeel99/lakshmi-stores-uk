import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { CuratedShelves } from '@/components/home/CuratedShelves';
import { TrustPillars } from '@/components/home/TrustPillars';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { FreshProduceBanner } from '@/components/home/FreshProduceBanner';

export default function Home() {
  return (
    <div className="space-y-4 pb-12">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Category Shortcuts */}
      <CategoryShowcase />

      {/* 3. Trust Pillars */}
      <TrustPillars />

      {/* 4. Curated Shelves (Tabbed Grid with Weight Options) */}
      <CuratedShelves />

      {/* 5. Air Freight Produce Highlight */}
      <FreshProduceBanner />

      {/* 6. Popular Brands Showcase */}
      <BrandShowcase />
    </div>
  );
}

