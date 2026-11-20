import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Employee,
  ClientSite,
  PayrollRecord,
  StockItem,
  ClearanceRecord,
  LeaveRequest,
  OnboardingChecklist,
  Candidate
} from '../../../types/hrm';
import { Division } from '../../../types/division';
import { ExecutiveCeoSummary } from '../ExecutiveCeoSummary';
import { WorkforceDistributionChart } from '../../WorkforceDistributionChart';
import { AttritionPieChart } from '../../AttritionPieChart';

interface AdminMasterDashboardProps {
  employees: Employee[];
  sites: ClientSite[];
  payroll?: PayrollRecord[];
  stockItems?: StockItem[];
  clearances: ClearanceRecord[];
  leaveRequests: LeaveRequest[];
  onboardingList: OnboardingChecklist[];
  divisions?: Division[];
  candidates?: Candidate[];
  onNavigateTab: (tabId: string) => void;
}

export const AdminMasterDashboard: React.FC<AdminMasterDashboardProps> = ({
  employees,
  sites,
  payroll = [],
  stockItems = [],
  clearances,
  leaveRequests,
  onboardingList,
  divisions,
  candidates = [],
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const activeEmployees = employees.filter((e) => e.status !== 'Exited');

  return (
    <div className="space-y-6">
      {/* Executive CEO Summary */}
      <ExecutiveCeoSummary
        employees={employees}
        sites={sites}
        payroll={payroll}
        stockItems={stockItems}
        clearances={clearances}
        candidates={candidates}
        onNavigateTab={onNavigateTab}
      />

      {/* Analytics Distribution Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkforceDistributionChart employees={activeEmployees} divisions={divisions} />
        <AttritionPieChart clearances={clearances} />
      </section>

      {/* Quick Administration */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('dashboard.sections.systemHealthGovernance')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <button
            type="button"
            onClick={() => onNavigateTab('audit')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-left hover:border-[#F2C46A] hover:bg-[#FCF0DA]/20 cursor-pointer transition-colors"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('masterSetup.auditLogs')}
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('masterSetup.auditLogsSubtitle')}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('master-setup')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-left hover:border-[#F2C46A] hover:bg-[#FCF0DA]/20 cursor-pointer transition-colors"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('masterSetup.title')}
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('masterSetup.subtitle')}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('divisions')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-left hover:border-[#AEAC78] hover:bg-[#FCF0DA]/20 cursor-pointer transition-colors"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('dashboard.sections.workforceDistribution')}
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('dashboard.sections.byOperationalDivision')}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('recruitment')}
            className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-left hover:border-[#AEAC78] hover:bg-[#FCF0DA]/20 cursor-pointer transition-colors"
          >
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('nav.recruitment')}
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('dashboard.metrics.onboardingInProgress')}
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
