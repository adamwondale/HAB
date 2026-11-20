import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  note: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  tone?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  note,
  actionLabel = 'Open',
  onAction
}) => {
  return (
    <button
      type="button"
      onClick={onAction}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xs transition-colors hover:border-[#F2C46A] dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
        {onAction && (
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            {actionLabel}
          </span>
        )}
      </div>

      <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-slate-950 dark:text-white">
        {value}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 truncate">
        {note}
      </div>
    </button>
  );
};
