'use client';

import React from 'react';
import { Product } from '@/data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title, subtitle }) => {
  return (
    <section className="py-8">
      {title && (
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-brand-deep tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <a
            href="#"
            className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 group"
          >
            <span>View All ({products.length})</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

