import React from 'react';
import { Package, AlertCircle, AlertTriangle, UserCheck, Layers, Coins } from 'lucide-react';
import { StockItem, StockTransaction } from '../../types/hrm';

interface InventoryDashboardKpisProps {
  stockItems: StockItem[];
  stockTransactions: StockTransaction[];
}

export const InventoryDashboardKpis: React.FC<InventoryDashboardKpisProps> = ({
  stockItems,
  stockTransactions
}) => {
  const totalSkus = stockItems.length;
  const totalStockQty = stockItems.reduce((acc, i) => acc + i.quantityInStock, 0);
  const outOfStockCount = stockItems.filter((i) => i.quantityInStock === 0).length;
  const lowStockCount = stockItems.filter((i) => i.quantityInStock > 0 && i.quantityInStock <= i.minReorderLevel).length;
  const totalValuation = stockItems.reduce((acc, i) => acc + i.quantityInStock * i.unitCostETB, 0);

  // Active in-field equipment count (issued items without a subsequent return)
  const issuedMovements = stockTransactions.filter((tx) => tx.transactionType === 'Issued (Out)');
  const activeInField = issuedMovements.filter((issue) => {
    const isReturned = stockTransactions.some(
      (tx) =>
        tx.transactionType === 'Returned (In)' &&
        tx.itemId === issue.itemId &&
        tx.recipientOrSource === issue.recipientOrSource &&
        tx.date >= issue.date
    );
    return !isReturned;
  }).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-[#4C4541]/70 dark:text-slate-400 text-[11px] font-bold">
          <Package className="w-3.5 h-3.5 text-[#F2C46A]" />
          <span>Catalog SKUs</span>
        </div>
        <div className="text-xl font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-1">
          {totalSkus}
        </div>
        <span className="text-[10px] text-slate-500">Across 7 categories</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 text-[11px] font-bold">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Total In Stock</span>
        </div>
        <div className="text-xl font-black font-mono tabular-nums text-blue-900 dark:text-blue-200 mt-1">
          {totalStockQty.toLocaleString()}
        </div>
        <span className="text-[10px] text-slate-500">Physical units count</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Low-Stock Alert</span>
        </div>
        <div className="text-xl font-black font-mono tabular-nums text-amber-900 dark:text-amber-300 mt-1">
          {lowStockCount}
        </div>
        <span className="text-[10px] text-slate-500">Below min. reorder</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-[11px] font-bold">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Out of Stock</span>
        </div>
        <div className="text-xl font-black font-mono tabular-nums text-rose-900 dark:text-rose-300 mt-1">
          {outOfStockCount}
        </div>
        <span className="text-[10px] text-slate-500">Requires urgent PO</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 text-[11px] font-bold">
          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>In-Field Gear</span>
        </div>
        <div className="text-xl font-black font-mono tabular-nums text-purple-900 dark:text-purple-300 mt-1">
          {activeInField}
        </div>
        <span className="text-[10px] text-slate-500">Assigned to staff</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
          <Coins className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stock Valuation</span>
        </div>
        <div className="text-lg font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-300 mt-1 truncate">
          ETB {totalValuation.toLocaleString()}
        </div>
        <span className="text-[10px] text-slate-500">Book inventory asset</span>
      </div>
    </div>
  );
};
