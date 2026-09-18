'use client';

import React from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { OrderDocument } from '@/types/mongodb';
import { 
  Package, 
  Snowflake, 
  Printer, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface OrderWorkbenchProps {
  orders: OrderDocument[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const OrderWorkbench: React.FC<OrderWorkbenchProps> = ({ orders, isLoading, onRefresh }) => {
  const { orderSegment, setOrderSegment, openOrderDrawer } = useAdminStore();
  const [selectedOrderNumbers, setSelectedOrderNumbers] = React.useState<string[]>([]);

  const segments = [
    { id: 'all', label: 'All Orders' },
    { id: 'unfulfilled', label: 'Paid / Unfulfilled' },
    { id: 'chilled_prep', label: '❄️ Chilled Vegetable Prep' },
    { id: 'packing', label: 'In Packing' },
    { id: 'dispatched', label: 'Dispatched / In Transit' }
  ];

  const toggleSelectAll = () => {
    if (selectedOrderNumbers.length === orders.length) {
      setSelectedOrderNumbers([]);
    } else {
      setSelectedOrderNumbers(orders.map((o) => o.order_number));
    }
  };

  const toggleSelectOrder = (orderNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOrderNumbers.includes(orderNum)) {
      setSelectedOrderNumbers(selectedOrderNumbers.filter((n) => n !== orderNum));
    } else {
      setSelectedOrderNumbers([...selectedOrderNumbers, orderNum]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      
      {/* Segmented Filter Tabs & Batch Bar */}
      <div className="border-b border-slate-200/80 px-5 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {segments.map((seg) => {
            const isActive = orderSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setOrderSegment(seg.id as any)}
                className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-brand-800 text-brand-800 bg-white shadow-2xs rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {seg.label}
              </button>
            );
          })}
        </div>

        {/* Batch Bar */}
        {selectedOrderNumbers.length > 0 && (
          <div className="pb-2.5 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              {selectedOrderNumbers.length} Selected
            </span>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 rounded-lg bg-brand-800 text-gold-400 font-bold text-xs hover:bg-brand-900 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Batch Print Labels</span>
            </button>
          </div>
        )}
      </div>

      {/* Dense Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10">
                <button onClick={toggleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-700">
                  {selectedOrderNumbers.length === orders.length && orders.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-brand-700" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-3">Order Ref</th>
              <th className="py-3 px-3">SLA / Age</th>
              <th className="py-3 px-4">Customer & City</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-3">Class</th>
              <th className="py-3 px-3">Total (£)</th>
              <th className="py-3 px-3">Courier</th>
              <th className="py-3 px-4 text-right">Quick Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                  Loading live orders from MongoDB...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                  No orders found matching this filter segment.
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const isSelected = selectedOrderNumbers.includes(ord.order_number);
                const isChilled = ord.items?.some((i) => i.is_chilled);
                const orderDate = new Date(ord.created_at);
                const ageMinutes = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60));

                return (
                  <tr
                    key={ord.order_number || String(ord._id)}
                    onClick={() => openOrderDrawer(ord)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4" onClick={(e) => toggleSelectOrder(ord.order_number, e)}>
                      <button className="cursor-pointer text-slate-400 hover:text-slate-700">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-brand-700" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-brand-deep">
                      {ord.order_number}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        ageMinutes > 60 
                          ? 'bg-rose-50 text-rose-700' 
                          : ageMinutes > 30 
                          ? 'bg-amber-50 text-amber-800' 
                          : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {ageMinutes < 60 ? `${ageMinutes}m` : `${Math.floor(ageMinutes / 60)}h ${ageMinutes % 60}m`}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 leading-tight">
                        {ord.shipping_address?.recipient_name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {ord.shipping_address?.city}, {ord.shipping_address?.postcode}
                      </p>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={ord.items?.map(i => i.title).join(', ')}>
                      <strong>{ord.items?.length} items:</strong>{' '}
                      {ord.items?.map((i) => i.title).join(', ')}
                    </td>

                    <td className="py-3 px-3">
                      {isChilled ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          <Snowflake className="w-2.5 h-2.5 text-emerald-700" /> Chilled
                        </span>
                      ) : (
                        <span className="inline-flex items-center font-semibold text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Ambient
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900">
                      £{ord.pricing_summary?.grand_total?.toFixed(2) || '0.00'}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-semibold text-slate-600">
                        {ord.shipments?.[0]?.carrier || 'DPD Express'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openOrderDrawer(ord)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        Inspect & Pack →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
