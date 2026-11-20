import React from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react';

export interface ManagementNotificationRailProps {
  onNavigateTab: (tabId: string) => void;
  contractCount?: number;
  overdueInvoicesCount?: number;
  lowStockCount?: number;
  readyPayrollCount?: number;
  pendingClearancesCount?: number;
  activeSitesCount?: number;
}

export const ManagementNotificationRail: React.FC<ManagementNotificationRailProps> = ({
  onNavigateTab,
  contractCount = 2,
  overdueInvoicesCount = 3,
  lowStockCount = 4,
  readyPayrollCount = 1,
  pendingClearancesCount = 3,
  activeSitesCount = 14
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Operations notification rail
          </h3>
          <p className="text-[11px] text-slate-500">Three-tier operational monitor: Attention, Ready, and On track</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tier 1: Attention */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Attention
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono">
                {contractCount + overdueInvoicesCount + lowStockCount} Pending
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Contracts awaiting review</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-300">{contractCount} docs</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Overdue supplier invoices</span>
                <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">{overdueInvoicesCount} bills</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Critical minimum stock</span>
                <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">{lowStockCount} items</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-center"
            >
              Resolve Items
            </button>
          </div>
        </div>

        {/* Tier 2: Ready */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Ready for sign-off
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                {readyPayrollCount + pendingClearancesCount} Ready
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Approved payroll batch</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">ETB 2.48M</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Exit clearances</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{pendingClearancesCount} staff</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab('payroll')}
              className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 cursor-pointer transition-colors text-center shadow-xs dark:bg-slate-100 dark:text-slate-900"
            >
              Sign Off Payroll
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('clearance')}
              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Exits →
            </button>
          </div>
        </div>

        {/* Tier 3: On Track */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                On track
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono">
                Stable
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Active client site contracts</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{activeSitesCount} posts active</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Operational shift rotations</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">97.8% scheduled</span>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('deployment')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <span>View Deployed Sites</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
