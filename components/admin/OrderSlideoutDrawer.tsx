'use client';

import React from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  CreditCard, 
  Truck, 
  Snowflake, 
  Printer, 
  ShieldCheck, 
  ExternalLink, 
  Loader2 
} from 'lucide-react';

interface OrderSlideoutDrawerProps {
  onStatusUpdated: () => void;
}

export const OrderSlideoutDrawer: React.FC<OrderSlideoutDrawerProps> = ({ onStatusUpdated }) => {
  const { inspectedOrder, isDrawerOpen, closeOrderDrawer } = useAdminStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isDrawerOpen || !inspectedOrder) return null;

  const hasChilledItem = inspectedOrder.items?.some((i) => i.is_chilled);
  const totalKgEstimated = inspectedOrder.items?.length * 1.2;

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const tracking = inspectedOrder.shipments?.[0]?.tracking_number || `DPD-LSUK-${inspectedOrder.order_number.slice(-6)}`;
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: inspectedOrder.order_number,
          status: newStatus,
          carrierTracking: tracking
        })
      });
      onStatusUpdated();
      closeOrderDrawer();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={closeOrderDrawer} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-brand-deep">
                  {inspectedOrder.order_number}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                  {inspectedOrder.order_status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Received {new Date(inspectedOrder.created_at).toLocaleString('en-GB')}
              </p>
            </div>

            <button
              onClick={closeOrderDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-6 text-xs text-slate-700">
            
            {/* Chilled Notice */}
            {hasChilledItem && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900">
                <Snowflake className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-spin" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                    Cold-Chain Packaging Requisite
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Insert Thermal Foil Pouch + 2x 400g Frozen Gel Packs prior to seal.
                  </p>
                </div>
              </div>
            )}

            {/* Customer & Address */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>Customer & Destination</span>
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-800 text-sm">
                  {inspectedOrder.shipping_address?.recipient_name}
                </p>
                <p className="text-slate-600">{inspectedOrder.shipping_address?.address_line1}</p>
                <p className="text-slate-600">
                  {inspectedOrder.shipping_address?.city}, {inspectedOrder.shipping_address?.postcode}
                </p>
                <p className="text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                  Email: <strong className="text-slate-700">{inspectedOrder.customer_email}</strong> • Phone: {inspectedOrder.customer_phone}
                </p>
              </div>
            </div>

            {/* Items Composition */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Items to Pack ({inspectedOrder.items?.length})</span>
                <span className="text-[11px] text-slate-400 font-sans font-normal">Est. Weight ~{totalKgEstimated.toFixed(1)}kg</span>
              </h4>
              <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {inspectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 leading-snug">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-400">SKU: {item.sku}</span>
                        {item.size_or_weight && (
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            {item.size_or_weight}
                          </span>
                        )}
                        {item.is_chilled && (
                          <span className="text-emerald-700 bg-emerald-50 text-[10px] px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <Snowflake className="w-2.5 h-2.5" /> Chilled
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-slate-500">{item.quantity} × £{item.unit_price.toFixed(2)}</p>
                      <p className="font-bold text-slate-900">£{item.line_total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Consignment Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Log</span>
                <p className="font-bold text-slate-800 text-sm">£{inspectedOrder.pricing_summary?.grand_total.toFixed(2)}</p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Stripe Captured
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Courier Assignment</span>
                <p className="font-bold text-brand-deep text-sm">DPD UK Express 24h</p>
                <p className="text-[10px] font-mono text-slate-500">
                  {inspectedOrder.shipments?.[0]?.tracking_number || 'Awaiting Manifest'}
                </p>
              </div>
            </div>

          </div>

          {/* Drawer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('processing')}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Mark Packing</span>
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('partially_shipped')}
                className="py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5 text-gold-400" />}
                <span>Manifest & Dispatch</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 4x6" Thermal Shipping Label & Packing Slip</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
