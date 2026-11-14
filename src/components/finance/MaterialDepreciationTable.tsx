import React, { useState } from 'react';
import { TrendingDown, Download, Search } from 'lucide-react';
import { downloadCsv } from '../../utils/csvExport';
import { MaterialAsset, INITIAL_MATERIALS } from './materialAssetData';

export const MaterialDepreciationTable: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialAsset[]>(INITIAL_MATERIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [newCodeInput, setNewCodeInput] = useState('');

  const filtered = materials.filter(
    (m) =>
      m.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCostBasis = materials.reduce((sum, m) => sum + m.totalCost, 0);
  const totalAccumulatedDepr = materials.reduce((sum, m) => sum + m.accumulatedDepreciation, 0);
  const totalNetBookValue = materials.reduce((sum, m) => sum + m.currentBookValue, 0);

  const handleSaveProductCode = (id: string) => {
    if (!newCodeInput.trim()) return;
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, productCode: newCodeInput.trim().toUpperCase() } : m))
    );
    setEditingCodeId(null);
    setNewCodeInput('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Item',
      'Product Code',
      'Category',
      'Unit Price (ETB)',
      'Quantity',
      'Total Cost (ETB)',
      'Depreciation Rate (%)',
      'Accumulated Depreciation (ETB)',
      'Current Book Value (ETB)',
      'Store Availability',
      'Status'
    ];
    const rows = materials.map((m) => [
      m.item,
      m.productCode,
      m.category,
      m.price,
      m.quantity,
      m.totalCost,
      m.depreciationRatePct,
      m.accumulatedDepreciation,
      m.currentBookValue,
      m.storeAvailability,
      m.status
    ]);
    const filename = `HAB_Material_Depreciation_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsv(filename, headers, rows);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header and export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#F2C46A]" />
            <span>Material Depreciation & Valuation Over Time</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Straight-line asset wear tracking, product coding, and store stock integration
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCF0DA] hover:bg-[#F6E6C5] text-[#4C4541] text-xs font-bold border border-[#EFE7D8] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export to Excel (CSV)</span>
        </button>
      </div>

      {/* Valuation summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/60 p-3 rounded-lg border border-[#EFE7D8]">
          <span className="text-xs font-bold text-[#4C4541]/70 block">Total Asset Cost Basis</span>
          <div className="text-base font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-1">
            ETB {totalCostBasis.toLocaleString()}
          </div>
        </div>
        <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/80">
          <span className="text-xs font-bold text-rose-800 block">Accumulated Depreciation</span>
          <div className="text-base font-black font-mono tabular-nums text-rose-800 dark:text-rose-200 mt-1">
            -ETB {totalAccumulatedDepr.toLocaleString()}
          </div>
        </div>
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/80">
          <span className="text-xs font-bold text-emerald-800 block">Current Net Book Value</span>
          <div className="text-base font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-200 mt-1">
            ETB {totalNetBookValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by item name, product code, or category..."
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
        />
      </div>

      {/* Main Material Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Item & Category</th>
              <th className="py-2.5 px-3">Product Code</th>
              <th className="py-2.5 px-3 text-right">Price (Unit)</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3 text-right">Total Cost</th>
              <th className="py-2.5 px-3 text-right">Accumulated Depr.</th>
              <th className="py-2.5 px-3 text-right">Book Value</th>
              <th className="py-2.5 px-3 text-center">Store Avail.</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{m.item}</div>
                  <div className="text-[10px] text-slate-400">{m.category}</div>
                </td>
                <td className="py-2 px-3 font-mono">
                  {editingCodeId === m.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newCodeInput}
                        onChange={(e) => setNewCodeInput(e.target.value)}
                        placeholder="e.g. SEC-01"
                        className="w-24 px-1.5 py-0.5 border rounded uppercase text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveProductCode(m.id)}
                        className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        setEditingCodeId(m.id);
                        setNewCodeInput(m.productCode);
                      }}
                      className="cursor-pointer hover:underline text-[#4C4541] dark:text-slate-200 font-bold"
                      title="Click to edit product code"
                    >
                      {m.productCode}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">ETB {m.price.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-bold">{m.quantity}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">
                  ETB {m.totalCost.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums text-rose-600">
                  -ETB {m.accumulatedDepreciation.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                  ETB {m.currentBookValue.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]">
                    {m.storeAvailability} in store
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.status}
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
