import React from 'react';
import { Wallet, CreditCard, DollarSign, TrendingDown, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PayrollRecord, Employee, StockItem } from '../../../types/hrm';
import { DashboardMetricCard } from '../shared/DashboardMetricCard';
import { ChequeCashControlCard } from '../../finance/ChequeCashControlCard';

interface FinanceDashboardProps {
  payroll?: PayrollRecord[];
  employees?: Employee[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  payroll = [],
  stockItems = [],
  onNavigateTab
}) => {
  const totalNet = payroll.reduce((sum, r) => sum + r.netPay, 0);
  const totalGross = payroll.reduce((sum, r) => sum + r.grossPay, 0);
  const totalTax = payroll.reduce((sum, r) => sum + r.incomeTaxDeduction, 0);
  const totalPension7 = payroll.reduce((sum, r) => sum + r.pensionEmployeeDeduction, 0);
  const totalPension11 = payroll.reduce(
    (sum, r) => sum + (r.pensionEmployer11Percent || Math.round(r.earnedBaseSalary * 0.11)),
    0
  );
  const totalStatutory = totalTax + totalPension7 + totalPension11;
  const propertyValue = stockItems.reduce((sum, i) => sum + i.quantityInStock * i.unitCostETB, 0);

  const attentionItems = [
    { label: 'Monthly 30-Day Payroll Sheet Verification', note: 'Verify days & statutory rates', tab: 'payroll', action: 'Open Sheet' },
    { label: 'Bank Remittance Authorization', note: 'Commercial Bank of Ethiopia batch export', tab: 'payroll', action: 'Disburse' },
    { label: 'Store Asset Capital Valuation', note: 'Equipment depreciation & stock value', tab: 'store', action: 'Audit Assets' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Financial KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Net Payroll Disbursement"
          value={`ETB ${totalNet.toLocaleString()}`}
          note={`Gross ETB ${totalGross.toLocaleString()}`}
          actionLabel="View Sheet"
          onAction={() => onNavigateTab('payroll')}
          icon={Wallet}
          tone="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <DashboardMetricCard
          label="Statutory Tax & Pension"
          value={`ETB ${totalStatutory.toLocaleString()}`}
          note="ERCA & POESSA liabilities"
          actionLabel="Compliance"
          onAction={() => onNavigateTab('payroll')}
          icon={CreditCard}
          tone="bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
        />
        <DashboardMetricCard
          label="Store Assets Valuation"
          value={`ETB ${propertyValue.toLocaleString()}`}
          note={`${stockItems.length} inventory categories`}
          actionLabel="View Valuation"
          onAction={() => onNavigateTab('store')}
          icon={TrendingDown}
          tone="bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <DashboardMetricCard
          label="Cheque & Petty Cash"
          value="ETB 865,000"
          note="Active liquidity balance"
          actionLabel="Cash Register"
          onAction={() => onNavigateTab('payroll')}
          icon={DollarSign}
          tone="bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        />
      </section>

      {/* Cheque & Cash Liquidity Controls */}
      <section aria-label="Cheque and Cash Control Card">
        <ChequeCashControlCard />
      </section>

      {/* Statutory Breakdown & Needs Attention */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Statutory Tax Breakdown */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span>Statutory Compliance Summary</span>
              </h2>
              <p className="text-xs text-slate-500">Ethiopian Revenue & Social Security Agency obligations.</p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Compliant</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Employee Income Tax (Schedule 'A')</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">ETB {totalTax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Employee Pension (7% Mandatory)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">ETB {totalPension7.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Employer Pension (11% Company Cost)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">ETB {totalPension11.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-slate-100">Total Remittance Liability</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-300">ETB {totalStatutory.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Finance Actions & Checkpoints */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Finance Action Checkpoints</span>
              </h2>
              <p className="text-xs text-slate-500">Sign-offs and payroll batch verifications.</p>
            </div>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {attentionItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.note}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab(item.tab)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-[#FCF0DA] text-[#4C4541] hover:bg-[#F2C46A] transition-colors cursor-pointer"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
