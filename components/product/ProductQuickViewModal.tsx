'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { WeightOption } from '@/data/products';
import { X, Star, ShieldCheck, Truck, ShoppingBag, Heart, Plane, Check } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useUIStore();
  const { addItem, formatPrice } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedOption, setSelectedOption] = useState<WeightOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!quickViewProduct) return null;

  const currentOption = selectedOption || quickViewProduct.options[0];
  const isLiked = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addItem(quickViewProduct, currentOption, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setQuickViewProduct(null)} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-800 hover:bg-white transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="relative bg-slate-50 aspect-square md:aspect-auto flex items-center justify-center p-6">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full h-full max-h-[380px] object-cover rounded-2xl shadow-sm"
          />
          {quickViewProduct.isAirFreightFresh && (
            <span className="absolute top-4 left-4 bg-amber-500 text-brand-deep text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" /> Air Freight Import
            </span>
          )}
        </div>

        {/* Product Info Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
          
          <div>
            {/* Category & Origin */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span className="text-brand-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[11px]">
                {quickViewProduct.brand}
              </span>
              <span>Origin: {quickViewProduct.origin}</span>
            </div>

            <h2 className="font-serif font-extrabold text-slate-800 text-xl md:text-2xl leading-snug">
              {quickViewProduct.name}
            </h2>
            {quickViewProduct.tamilName && (
              <p className="text-sm font-semibold text-brand-700 mt-1 font-serif">
                {quickViewProduct.tamilName}
              </p>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-gold-500 text-sm font-extrabold">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{quickViewProduct.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {quickViewProduct.reviewCount} customer reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-xs leading-relaxed mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {quickViewProduct.description}
            </p>

            {/* Dietary / Feature Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {quickViewProduct.dietaryTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            {/* Weight Variant Selection */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Pack Size / Weight:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto">
                {quickViewProduct.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      currentOption.weight === opt.weight
                        ? 'border-brand-800 bg-brand-800 text-gold-400 shadow-sm scale-105'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Header */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-black text-brand-deep">
                {formatPrice(currentOption.priceGBP)}
              </span>
              {currentOption.originalPriceGBP && (
                <span className="text-sm text-slate-400 line-through font-semibold">
                  {formatPrice(currentOption.originalPriceGBP)}
                </span>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3">
              
              {/* Quantity Stepper */}
              <div className="flex items-center border-2 border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-extrabold text-slate-800 text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-slate-500 hover:text-slate-800"
                >
                  -
                </button>
                <span className="px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-slate-500 hover:text-slate-800"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-800 hover:bg-brand-900 text-gold-400 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

            </div>

            {/* Delivery Assurance */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-700" /> Express UK Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" /> Temperature Chilled Fresh
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

