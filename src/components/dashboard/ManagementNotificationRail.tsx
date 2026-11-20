import React from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, Clock, FileText, Package, Wallet } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]">
            <Clock className="w-4 h-4 text-[#F2C46A]" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#4C4541] dark:text-slate-100 uppercase tracking-wider">
              Management Notification Triage Rail
            </h3>
            <p className="text-[11px] text-slate-500">Executive tri-tier monitoring: Attention, Sign-off, and Operations</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Wireframe Parity (Img 8)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tier 1: Attention */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Attention
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-mono">
                {contractCount + overdueInvoicesCount + lowStockCount} Pending
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40 dark:border-amber-900/30">
                <span className="text-slate-600 dark:text-slate-400">Contracts awaiting review</span>
                <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{contractCount} docs</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40 dark:border-amber-900/30">
                <span className="text-slate-600 dark:text-slate-400">Overdue supplier invoices</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">{overdueInvoicesCount} bills</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Critical minimum stock</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">{lowStockCount} items</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:bg-[#FCF0DA] cursor-pointer transition-colors text-center"
            >
              Resolve Items
            </button>
          </div>
        </div>

        {/* Tier 2: Ready */}
        <div className="rounded-xl border border-[#F2C46A]/60 bg-[#FCF0DA]/30 dark:border-amber-800/40 dark:bg-slate-800/50 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4C4541] dark:text-amber-200">
                <FileText className="w-4 h-4 text-[#F2C46A]" />
                Ready for Sign-Off
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F2C46A] text-[#4C4541] font-mono">
                {readyPayrollCount + pendingClearancesCount} Ready
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Approved payroll batch</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">ETB 2.48M (Meskerem)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Exit / probation clearances</span>
                <span className="font-mono font-bold text-[#4C4541] dark:text-[#F2C46A]">{pendingClearancesCount} staff</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab('payroll')}
              className="flex-1 py-1.5 rounded-lg bg-[#F2C46A] text-[#4C4541] font-bold text-[11px] hover:bg-[#e0b55b] cursor-pointer transition-colors text-center shadow-xs"
            >
              Sign Off Payroll
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('clearance')}
              className="py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FCF0DA] cursor-pointer transition-colors"
            >
              Exits →
            </button>
          </div>
        </div>

        {/* Tier 3: On Track */}
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                On Track
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 font-mono">
                Stable
              </span>
            </div>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-emerald-200/40 dark:border-emerald-900/30">
                <span className="text-slate-600 dark:text-slate-400">Active client site contracts</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{activeSitesCount} posts active</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Operational shift rotations</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">97.8% scheduled</span>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('deployment')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <span>View Deployed Sites</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
