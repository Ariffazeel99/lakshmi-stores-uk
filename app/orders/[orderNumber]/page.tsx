import React from 'react';
import Link from 'next/link';
import { getOrderByNumber } from '@/lib/dal/orders';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Snowflake, 
  MapPin, 
  Receipt, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Printer, 
  ShieldCheck, 
  Phone, 
  AlertCircle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface OrderPageProps {
  params: Promise<{ orderNumber: string }> | { orderNumber: string };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;

  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-brand-deep mb-2">
          Order Not Found
        </h1>
        <p className="text-slate-600 max-w-md text-sm mb-6">
          We couldn&apos;t find an order matching reference <strong className="text-brand-800">{orderNumber}</strong>. Please check the order number or contact customer support.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-bold text-sm shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  const hasChilledItem = order.items.some((i) => i.is_chilled);
  const createdDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-800 hover:text-brand-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lakshmi Stores UK</span>
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            Order Reference: <strong className="text-slate-800">{order.order_number}</strong>
          </span>
        </div>

        {/* Top Confirmation Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  Order Successfully Placed
                </span>
                <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-brand-deep mt-0.5">
                  Thank You for Your Order!
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Placed on {createdDate}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {order.order_status.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200">
                <Receipt className="w-3.5 h-3.5 text-gold-600" />
                {order.currency} £{order.pricing_summary.grand_total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stepper Status Indicator */}
          <div className="pt-6 relative z-10">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-brand-800 text-gold-400 flex items-center justify-center font-bold text-xs mb-1.5 shadow-sm">
                  ✓
                </div>
                <span className="font-bold text-brand-900">Confirmed</span>
                <span className="text-[10px] text-slate-400">Payment Captured</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1.5 shadow-sm animate-pulse">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-emerald-800">Packing</span>
                <span className="text-[10px] text-slate-400">Chilled Warehouse</span>
              </div>
              <div className="flex flex-col items-center opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs mb-1.5 border border-slate-200">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-600">Dispatched</span>
                <span className="text-[10px] text-slate-400">DPD Express</span>
              </div>
              <div className="flex flex-col items-center opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs mb-1.5 border border-slate-200">
                  🏁
                </div>
                <span className="font-semibold text-slate-600">Delivered</span>
                <span className="text-[10px] text-slate-400">To Your Door</span>
              </div>
            </div>
          </div>

          {/* Chilled Notice if present */}
          {hasChilledItem && (
            <div className="mt-6 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <Snowflake className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-spin" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
                  Chilled Packaging Active
                </span>
                <span>
                  This order contains fresh Indian vegetables or perishables. Packed with thermal insulation and gel ice packs for guaranteed fresh delivery.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="font-serif font-bold text-lg text-brand-deep mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-700" />
                <span>Items in This Order ({order.items.length})</span>
              </h2>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-slate-800 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {item.size_or_weight && (
                          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {item.size_or_weight}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          SKU: <span className="font-mono text-slate-700">{item.sku}</span>
                        </span>
                        {item.is_chilled && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Snowflake className="w-3 h-3" /> Chilled
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">
                        {item.quantity} × £{item.unit_price.toFixed(2)}
                      </p>
                      <p className="font-bold text-sm text-brand-deep mt-0.5">
                        £{item.line_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Carrier Consignment */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h2 className="font-serif font-bold text-lg text-brand-deep mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-700" />
                <span>Delivery & Shipment Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-1">
                    Shipping Address
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{order.shipping_address.recipient_name}</p>
                  <p className="text-slate-600 mt-0.5">{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && (
                    <p className="text-slate-600">{order.shipping_address.address_line2}</p>
                  )}
                  <p className="text-slate-600">
                    {order.shipping_address.city}, {order.shipping_address.postcode}
                  </p>
                  <p className="text-slate-600">{order.shipping_address.country}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-1">
                    Consignment Carrier
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-extrabold text-brand-deep text-sm">DPD Express Next-Day</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Tracked
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Carrier Tracking:{' '}
                    <span className="font-mono font-bold text-brand-800">
                      {order.shipments?.[0]?.tracking_number || `DPD-${order.order_number.slice(-6)}`}
                    </span>
                  </p>
                  <p className="text-slate-500 mt-1">
                    Customer Updates sent to <strong className="text-slate-700">{order.customer_email}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-lg text-brand-deep border-b border-slate-100 pb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-700" />
                <span>Price Breakdown</span>
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal:</span>
                  <span>£{order.pricing_summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Express Chilled Shipping:</span>
                  <span>
                    {order.pricing_summary.shipping_fee === 0 ? (
                      <span className="font-bold text-emerald-700 uppercase">FREE</span>
                    ) : (
                      `£${order.pricing_summary.shipping_fee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>UK VAT Included:</span>
                  <span>£{order.pricing_summary.tax_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif font-extrabold text-base text-brand-deep pt-3 border-t border-slate-200">
                  <span>Total Paid ({order.currency}):</span>
                  <span>£{order.pricing_summary.grand_total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="bg-emerald-50/60 p-3 rounded-xl flex items-center gap-2 text-emerald-800 text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Payment authorized & confirmed via Stripe</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/"
                  className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-950">
              <h4 className="font-bold font-serif text-sm text-brand-deep mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gold-600" />
                <span>Need Help With Your Order?</span>
              </h4>
              <p className="text-slate-600 text-[11px] mt-1">
                Our UK dispatch team is available Monday to Saturday 8am - 7pm.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href="tel:+442089030000"
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-bold text-[11px] text-brand-800 hover:bg-amber-100 transition-colors"
                >
                  +44 20 8903 0000
                </a>
                <a
                  href="mailto:orders@lakshmistores.co.uk"
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-bold text-[11px] text-brand-800 hover:bg-amber-100 transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

