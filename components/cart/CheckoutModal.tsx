'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Lock } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setCheckoutOpen } = useUIStore();
  const { items, getSubtotalGBP, formatPrice, clearCart } = useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = getSubtotalGBP();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
      setIsSuccess(false);
      setCheckoutOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setCheckoutOpen(false)} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 p-5 sm:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={() => setCheckoutOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-short">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif font-extrabold text-brand-deep text-2xl">
              Order Confirmed!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for shopping with Lakshmi Stores UK. Your order reference <strong className="text-brand-800">#LAK-{Math.floor(100000 + Math.random() * 900000)}</strong> has been placed.
            </p>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] font-semibold text-emerald-800 max-w-sm mx-auto">
              ✈ Temperature-Controlled Chilled Dispatch Scheduled for Tomorrow Morning.
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-brand-800 font-serif font-extrabold text-xl">
                <Lock className="w-5 h-5 text-gold-500" />
                <span>Lakshmi Stores UK Secure Express Checkout</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete your delivery details for UK/European dispatch
              </p>
            </div>

            {/* Address fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">First Name</label>
                  <input
                    required
                    type="text"
                    defaultValue="Rajesh"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Last Name</label>
                  <input
                    required
                    type="text"
                    defaultValue="Kumar"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">UK Delivery Address</label>
                <input
                  required
                  type="text"
                  defaultValue="42 High Street, Wembley"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">City / Town</label>
                  <input
                    required
                    type="text"
                    defaultValue="London"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Postcode</label>
                  <input
                    required
                    type="text"
                    defaultValue="HA9 7AJ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-slate-600">
                <span>Total Items ({items.length}):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Express UK Chilled Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-black text-sm text-brand-deep pt-2 border-t border-slate-200">
                <span>Amount Payable:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-gold-400" />
              <span>Pay {formatPrice(subtotal)} & Confirm Order</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

