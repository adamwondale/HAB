import React from 'react';
import { Division } from '../../types/division';

interface DivisionKpiCardsProps {
  divisions: Division[];
  activeCount: number;
  totalAssigned: number;
}

export const DivisionKpiCards: React.FC<DivisionKpiCardsProps> = ({
  divisions,
  activeCount,
  totalAssigned
}) => {
  const percent = divisions.length ? Math.round((activeCount / divisions.length) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Divisions</div>
        <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{divisions.length}</div>
        <div className="text-[11px] text-emerald-600 mt-1">{activeCount} currently active</div>
      </div>
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned Staff</div>
        <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{totalAssigned}</div>
        <div className="text-[11px] text-slate-500 mt-1">Across all operating units</div>
      </div>
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Coverage</div>
        <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{percent}%</div>
        <div className="text-[11px] text-slate-500 mt-1">Operational readiness</div>
      </div>
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Standard Basis</div>
        <div className="text-2xl font-bold font-mono text-[#4C4541] dark:text-[#F2C46A] mt-1">30 Days</div>
        <div className="text-[11px] text-slate-500 mt-1">Uniform payroll basis</div>
      </div>
    </div>
  );
};
