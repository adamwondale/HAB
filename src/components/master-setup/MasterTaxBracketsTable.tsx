import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SystemMasterConfig, TaxBracketRule } from '../../types/masterConfig';

interface MasterTaxBracketsTableProps {
  masterConfig: SystemMasterConfig;
  canEditMaster: boolean;
  applyChange: (updater: (prev: SystemMasterConfig) => SystemMasterConfig) => void;
}

export const MasterTaxBracketsTable: React.FC<MasterTaxBracketsTableProps> = ({
  masterConfig,
  canEditMaster,
  applyChange
}) => {
  const handleAddBracket = () => {
    const newBracket: TaxBracketRule = {
      id: `tax-${Date.now()}`,
      label: `Bracket ${masterConfig.taxBrackets.length + 1}`,
      minIncome: 15000,
      maxIncome: null,
      ratePercent: 35,
      deductionConstant: 1500
    };
    applyChange(prev => ({
      ...prev,
      taxBrackets: [...prev.taxBrackets, newBracket]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100">
            Ethiopian Progressive Income Tax Brackets (ETB)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formula: <span className="font-mono">Tax = (Taxable Income × Rate%) − Deduction Constant</span>
          </p>
        </div>

        {canEditMaster && (
          <button
            type="button"
            onClick={handleAddBracket}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2C46A] text-[#4C4541] text-xs font-bold hover:bg-[#E5B558] transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#4C4541]" />
            <span>Add Tax Bracket</span>
          </button>
        )}
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Bracket Label</th>
              <th className="py-3 px-3 text-right">Min Income (ETB)</th>
              <th className="py-3 px-3 text-right">Max Income (ETB)</th>
              <th className="py-3 px-3 text-right">Tax Rate (%)</th>
              <th className="py-3 px-3 text-right">Deduction Constant (ETB)</th>
              {canEditMaster && <th className="py-3 px-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {masterConfig.taxBrackets.map((bracket, idx) => (
              <tr key={bracket.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                <td className="py-2.5 px-3">
                  <input
                    type="text"
                    disabled={!canEditMaster}
                    value={bracket.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      applyChange(prev => ({
                        ...prev,
                        taxBrackets: prev.taxBrackets.map((b, i) => (i === idx ? { ...b, label: val } : b))
                      }));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-medium text-slate-900 dark:text-slate-100 disabled:opacity-60"
                  />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    disabled={!canEditMaster}
                    value={bracket.minIncome}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      applyChange(prev => ({
                        ...prev,
                        taxBrackets: prev.taxBrackets.map((b, i) => (i === idx ? { ...b, minIncome: val } : b))
                      }));
                    }}
                    className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                  />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    placeholder="No Limit"
                    disabled={!canEditMaster}
                    value={bracket.maxIncome === null ? '' : bracket.maxIncome}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      const val = raw === '' ? null : Math.max(0, Number(raw) || 0);
                      applyChange(prev => ({
                        ...prev,
                        taxBrackets: prev.taxBrackets.map((b, i) => (i === idx ? { ...b, maxIncome: val } : b))
                      }));
                    }}
                    className="w-28 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                  />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={!canEditMaster}
                    value={bracket.ratePercent}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                      applyChange(prev => ({
                        ...prev,
                        taxBrackets: prev.taxBrackets.map((b, i) => (i === idx ? { ...b, ratePercent: val } : b))
                      }));
                    }}
                    className="w-20 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono font-bold tabular-nums text-xs text-rose-700 dark:text-rose-300 disabled:opacity-60"
                  />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    min={0}
                    disabled={!canEditMaster}
                    value={bracket.deductionConstant}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      applyChange(prev => ({
                        ...prev,
                        taxBrackets: prev.taxBrackets.map((b, i) => (i === idx ? { ...b, deductionConstant: val } : b))
                      }));
                    }}
                    className="w-24 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono tabular-nums text-xs text-slate-900 dark:text-slate-100 disabled:opacity-60"
                  />
                </td>
                {canEditMaster && (
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      disabled={masterConfig.taxBrackets.length <= 1}
                      onClick={() =>
                        applyChange(prev => ({
                          ...prev,
                          taxBrackets: prev.taxBrackets.filter((_, i) => i !== idx)
                        }))
                      }
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      title="Delete tax bracket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
