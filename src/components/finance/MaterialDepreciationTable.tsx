import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Search } from 'lucide-react';
import { downloadCsv } from '../../utils/csvExport';
import { MaterialAsset, INITIAL_MATERIALS } from './materialAssetData';

export const MaterialDepreciationTable: React.FC = () => {
  const { t } = useTranslation();
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
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t('payroll.depreciationTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('payroll.depreciationSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('payroll.exportCsv')}</span>
        </button>
      </div>

      {/* Valuation summary metrics - Calm eye friendly cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.totalAssetCost')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            ETB {totalCostBasis.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.totalAccumulatedDepr')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300 mt-1">
            -ETB {totalAccumulatedDepr.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {t('payroll.totalNetBookValue')}
          </span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
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
          placeholder={t('payroll.searchEquipment')}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Main Material Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px] border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold text-xs">
            <tr>
              <th className="py-2.5 px-3">{t('payroll.item')}</th>
              <th className="py-2.5 px-3">{t('payroll.productCode')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.unitPrice')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.quantity')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.totalGross')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.depreciationRate')}</th>
              <th className="py-2.5 px-3 text-right">{t('payroll.currentBookValue')}</th>
              <th className="py-2.5 px-3 text-center">{t('payroll.availability')}</th>
              <th className="py-2.5 px-3 text-center">{t('common.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{m.item}</div>
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
                        className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold cursor-pointer"
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
                      className="cursor-pointer hover:underline text-slate-700 dark:text-slate-300 font-medium"
                      title="Click to edit"
                    >
                      {m.productCode}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">ETB {m.price.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">{m.quantity}</td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">
                  ETB {m.totalCost.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                  {m.depreciationRatePct}%
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  ETB {m.currentBookValue.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {m.storeAvailability}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                      m.status === 'Active'
                        ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
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
