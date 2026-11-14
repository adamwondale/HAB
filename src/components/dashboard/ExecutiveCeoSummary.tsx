import React from 'react';
import { Eye, Users, Wallet, Package, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { Employee, Candidate, PayrollRecord, StockItem } from '../../types/hrm';

interface ExecutiveCeoSummaryProps {
  employees: Employee[];
  candidates?: Candidate[];
  payroll?: PayrollRecord[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveCeoSummary: React.FC<ExecutiveCeoSummaryProps> = ({
  employees,
  candidates = [],
  payroll = [],
  stockItems = [],
  onNavigateTab
}) => {
  // Recruitment calculations
  const totalApplicants = candidates.length;
  const inPipeline = candidates.filter(
    (c) => c.stage !== 'Onboarded' && c.stage !== 'Rejected'
  ).length;
  const probationStaff = employees.filter((e) => e.status === 'Probation').length;
  const finishedProbation = employees.filter((e) => e.status === 'Active').length;

  // Finance calculations
  const totalGrossPayroll = payroll.reduce((sum, p) => sum + p.grossPay, 0);
  const totalNetPayroll = payroll.reduce((sum, p) => sum + p.netPay, 0);
  const totalTaxAndPension = payroll.reduce(
    (sum, p) =>
      sum +
      p.incomeTaxDeduction +
      p.pensionEmployeeDeduction +
      (p.pensionEmployer11Percent || Math.round(p.earnedBaseSalary * 0.11)),
    0
  );

  // Store calculations
  const totalAssetValuation = stockItems.reduce(
    (sum, i) => sum + i.quantityInStock * i.unitCostETB,
    0
  );
  const lowStockCount = stockItems.filter((i) => i.quantityInStock <= i.minReorderLevel).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F2C46A]" />
            <span>CEO & General Manager Executive Overview</span>
          </h2>
          <p className="text-xs text-slate-500">
            High-level executive observatory across Recruitment, Finance, and Store operations
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8] px-2.5 py-1 rounded-full">
          Executive Read-Only
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Recruitment General */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                Recruitment General
              </span>
              <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-bold">
                {totalApplicants} Candidates
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Active in Pipeline:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{inPipeline}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Probation Stage:</span>
                <span className="font-mono font-bold text-amber-700">{probationStaff}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Finished Probation:</span>
                <span className="font-mono font-bold text-emerald-700">{finishedProbation}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('recruitment')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FCF0DA] cursor-pointer transition-colors"
          >
            <span>Review Recruitment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 2: Finance General */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Finance General
              </span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {payroll.length} Disbursed
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Gross Payroll Commitment:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                  ETB {totalGrossPayroll.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Tax & Pension Remittance:</span>
                <span className="font-mono tabular-nums font-bold text-indigo-700">
                  ETB {totalTaxAndPension.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Net Take-Home Pay:</span>
                <span className="font-mono tabular-nums font-bold text-emerald-700">
                  ETB {totalNetPayroll.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('payroll')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FCF0DA] cursor-pointer transition-colors"
          >
            <span>Review Financials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pillar 3: Store General */}
        <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                Store General
              </span>
              <span className="text-[11px] font-mono text-amber-800 dark:text-amber-300 font-bold">
                {stockItems.length} SKUs
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Asset & Gear Valuation:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                  ETB {totalAssetValuation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Low-Stock Alert Items:</span>
                <span className="font-mono font-bold text-rose-600">{lowStockCount} items</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Supply Health Status:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {lowStockCount === 0 ? 'Optimal' : `${lowStockCount} Need Restock`}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('store')}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FCF0DA] cursor-pointer transition-colors"
          >
            <span>Review Store Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
