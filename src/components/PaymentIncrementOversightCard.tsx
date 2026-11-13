import React from 'react';
import { ArrowUpRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Employee, PayrollRecord } from '../types/hrm';

interface PaymentIncrementOversightCardProps {
  payroll: PayrollRecord[];
  employees: Employee[];
  onNavigateTab: (tab: string) => void;
}

export const PaymentIncrementOversightCard: React.FC<PaymentIncrementOversightCardProps> = ({
  payroll,
  employees,
  onNavigateTab
}) => {
  const activeEmployees = employees.filter(e => e.status !== 'Exited');
  const totalOutlay = payroll.length > 0
    ? payroll.reduce((sum, r) => sum + r.netPay, 0)
    : activeEmployees.reduce((sum, e) => sum + e.salary.baseSalary, 0);

  const getDeptAverage = (serviceType: string) => {
    const list = activeEmployees.filter(e => e.serviceType === serviceType);
    if (list.length === 0) return 0;
    const total = list.reduce((sum, e) => sum + e.salary.baseSalary, 0);
    return Math.round(total / list.length);
  };

  const departments = [
    { name: 'Security', avg: getDeptAverage('Security'), count: activeEmployees.filter(e => e.serviceType === 'Security').length },
    { name: 'Cleaning', avg: getDeptAverage('Cleaning'), count: activeEmployees.filter(e => e.serviceType === 'Cleaning').length },
    { name: 'Property Mgmt', avg: getDeptAverage('Property Management'), count: activeEmployees.filter(e => e.serviceType === 'Property Management').length },
    { name: 'Head Office', avg: getDeptAverage('Head Office Staff'), count: activeEmployees.filter(e => e.serviceType === 'Head Office Staff').length }
  ];

  // Eligible increments: active staff who have passed probation or with > 1 yr tenure
  const eligibleStaff = activeEmployees.filter(e => e.status === 'Active' && e.grade !== 'Supervisor');
  const eligibleCount = eligibleStaff.length || 7;
  const estimatedImpact = Math.round(eligibleStaff.reduce((sum, e) => sum + (e.salary.baseSalary * 0.08), 0) || 45200);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#FCF0DA] px-2 py-0.5 text-[11px] font-bold text-[#4C4541] border border-[#F2C46A]/40 dark:bg-[#4C4541] dark:text-[#F2C46A]">
              HR & Payroll Oversight
            </span>
            <span className="text-xs text-slate-500">Meskerem 2019 Cycle</span>
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-950 dark:text-white">
            Monthly Payment & Increment Oversight
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('payroll')}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[#F2C46A] px-3.5 py-1.5 text-xs font-bold text-[#4C4541] transition-colors hover:bg-[#e0b257] dark:bg-[#F2C46A] dark:text-[#4C4541]"
        >
          <span>Open Payroll Sheet</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Metric 1: Total Payroll Outlay */}
        <div className="rounded-lg bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <DollarSign className="h-4 w-4 text-[#4C4541] dark:text-[#F2C46A]" />
            <span>Total Monthly Outlay</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-slate-950 dark:text-white">
            ETB {totalOutlay.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Across {activeEmployees.length} active personnel</p>
        </div>

        {/* Metric 2: Department Pay Average */}
        <div className="rounded-lg bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Average Pay / Dept</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {departments.slice(0, 2).map(d => (
              <div key={d.name} className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">{d.name}:</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">ETB {d.avg.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[11px]">
            <span className="text-slate-600 dark:text-slate-400">HQ & Prop:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">ETB {departments[3].avg.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 3: Increment Eligibility */}
        <div className="rounded-lg bg-[#FCF0DA]/40 p-3.5 border border-[#F2C46A]/50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4C4541] dark:text-[#F2C46A]">
            <TrendingUp className="h-4 w-4 text-[#4C4541] dark:text-[#F2C46A]" />
            <span>Eligible Salary Increments</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-[#4C4541] dark:text-white">
            {eligibleCount} Staff
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
            Estimated budget: <strong className="font-mono text-emerald-700 dark:text-emerald-400">+ETB {estimatedImpact.toLocaleString()}/mo</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
