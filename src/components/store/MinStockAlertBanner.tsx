import React from 'react';
import { AlertTriangle, PackageCheck } from 'lucide-react';
import { StockItem } from '../../types/hrm';

interface MinStockAlertBannerProps {
  stockItems: StockItem[];
  onRestockClick?: (item: StockItem) => void;
}

export const MinStockAlertBanner: React.FC<MinStockAlertBannerProps> = ({ stockItems, onRestockClick }) => {
  const lowStockItems = stockItems.filter((item) => item.quantityInStock <= item.minReorderLevel);

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-medium">
          <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All store items are currently above their minimum safety stock thresholds.</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
          100% Healthy
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Minimum Stock Control Alert — {lowStockItems.length} item(s) below reorder threshold</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
          Action Required
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {lowStockItems.map((item) => {
          const deficit = item.minReorderLevel - item.quantityInStock;
          return (
            <div
              key={item.id}
              className="bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2.5 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {item.itemCode} · Stock: <span className="font-bold text-rose-600">{item.quantityInStock}</span> / Min: {item.minReorderLevel}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">
                  Deficit: -{deficit}
                </span>
                {onRestockClick && (
                  <button
                    type="button"
                    onClick={() => onRestockClick(item)}
                    className="text-[10px] font-bold text-[#4C4541] bg-[#F2C46A] hover:bg-[#E5B558] px-2 py-0.5 rounded cursor-pointer mt-0.5"
                  >
                    Restock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
