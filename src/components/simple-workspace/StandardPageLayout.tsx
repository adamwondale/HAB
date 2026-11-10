import React, { useState } from 'react';
import { FileDown, Search, X } from 'lucide-react';
import { CellTone, ModuleColumn, ModuleMetric, ModuleRow } from './types';
import { OPERATIONS_GUIDES } from './operationsGuideData';
import { PageOperationsGuide } from './PageOperationsGuide';

export interface StandardFilterOption {
  value: string;
  label: string;
}

export interface StandardPillItem {
  key: string;
  label: string;
  count?: number;
}

export interface StandardPageLayoutProps {
  title: string;
  description: string;
  metrics: [ModuleMetric, ModuleMetric, ModuleMetric];
  mainAction?: { label: string; onClick: () => void; isOpen?: boolean; icon?: React.ReactNode };
  inlineForm?: React.ReactNode;
  extraWidget?: React.ReactNode;
  guideKey?: string;
  search: { query: string; onChange: (query: string) => void; placeholder?: string };
  filter?: { value: string; onChange: (val: string) => void; label: string; options: StandardFilterOption[] };
  pillToggle?: { activeKey: string; onChange: (key: string) => void; items: StandardPillItem[] };
  columns: ModuleColumn[];
  rows: ModuleRow[];
  emptyMessage?: string;
  note?: string;
  onDownloadReport: () => void;
  children?: React.ReactNode;
}

const toneClasses: Record<CellTone, string> = {
  good: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
  warn: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
  bad: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
  quiet: 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
};

export const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({
  title,
  description,
  metrics,
  mainAction,
  inlineForm,
  extraWidget,
  guideKey,
  search,
  filter,
  pillToggle,
  columns,
  rows,
  emptyMessage = 'No records found.',
  note,
  onDownloadReport,
  children
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const guide = guideKey ? OPERATIONS_GUIDES[guideKey] : undefined;

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Page Header */}
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={onDownloadReport}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <FileDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
          Download report
        </button>
      </header>

      {/* 2. Operations Guide (Interactive In-App Button Guide) */}
      {guide && (
        <PageOperationsGuide
          guide={guide}
          isOpen={isGuideOpen}
          onToggle={() => setIsGuideOpen((prev) => !prev)}
        />
      )}

      {/* 3. Three Important Numbers */}
      <section aria-label={`${title} summary`} className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/50 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-4 sm:px-6">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{metric.value}</p>
          </div>
        ))}
      </section>

      {/* 4. Action Bar: Main Action + Search + Filter */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {mainAction && (
            <button
              type="button"
              onClick={mainAction.onClick}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0E1525] px-4 text-xs font-semibold text-[#FFF9DB] shadow-xs transition-colors hover:bg-[#19233C] dark:bg-[#EBE834] dark:text-[#0E1525] dark:hover:bg-[#FFF500]"
            >
              {mainAction.icon}
              {mainAction.isOpen ? 'Cancel' : mainAction.label}
            </button>
          )}

          {pillToggle && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              {pillToggle.items.map((item) => {
                const isActive = item.key === pillToggle.activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => pillToggle.onChange(item.key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-white font-semibold text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                    {item.count !== undefined && (
                      <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {filter && (
            <div className="w-full sm:w-auto">
              <label htmlFor="standard-filter" className="sr-only">{filter.label}</label>
              <select
                id="standard-filter"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs outline-none focus:border-[#0E1525] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={search.query}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder || 'Search records...'}
              className="min-h-10 w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-xs text-slate-950 outline-none placeholder:text-slate-400 focus:border-[#0E1525] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {search.query && (
              <button
                type="button"
                onClick={() => search.onChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. Inline Collapsible Action Form */}
      {inlineForm && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          {inlineForm}
        </section>
      )}

      {/* 6. Extra Widget Slot */}
      {extraWidget && <div>{extraWidget}</div>}

      {/* 7. Simple Records Table or Custom Children */}
      {children ? (
        children
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {rows.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{emptyMessage}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-900/75">
                    {columns.map((col) => (
                      <th key={col.key} className={`px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 ${col.numeric ? 'text-right' : ''}`}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      {columns.map((col) => {
                        const tone = row.tones?.[col.key];
                        return (
                          <td key={col.key} className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${col.numeric ? 'text-right font-mono tabular-nums' : ''}`}>
                            {tone ? (
                              <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${toneClasses[tone]}`}>
                                {row.values[col.key]}
                              </span>
                            ) : (
                              row.values[col.key]
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Note Banner */}
      {note && (
        <p className="rounded-lg border border-[#EFE1AA] bg-[#FFFDE8] px-4 py-2.5 text-xs text-[#0E1525] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {note}
        </p>
      )}
    </div>
  );
};
