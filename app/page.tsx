import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { CuratedShelves } from '@/components/home/CuratedShelves';
import { TrustPillars } from '@/components/home/TrustPillars';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { FreshProduceBanner } from '@/components/home/FreshProduceBanner';
import { getProducts } from '@/lib/dal/products';
import { getCategories } from '@/lib/dal/categories';
import { getBrands } from '@/lib/dal/brands';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch initial live data on the server directly from MongoDB
  const [catalogResult, categories, brands] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
    getBrands()
  ]);

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Category Shortcuts (Live Categories from MongoDB) */}
      <CategoryShowcase categories={categories} />

      {/* 3. Trust Pillars */}
      <TrustPillars />

      {/* 4. Curated Shelves (Live Products & Pagination from MongoDB) */}
      <CuratedShelves
        initialProducts={catalogResult.products}
        initialTotal={catalogResult.pagination.total}
      />

      {/* 5. Air Freight Produce Highlight */}
      <FreshProduceBanner />

      {/* 6. Popular Brands Showcase (Live Brands from MongoDB) */}
      <BrandShowcase brands={brands} />
    </div>
  );
}
