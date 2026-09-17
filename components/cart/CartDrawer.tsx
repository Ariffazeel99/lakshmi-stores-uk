'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { X, Trash2, ShoppingBag, Truck, ArrowRight, ShieldCheck, Plus, Minus, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    getSubtotalGBP,
    formatPrice,
    freeShippingThresholdGBP,
  } = useCartStore();

  const { setCheckoutOpen } = useUIStore();

  if (!isCartOpen) return null;

  const subtotalGBP = getSubtotalGBP();
  const freeShippingProgress = Math.min(100, (subtotalGBP / freeShippingThresholdGBP) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdGBP - subtotalGBP);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Slide-over panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-800 text-gold-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-brand-deep text-lg leading-tight">
                  Your Shopping Basket
                </h3>
                <p className="text-[11px] font-medium text-slate-500">
                  {items.length} unique items ({items.reduce((s, i) => s + i.quantity, 0)} total)
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleCart(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-brand-800">
                <Truck className="w-4 h-4 text-emerald-600 animate-bounce-short" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-700 font-extrabold">🎉 You unlocked FREE UK Shipping!</strong>
                ) : (
                  <span>Add <strong className="text-brand-deep">{formatPrice(remainingForFreeShipping)}</strong> more for FREE UK Delivery</span>
                )}
              </span>
              <span className="text-[11px] text-emerald-700 font-extrabold">{Math.round(freeShippingProgress)}%</span>
            </div>

            <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-slate-700 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Explore our fresh air-shipped produce, dals, rice, and spices to start shopping!
                </p>
                <button
                  onClick={() => toggleCart(false)}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-brand-800 text-gold-400 text-xs font-bold hover:bg-brand-900 transition-colors shadow-sm"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold bg-white text-brand-800 px-2 py-0.5 rounded border border-slate-200">
                          {item.selectedOption.weight}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatPrice(item.selectedOption.priceGBP)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 font-bold text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded-r"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="font-extrabold text-sm text-brand-deep">
                        {formatPrice(item.selectedOption.priceGBP * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-slate-800">{formatPrice(subtotalGBP)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700">
                    {remainingForFreeShipping === 0 ? 'FREE' : formatPrice(3.99)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Includes UK VAT:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-base font-black text-brand-deep pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>{formatPrice(subtotalGBP + (remainingForFreeShipping === 0 ? 0 : 3.99))}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  toggleCart(false);
                  setCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-900 hover:to-brand-800 text-gold-400 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-emerald-glow transition-all hover:scale-[1.01] active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted
                </span>
                <span>•</span>
                <span>Same Day Dispatch</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

