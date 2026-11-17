import React, { useState } from 'react';
import { Search, Download, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { StockItem, ServiceType } from '../../types/hrm';
import { Division } from '../../types/division';
import { downloadCsv } from '../../utils/csvExport';

interface StockCatalogTableProps {
  stockItems: StockItem[];
  divisions?: Division[];
  canManage: boolean;
  onOpenAddItem: () => void;
  onOpenQuickTx: (item: StockItem, type: 'Issued (Out)' | 'Received (Restock)') => void;
}

export const StockCatalogTable: React.FC<StockCatalogTableProps> = ({
  stockItems,
  divisions,
  canManage,
  onOpenAddItem,
  onOpenQuickTx
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const divisionList = divisions && divisions.length > 0
    ? ['All', ...divisions.map((d) => d.name)]
    : ['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'];

  const categories = Array.from(new Set(stockItems.map((i) => i.category)));

  const filtered = stockItems.filter((item) => {
    if (selectedDivision !== 'All' && item.division !== selectedDivision) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.storageLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const filename = `HAB_Stock_Catalog_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Item Code', 'Item Name', 'Category', 'Division', 'Unit', 'In Stock', 'Min Reorder', 'Unit Cost ETB', 'Location', 'Returnable'];
    const rows = filtered.map((i) => [
      i.itemCode,
      i.name,
      i.category,
      i.division,
      i.unit,
      i.quantityInStock,
      i.minReorderLevel,
      i.unitCostETB,
      i.storageLocation,
      i.isReturnable ? 'Yes' : 'No'
    ]);
    downloadCsv(filename, headers, rows);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100">
            Store Inventory Catalog & Quantities
          </h2>
          <p className="text-xs text-slate-500">
            All stored equipment, consumables, and operational uniforms across divisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {canManage && (
            <button
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Catalog Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {divisionList.map((div) => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedDivision(div)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                selectedDivision === div
                  ? 'bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[820px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Item Details</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Division</th>
              <th className="py-2.5 px-3 text-right">In Stock</th>
              <th className="py-2.5 px-3 text-right">Min Level</th>
              <th className="py-2.5 px-3 text-right">Unit Cost</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3 text-center">Quick Move</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                  No catalog items found matching selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((i) => {
              const isLow = i.quantityInStock <= i.minReorderLevel;
              return (
                <tr key={i.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{i.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{i.itemCode}</div>
                  </td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{i.category}</td>
                  <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{i.division}</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-bold">
                    <span className={isLow ? 'text-rose-600 font-black' : 'text-slate-900 dark:text-slate-100'}>
                      {i.quantityInStock} {i.unit}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">{i.minReorderLevel}</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    ETB {i.unitCostETB.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{i.storageLocation}</td>
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenQuickTx(i, 'Issued (Out)')}
                        className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 cursor-pointer"
                        title="Issue Out"
                      >
                        Issue
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenQuickTx(i, 'Received (Restock)')}
                        className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 cursor-pointer"
                        title="Receive Restock"
                      >
                        Restock
                      </button>
                    </div>
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
