import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { StockItem, StockTransaction, ClientSite, Employee } from '../../../types/hrm';

interface StoreDashboardProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  sites?: ClientSite[];
  employees?: Employee[];
  onNavigateTab: (tabId: string) => void;
}

const ALLOCATION_BREAKDOWN = [
  { label: 'Central Store Available', percent: 65, value: 'ETB 2,275,000', color: 'bg-emerald-500' },
  { label: 'Issued Site Equipment & Gear', percent: 25, value: 'ETB 875,000', color: 'bg-slate-500' },
  { label: 'Fixed Capital Assets & Tools', percent: 10, value: 'ETB 350,000', color: 'bg-blue-500' }
];

const FAST_MOVING_BY_SITE = [
  { id: 'fms-1', site: 'Bole Medhanialem Tower', item: 'Heavy Duty Wet Mops & Squeegees', monthlyQty: '48 units', freq: 'Weekly', urgency: 'Normal' },
  { id: 'fms-2', site: 'Kazanchis Business Center', item: 'Disinfectant Multi-Surface Detergent', monthlyQty: '120 Liters', freq: 'Bi-Weekly', urgency: 'Urgent' },
  { id: 'fms-3', site: 'CMC Residential Complex', item: 'Heavy-Duty Flashlight D-Batteries', monthlyQty: '64 packs', freq: 'Monthly', urgency: 'Low' },
  { id: 'fms-4', site: 'Sarbet Substation Site', item: 'Security Guard High-Vis Patrol Vests', monthlyQty: '16 units', freq: 'Bi-Monthly', urgency: 'Normal' }
];

export const StoreDashboard: React.FC<StoreDashboardProps> = ({
  stockItems = [],
  onNavigateTab
}) => {
  const totalUnits = stockItems.reduce((sum, item) => sum + item.quantityInStock, 0) || 14850;
  const totalValuation = stockItems.reduce((sum, item) => sum + item.quantityInStock * item.unitCostETB, 0) || 3500000;
  const lowStockItems = stockItems.filter((item) => item.quantityInStock <= item.minReorderLevel);
  const [restockNotice, setRestockNotice] = useState<string | null>(null);

  const fallbackAlerts = [
    { id: 'mb-1', code: 'CLN-04', name: 'Industrial Cotton Mops (Dry & Wet)', category: 'Cleaning Supplies', qty: 4, min: 25, unit: 'pcs' },
    { id: 'mb-2', code: 'MNT-12', name: 'Machinery Servicing Grease & Sealant', category: 'Maintenance Tools', qty: 2, min: 15, unit: 'tins' },
    { id: 'mb-3', code: 'SEC-08', name: 'Rechargeable LED Patrol Torches', category: 'Security Gear', qty: 6, min: 20, unit: 'units' },
    { id: 'mb-4', code: 'SAF-02', name: 'Steel-Toe Guard Boots (Size 42)', category: 'Uniforms & PPE', qty: 3, min: 18, unit: 'pairs' }
  ];

  const activeAlertList = lowStockItems.length > 0
    ? lowStockItems.map(i => ({ id: i.id, code: i.itemCode, name: i.name, category: i.category, qty: i.quantityInStock, min: i.minReorderLevel, unit: i.unit }))
    : fallbackAlerts;

  const handleRestock = (itemName: string) => {
    setRestockNotice(`Procurement requisition triggered for ${itemName}.`);
    setTimeout(() => setRestockNotice(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Store inventory & asset operations
          </h1>
          <p className="text-xs text-slate-500">Central warehouse stock levels, field allocations, and minimum threshold alerts</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab('store')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer hover:bg-slate-50"
        >
          <span>Warehouse Catalog ({stockItems.length || 28} SKUs)</span>
        </button>
      </div>

      {restockNotice && (
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{restockNotice}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total in stock</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {totalUnits.toLocaleString()} <span className="text-xs font-normal">units</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Central warehouse</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Issued gear</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            4,620 <span className="text-xs font-normal">units</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Deployed at 18 client sites</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Supplies valuation</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            ETB {totalValuation.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Total inventory value</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Low stock alert</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 dark:text-rose-400 mt-1">
            {activeAlertList.length} <span className="text-xs font-normal">items</span>
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 block">Below reorder minimum</span>
        </div>
      </div>

      {/* Stock Status & Allocation Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 text-xs shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Stock status & asset allocation breakdown</span>
          <span className="text-[10px] text-slate-400">Total Asset Pool: ETB 3.50M</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-1 bg-slate-100">
          {ALLOCATION_BREAKDOWN.map((b) => (
            <div key={b.label} style={{ width: `${b.percent}%` }} className={b.color} title={`${b.label}: ${b.percent}%`} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {ALLOCATION_BREAKDOWN.map((b) => (
            <div key={b.label} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${b.color} shrink-0`} />
              <div>
                <div className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-300">{b.label}</div>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{b.value} ({b.percent}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Stock Alert Table: Neutral Slate Header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs bg-white dark:bg-slate-900 shadow-xs">
        <div className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
          <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Minimum stock buffer alerts</span>
          <span className="text-[11px] text-slate-500 font-normal">Immediate restock recommended</span>
        </div>
        <table className="w-full text-left min-w-[650px]">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <tr>
              <th className="py-2 px-3">Item Code</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">In Store</th>
              <th className="py-2 px-3">Min Level</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeAlertList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-mono text-slate-400 font-semibold">{item.code}</td>
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{item.category}</td>
                <td className="py-2 px-3 font-mono font-bold text-rose-700">{item.qty} {item.unit}</td>
                <td className="py-2 px-3 font-mono text-slate-500">{item.min} {item.unit}</td>
                <td className="py-2 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRestock(item.name)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fast Moving Stock Items by Site */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs bg-white dark:bg-slate-900 shadow-xs">
        <div className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
          <span>Fast-moving consumables & stock items by site</span>
          <button type="button" onClick={() => onNavigateTab('store')} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5 font-medium text-xs">
            Stock Transfer History <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
        <table className="w-full text-left min-w-[650px]">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <tr>
              <th className="py-2 px-3">Work Site</th>
              <th className="py-2 px-3">Fast-Moving Item</th>
              <th className="py-2 px-3">Monthly Run-Rate</th>
              <th className="py-2 px-3">Requisition Cadence</th>
              <th className="py-2 px-3 text-right">Restock Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {FAST_MOVING_BY_SITE.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{row.site}</td>
                <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{row.item}</td>
                <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{row.monthlyQty}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{row.freq}</td>
                <td className="py-2 px-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    row.urgency === 'Urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' :
                    row.urgency === 'Normal' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}>
                    {row.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
