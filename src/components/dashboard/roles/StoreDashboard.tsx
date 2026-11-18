import React from 'react';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownLeft, RotateCcw, Layers, UserCheck } from 'lucide-react';
import { StockItem, StockTransaction, ClientSite, Employee } from '../../../types/hrm';
import { DashboardMetricCard } from '../shared/DashboardMetricCard';

interface StoreDashboardProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
  sites?: ClientSite[];
  employees?: Employee[];
  onNavigateTab: (tabId: string) => void;
}

export const StoreDashboard: React.FC<StoreDashboardProps> = ({
  stockItems = [],
  stockTransactions = [],
  onNavigateTab
}) => {
  const totalSkus = stockItems.length;
  const totalUnits = stockItems.reduce((sum, item) => sum + item.quantityInStock, 0);
  const lowStockItems = stockItems.filter((item) => item.quantityInStock <= item.minReorderLevel && item.quantityInStock > 0);
  const outOfStockItems = stockItems.filter((item) => item.quantityInStock === 0);
  const recentTransactions = [...stockTransactions].slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Top Store Operational KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Catalog SKUs"
          value={totalSkus.toLocaleString()}
          note="Across 7 supply categories"
          actionLabel="View Catalog"
          onAction={() => onNavigateTab('store')}
          icon={Layers}
          tone="bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <DashboardMetricCard
          label="Physical Units in Store"
          value={totalUnits.toLocaleString()}
          note="Central warehouse inventory"
          actionLabel="Movements"
          onAction={() => onNavigateTab('store')}
          icon={Package}
          tone="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <DashboardMetricCard
          label="Low Stock Warning"
          value={lowStockItems.length.toLocaleString()}
          note="Below reorder threshold"
          actionLabel="Restock List"
          onAction={() => onNavigateTab('store')}
          icon={AlertTriangle}
          tone="bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <DashboardMetricCard
          label="Out of Stock Items"
          value={outOfStockItems.length.toLocaleString()}
          note="Depleted stock lines"
          actionLabel="Order Supplies"
          onAction={() => onNavigateTab('store')}
          icon={RotateCcw}
          tone="bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        />
      </section>

      {/* Critical Stock Alerts & Recent Log */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Low Stock Items Requiring Restock */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Restock Action Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Items reaching or below critical buffer stock.</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {lowStockItems.length + outOfStockItems.length} Urgent
            </span>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {[...outOfStockItems, ...lowStockItems].slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.itemCode} · Current: <span className="font-bold text-rose-600">{item.quantityInStock} {item.unit}</span> (Min: {item.minReorderLevel})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('store')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#FCF0DA] text-[#4C4541] hover:bg-[#F2C46A] transition-colors cursor-pointer"
                >
                  <ArrowDownLeft className="h-3 w-3" /> Restock
                </button>
              </div>
            ))}
            {lowStockItems.length === 0 && outOfStockItems.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">All inventory items are above buffer thresholds.</div>
            )}
          </div>
        </div>

        {/* Recent Daily Movements */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-[#F2C46A]" />
                <span>Recent Stock Movements</span>
              </h2>
              <p className="text-xs text-slate-500">Latest material issue, receive, and returns.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="text-xs font-bold text-[#4C4541] hover:underline dark:text-[#F2C46A] cursor-pointer"
            >
              Full Log →
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 text-xs">
                <div className="truncate pr-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{tx.itemName}</div>
                  <div className="text-[10.5px] text-slate-500">
                    {tx.transactionType} · {tx.date} · {tx.recipientOrSource || 'Central Store'}
                  </div>
                </div>
                <span className="font-mono font-bold shrink-0 text-slate-800 dark:text-slate-200">
                  {tx.quantity} {tx.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
