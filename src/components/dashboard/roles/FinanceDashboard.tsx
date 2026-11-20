import React, { useState } from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import { PayrollRecord, Employee, StockItem } from '../../../types/hrm';
import { FinanceSettingsModal } from '../../finance/FinanceSettingsModal';

interface FinanceDashboardProps {
  payroll?: PayrollRecord[];
  employees?: Employee[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

const MONTHLY_TREND = [
  { month: 'Hamle', rev: 7.2, exp: 5.6 },
  { month: 'Nehase', rev: 7.5, exp: 5.8 },
  { month: 'Meskerem', rev: 7.8, exp: 6.0 },
  { month: 'Tikimt', rev: 8.0, exp: 6.2 },
  { month: 'Hidar', rev: 8.2, exp: 6.3 },
  { month: 'Tahsas', rev: 8.5, exp: 6.4 }
];

const EXPENSE_CATEGORIES = [
  { name: 'Salary & Benefits', percent: 42, amount: '2.60M', color: 'bg-emerald-500' },
  { name: 'Office & Facility Rent', percent: 18, amount: '1.12M', color: 'bg-blue-500' },
  { name: 'Store Consumables & Gear', percent: 14, amount: '0.87M', color: 'bg-amber-500' },
  { name: 'Equipment Maintenance', percent: 12, amount: '0.74M', color: 'bg-slate-500' },
  { name: 'Utilities & Power', percent: 8, amount: '0.50M', color: 'bg-indigo-500' },
  { name: 'Transport & Logistics', percent: 6, amount: '0.37M', color: 'bg-rose-500' }
];

const FINANCE_ALERTS = [
  { id: 'fa-1', title: 'Supplier payment overdue (45 days)', desc: 'Bole Safety Gear Ltd - ETB 185,000 for uniform batch', tone: 'rose', due: 'Past Due' },
  { id: 'fa-2', title: 'Customer invoice overdue (60 days)', desc: 'Addis Commercial Center - ETB 420,000 outstanding balance', tone: 'amber', due: 'Urgent Action' },
  { id: 'fa-3', title: 'Monthly ERCA VAT declaration', desc: '15% VAT filing deadline in 4 days; records verified', tone: 'indigo', due: 'Nov 25' },
  { id: 'fa-4', title: 'Tikimt payroll bank batch status', desc: 'Approved; ready for CBE commercial banking remittance', tone: 'emerald', due: 'Ready' }
];

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  stockItems = [],
  onNavigateTab
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const storeStockValuation = stockItems.reduce((sum, i) => sum + i.quantityInStock * i.unitCostETB, 0) || 3500000;

  return (
    <div className="space-y-4">
      {/* Top Header & Settings CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Finance & corporate ledger
          </h1>
          <p className="text-xs text-slate-500">Revenue, expenditure run-rates, statutory taxes, and liquidity checkpoints</p>
        </div>
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Statutory Tax & Policy Settings</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total revenue</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">ETB 8,000,000</div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">+11.2% vs target</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Operating expense</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">ETB 6,200,000</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Budget utilization at 92%</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Operating profit</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1">ETB 1,800,000</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">22.5% margin</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Store supplies value</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">ETB {storeStockValuation.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Total supplies in field</span>
        </div>
      </div>

      {/* AP & AR Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accounts receivable (AR)</div>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">ETB 2,000,000</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Collection efficiency: <strong className="text-emerald-600">88%</strong> (ETB 1.76M collected)</div>
          </div>
          <button type="button" onClick={() => onNavigateTab('payroll')} className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer">Invoices</button>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Accounts payable (AP)</div>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">ETB 850,000</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Suppliers & contractors: 12 open vouchers</div>
          </div>
          <button type="button" onClick={() => onNavigateTab('store')} className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer">Disburse</button>
        </div>
      </div>

      {/* Monthly Revenue vs Expense Trend & Operational Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Monthly revenue vs expense trend (M ETB)</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-700"><span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Revenue</span>
              <span className="flex items-center gap-1 font-semibold text-rose-700"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> Expense</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 items-end h-32 pt-2">
            {MONTHLY_TREND.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-24">
                  <div style={{ height: `${(m.rev / 10) * 100}%` }} className="w-3.5 bg-emerald-500 rounded-t-xs hover:opacity-80 transition-all" title={`Rev: ETB ${m.rev}M`} />
                  <div style={{ height: `${(m.exp / 10) * 100}%` }} className="w-3.5 bg-rose-500 rounded-t-xs hover:opacity-80 transition-all" title={`Exp: ETB ${m.exp}M`} />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2.5 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Operational expense breakdown</span>
          </div>
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 bg-slate-100">
            {EXPENSE_CATEGORIES.map(c => (
              <div key={c.name} style={{ width: `${c.percent}%` }} className={c.color} title={`${c.name}: ${c.percent}%`} />
            ))}
          </div>
          <div className="space-y-1.5 pt-1">
            {EXPENSE_CATEGORIES.map(c => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-2 h-2 rounded-full ${c.color} shrink-0`} />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 shrink-0">ETB {c.amount} ({c.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finance Alerts & Action Register */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-slate-900/40 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Finance risk & payment alerts</span>
          </div>
          <span className="text-[10px] text-slate-400">Automated ledger monitor</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {FINANCE_ALERTS.map(a => (
            <div key={a.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-[11.5px] text-slate-900 dark:text-slate-100">{a.title}</p>
                <p className="text-[10.5px] text-slate-500 mt-0.5">{a.desc}</p>
              </div>
              <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                a.tone === 'rose' ? 'bg-rose-100 text-rose-800' :
                a.tone === 'amber' ? 'bg-amber-100 text-amber-800' :
                a.tone === 'indigo' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {a.due}
              </span>
            </div>
          ))}
        </div>
      </div>

      <FinanceSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
