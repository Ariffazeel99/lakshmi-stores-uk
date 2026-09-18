'use client';

import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  Check, 
  Loader2, 
  ArrowUpDown, 
  Snowflake, 
  Plane, 
  AlertCircle 
} from 'lucide-react';

interface InventoryItem {
  productId: string;
  title: string;
  brand: string;
  sku: string;
  sizeOrWeight: string | null;
  temperatureClass: string;
  price: number;
  onHand: number;
  reserved: number;
  availableToSell: number;
  leadTime: string;
  updatedAt: string;
}

export const InventoryMatrix: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInventory = async (q?: string) => {
    setIsLoading(true);
    try {
      const url = q ? `/api/admin/inventory?q=${encodeURIComponent(q)}` : '/api/admin/inventory';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStartEdit = (item: InventoryItem) => {
    setEditingSku(item.sku);
    setEditPrice(item.price);
    setEditStock(item.onHand);
  };

  const handleSaveEdit = async (sku: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          price: editPrice,
          stockQuantity: editStock
        })
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.sku === sku
              ? {
                  ...i,
                  price: editPrice,
                  onHand: editStock,
                  availableToSell: Math.max(0, editStock - i.reserved)
                }
              : i
          )
        );
        setEditingSku(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      
      {/* Header & Live Filter Bar */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-brand-800" />
          <h3 className="font-serif font-bold text-base text-slate-900">
            Catalog & Rapid Inventory Control Matrix
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            ({items.length} SKUs in live grid)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInventory(searchQuery)}
              placeholder="Search SKU, produce, brand..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <button
            onClick={() => fetchInventory(searchQuery)}
            className="px-3 py-1.5 rounded-xl bg-brand-800 text-gold-400 text-xs font-bold hover:bg-brand-900 transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
            <tr>
              <th className="py-3 px-4">SKU / Code</th>
              <th className="py-3 px-4">Product & Variety</th>
              <th className="py-3 px-3">Class</th>
              <th className="py-3 px-3">Price (£)</th>
              <th className="py-3 px-3">Physical On-Hand</th>
              <th className="py-3 px-3 text-amber-700">In-Cart Reserved</th>
              <th className="py-3 px-3 text-emerald-800">Net ATS</th>
              <th className="py-3 px-3">Restock Lead</th>
              <th className="py-3 px-4 text-right">Inline Edit</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  Loading inventory matrix...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = editingSku === item.sku;
                const isLow = item.availableToSell <= 10;

                return (
                  <tr key={item.sku} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate leading-snug">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.brand} {item.sizeOrWeight ? `• ${item.sizeOrWeight}` : ''}</p>
                    </td>

                    <td className="py-3 px-3">
                      {item.temperatureClass === 'chilled' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          <Snowflake className="w-2.5 h-2.5 text-emerald-600" /> Chilled
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          Ambient
                        </span>
                      )}
                    </td>

                    {/* Price Cell */}
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-brand-500 rounded text-xs font-bold outline-none"
                        />
                      ) : (
                        <span className="font-bold text-slate-900">£{item.price.toFixed(2)}</span>
                      )}
                    </td>

                    {/* On-Hand Cell */}
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-brand-500 rounded text-xs font-bold outline-none"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{item.onHand}</span>
                      )}
                    </td>

                    {/* Reserved In-Cart */}
                    <td className="py-3 px-3 font-semibold text-amber-700">
                      {item.reserved > 0 ? `${item.reserved} held` : '0'}
                    </td>

                    {/* Net Available To Sell */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded ${
                        isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.availableToSell}
                        {isLow && <span className="text-[9px] uppercase tracking-wider font-black">LOW</span>}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-500 font-medium">
                      {item.leadTime}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={isSaving}
                            onClick={() => handleSaveEdit(item.sku)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSku(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-semibold text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="px-2 py-1 border border-slate-200 hover:border-brand-600 hover:text-brand-800 rounded-md font-bold text-[11px] text-slate-600 transition-colors cursor-pointer"
                        >
                          Edit ✎
                        </button>
                      )}
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
