import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  note: string;
  actionLabel?: string;
  onAction?: () => void;
  icon: LucideIcon;
  tone?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  note,
  actionLabel = 'Open',
  onAction,
  icon: Icon,
  tone = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
}) => {
  return (
    <button
      type="button"
      onClick={onAction}
      className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 text-left shadow-xs transition-all hover:border-[#F2C46A] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${tone}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
        </div>
        {onAction && (
          <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#4C4541] dark:group-hover:text-[#F2C46A] inline-flex items-center gap-0.5">
            {actionLabel} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      <div className="mt-3 font-mono text-xl font-bold tabular-nums text-slate-950 dark:text-white sm:text-2xl">
        {value}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 truncate">{note}</span>
        <span className="font-bold text-[#4C4541] dark:text-[#F2C46A]">{actionLabel}</span>
      </div>
    </button>
  );
};
