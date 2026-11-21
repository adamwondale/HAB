import React from 'react';
import { useTranslation } from 'react-i18next';

interface LeaveSummaryStatsProps {
  totalRequests: number;
  pendingCount: number;
  approvedCount: number;
  totalEmployees: number;
}

export const LeaveSummaryStats: React.FC<LeaveSummaryStatsProps> = ({
  totalRequests,
  pendingCount,
  approvedCount,
  totalEmployees
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-medium text-slate-500">{t('hr.allRecords')}</div>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
          {totalRequests}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-medium text-slate-500">{t('hr.waiting')}</div>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
          {pendingCount}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-medium text-slate-500">{t('hr.approved')}</div>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
          {approvedCount}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-medium text-slate-500">{t('hr.allEmployees')}</div>
        <div className="text-xl font-bold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
          {totalEmployees}
        </div>
      </div>
    </div>
  );
};
