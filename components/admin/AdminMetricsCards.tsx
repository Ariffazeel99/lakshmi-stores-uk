'use client';

import React from 'react';
import { AdminKPIs } from '@/lib/dal/admin';
import { 
  TrendingUp, 
  Package, 
  Plane, 
  AlertTriangle, 
  Snowflake, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Boxes 
} from 'lucide-react';

interface MetricsCardsProps {
  kpis: AdminKPIs | null;
  isLoading: boolean;
}

export const AdminMetricsCards: React.FC<MetricsCardsProps> = ({ kpis, isLoading }) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/70 rounded-2xl border border-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Financial & Velocity Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Gross Revenue / Velocity
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="font-serif font-black text-2xl text-slate-900">
                £{kpis.financial.grossRevenue.toFixed(2)}
              </h3>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +{kpis.financial.dailyChangePercent}%
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Net: <strong>£{kpis.financial.netRevenue.toFixed(2)}</strong></span>
          <span>AOV: <strong>£{kpis.financial.averageOrderValue.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* 2. Live Order Intake Funnel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fulfillment SLA Funnel
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="font-serif font-black text-2xl text-brand-deep">
                {kpis.fulfillment.totalUnfulfilled} Active
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                ({kpis.fulfillment.dispatched} Dispatched)
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
            <Package className="w-4 h-4 text-brand-800" />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
            <Snowflake className="w-3.5 h-3.5 text-emerald-600" />
            {kpis.fulfillment.chilledPrep} Chilled
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
            <Boxes className="w-3.5 h-3.5 text-slate-500" />
            {kpis.fulfillment.packing} Packing
          </span>
        </div>
      </div>

      {/* 3. Air Freight Batch Watch */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Inbound Air-Freight Batch
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="font-serif font-black text-lg text-slate-900 leading-tight">
                {kpis.inboundBatch.flightNumber.split(' ')[0]}
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                {kpis.inboundBatch.status}
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Plane className="w-4 h-4 text-amber-700" />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
          <p className="truncate font-medium">{kpis.inboundBatch.origin}</p>
          <div className="flex justify-between font-bold text-slate-700 mt-0.5">
            <span>{kpis.inboundBatch.receivedKgs} / {kpis.inboundBatch.totalKgs} kg</span>
            <span className="text-emerald-700">88% Received</span>
          </div>
        </div>
      </div>

      {/* 4. Critical Stock Alerts */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Safety Stock & Shelf Life
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="font-serif font-black text-2xl text-rose-700">
                {kpis.inventoryAlerts.criticalCount} SKUs Low
              </h3>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-rose-700 font-bold">
            {kpis.inventoryAlerts.chilledRiskCount} Fresh Risk
          </span>
          <span className="text-slate-500">
            {kpis.inventoryAlerts.ambientLeadCount} Reorder Pending
          </span>
        </div>
      </div>

    </div>
  );
};
