'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { AdminMetricsCards } from '@/components/admin/AdminMetricsCards';
import { OrderWorkbench } from '@/components/admin/OrderWorkbench';
import { InventoryMatrix } from '@/components/admin/InventoryMatrix';
import { OrderSlideoutDrawer } from '@/components/admin/OrderSlideoutDrawer';
import { AdminKPIs } from '@/lib/dal/admin';
import { 
  Package, 
  Boxes, 
  Plane, 
  RotateCw, 
  Search, 
  Plus 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { activeTab, setActiveTab, orderSegment } = useAdminStore();
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [kpiRes, ordersRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch(`/api/admin/orders?status=${orderSegment}`)
      ]);

      const [kpiJson, ordersJson] = await Promise.all([
        kpiRes.json(),
        ordersRes.json()
      ]);

      if (kpiJson.success) setKpis(kpiJson.data);
      if (ordersJson.success) setOrders(ordersJson.data);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [orderSegment]);

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-extrabold text-2xl text-slate-900">
            Operations & Fulfillment Center
          </h1>
          <p className="text-xs text-slate-500">
            Live catalog controls, incoming flight arrivals, and cold-chain order packing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main View Switcher */}
          <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-brand-deep shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-brand-deep shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Inventory Control</span>
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh dashboard metrics"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminMetricsCards kpis={kpis} isLoading={isLoading && !kpis} />

      {/* Main Workbench View */}
      {activeTab === 'orders' && (
        <OrderWorkbench 
          orders={orders} 
          isLoading={isLoading} 
          onRefresh={fetchDashboardData} 
        />
      )}

      {/* Inventory Spreadsheet Grid */}
      {activeTab === 'inventory' && (
        <InventoryMatrix />
      )}

      {/* Slideout Inspection Drawer */}
      <OrderSlideoutDrawer onStatusUpdated={fetchDashboardData} />

    </div>
  );
}
