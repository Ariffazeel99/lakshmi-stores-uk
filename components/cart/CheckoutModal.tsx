'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Lock, Loader2, AlertCircle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const router = useRouter();
  const { isCheckoutOpen, setCheckoutOpen } = useUIStore();
  const { items, getSubtotalGBP, formatPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || 'Rajesh');
  const [lastName, setLastName] = useState(user?.lastName || 'Kumar');
  const [email, setEmail] = useState(user?.email || 'rajesh.kumar@example.co.uk');
  const [phone, setPhone] = useState(user?.phone || '+44 7700 900077');
  const [address, setAddress] = useState('42 High Street, Wembley');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('HA9 7AJ');

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [isAuthenticated, user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const subtotal = getSubtotalGBP();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your shopping basket is empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        userId: user?.id || null,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          recipient_name: `${firstName} ${lastName}`.trim(),
          address_line1: address,
          city: city,
          postcode: postcode.trim().toUpperCase(),
          country: 'United Kingdom'
        },
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: null,
          sku: item.selectedOption.weight ? `${item.product.id}-${item.selectedOption.weight}` : item.product.id,
          title: item.product.name,
          sizeOrWeight: item.selectedOption.weight || null,
          unitPrice: item.selectedOption.priceGBP,
          quantity: item.quantity,
          isChilled: item.product.isAirFreightFresh || false
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      // Success: clear basket, close modal, and redirect to Order Detail page
      clearCart();
      setCheckoutOpen(false);
      router.push(`/orders/${data.order.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong while processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => !isSubmitting && setCheckoutOpen(false)} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 p-5 sm:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={() => setCheckoutOpen(false)}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

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

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">UK Phone Number</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">First Name</label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Last Name</label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">UK Delivery Address</label>
              <input
                required
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">City / Town</label>
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Postcode</label>
                <input
                  required
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
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
              <span>{subtotal >= 50 ? 'FREE' : '£4.99'}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-brand-deep pt-2 border-t border-slate-200">
              <span>Amount Payable:</span>
              <span>{formatPrice(subtotal >= 50 ? subtotal : subtotal + 4.99)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Processing Order & Reserving Stock...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-gold-400" />
                <span>Pay {formatPrice(subtotal >= 50 ? subtotal : subtotal + 4.99)} & Confirm Order</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
