'use client';

import React, { useState } from 'react';
import { Product, WeightOption } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useUIStore } from '@/store/useUIStore';
import { Star, Heart, Eye, ShoppingBag, Plus, Minus, Check, Plane, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items, updateQuantity, formatPrice } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { setQuickViewProduct } = useUIStore();

  const [selectedOption, setSelectedOption] = useState<WeightOption>(product.options[0]);
  const [justAdded, setJustAdded] = useState(false);

  const isLiked = isInWishlist(product.id);
  const cartItemId = `${product.id}-${selectedOption.weight}`;
  const cartItem = items.find((i) => i.id === cartItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Calculate percentage discount
  const savingsPercent = selectedOption.originalPriceGBP
    ? Math.round(((selectedOption.originalPriceGBP - selectedOption.priceGBP) / selectedOption.originalPriceGBP) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, selectedOption, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:border-brand-600/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isAirFreightFresh && (
            <span className="bg-amber-500 text-brand-deep text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 pointer-events-auto">
              <Plane className="w-3 h-3" /> Air Freight
            </span>
          )}
          {savingsPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5 pointer-events-auto">
              <Tag className="w-3 h-3" /> SAVE {savingsPercent}%
            </span>
          )}
          {product.isBestseller && !product.isAirFreightFresh && savingsPercent === 0 && (
            <span className="bg-brand-800 text-gold-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm pointer-events-auto">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
            isLiked
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm scale-105'
              : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200/60'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Quick View Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 backdrop-blur-md text-brand-deep text-xs font-bold py-2 rounded-xl border border-slate-200 shadow-lg flex items-center justify-center gap-1.5 hover:bg-brand-800 hover:text-white"
        >
          <Eye className="w-3.5 h-3.5" /> Quick View
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Brand & Origin */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-brand-800 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded">
              {product.brand}
            </span>
            <span className="truncate max-w-[120px]" title={product.origin}>
              {product.origin}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 hover:text-brand-800 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
          {product.tamilName && (
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 font-serif">
              {product.tamilName}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-gold-500 text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-extrabold text-slate-800 ml-1 text-xs">{product.rating}</span>
            </div>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Weight Selector & Pricing Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          
          {/* Weight Option Pills */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-0.5">
            {product.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(option)}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all whitespace-nowrap ${
                  selectedOption.weight === option.weight
                    ? 'border-brand-800 bg-brand-800 text-gold-400 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.weight}
              </button>
            ))}
          </div>

          {/* Pricing & Add to Cart Row */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-brand-deep">
                  {formatPrice(selectedOption.priceGBP)}
                </span>
                {selectedOption.originalPriceGBP && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(selectedOption.originalPriceGBP)}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-emerald-700">In Stock</p>
            </div>

            {/* Stepper or Add Button */}
            {quantityInCart > 0 ? (
              <div className="flex items-center bg-brand-800 text-white rounded-xl border border-brand-900 overflow-hidden shadow-sm">
                <button
                  onClick={() => updateQuantity(cartItemId, quantityInCart - 1)}
                  className="px-2 py-1.5 hover:bg-brand-900 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 text-gold-400" />
                </button>
                <span className="px-2 font-black text-xs text-gold-400">{quantityInCart}</span>
                <button
                  onClick={() => updateQuantity(cartItemId, quantityInCart + 1)}
                  className="px-2 py-1.5 hover:bg-brand-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-gold-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-800 hover:bg-brand-900 text-gold-400 hover:scale-102 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

