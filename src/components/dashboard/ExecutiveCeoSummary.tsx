import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Employee, ClientSite, Candidate, PayrollRecord, StockItem, ClearanceRecord } from '../../types/hrm';
import { ManagementNotificationRail } from './ManagementNotificationRail';
import { ExecutiveScorecardDrawer, ScorecardDepartment } from './ExecutiveScorecardDrawer';
import { loadClientInvoices, calculateARMetrics } from '../../utils/clientBillingStorage';

export interface ExecutiveCeoSummaryProps {
  employees: Employee[];
  sites?: ClientSite[];
  candidates?: Candidate[];
  payroll?: PayrollRecord[];
  stockItems?: StockItem[];
  clearances?: ClearanceRecord[];
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveCeoSummary: React.FC<ExecutiveCeoSummaryProps> = ({
  employees,
  sites = [],
  candidates = [],
  payroll = [],
  stockItems = [],
  clearances = [],
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<ScorecardDepartment>('hr');

  const activeStaffCount = employees.filter((e) => e.status !== 'Exited').length || 250;
  const activeSitesCount = sites.filter((s) => s.status === 'Active').length || 14;
  const lowStockCount = stockItems.filter((i) => i.quantityInStock <= i.minReorderLevel).length || 4;
  const pendingApprovalsCount =
    (clearances.filter((c) => c.status === 'In Progress' || c.status === 'On Hold').length || 3) +
    (lowStockCount > 0 ? 1 : 0);

  const clientInvoices = loadClientInvoices();
  const arMetrics = calculateARMetrics(clientInvoices);

  const openScorecard = (dept: ScorecardDepartment) => {
    setSelectedDept(dept);
    setIsScorecardOpen(true);
  };

  const departments: Array<{
    id: ScorecardDepartment;
    name: string;
    indicators: string;
    ragLabel: string;
    status: 'good' | 'warning';
  }> = [
    {
      id: 'hr',
      name: 'Human Resources (HR)',
      indicators: `${activeStaffCount} Staff | 96% Attendance | ETB 2.48M Payroll`,
      ragLabel: 'Normal',
      status: 'good'
    },
    {
      id: 'store',
      name: 'Store & Inventory',
      indicators: `ETB 3.42M Stock | 94.2% Availability | ${lowStockCount} Low stock`,
      ragLabel: 'Needs attention',
      status: 'warning'
    },
    {
      id: 'finance',
      name: 'Finance & Accounts',
      indicators: `ETB 8.15M Rev | ${arMetrics.collectionEfficiencyRate}% AR Coll. | ETB ${(arMetrics.totalOutstandingETB / 1000000).toFixed(2)}M Outst.`,
      ragLabel: arMetrics.totalOverdueETB > 0 ? 'AR Overdue' : 'Normal',
      status: arMetrics.totalOverdueETB > 0 ? 'warning' : 'good'
    },
    {
      id: 'operations',
      name: 'Site Operations',
      indicators: `${activeSitesCount} Active Sites | 95.2% Deployment | 97.8% Shift Rate`,
      ragLabel: 'Normal',
      status: 'good'
    }
  ];

  return (
    <div className="space-y-5">
      {/* 4 Headline Metric Cards - Plain typography, zero icon boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('dashboard.metrics.totalWorkforce')}
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {activeStaffCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            250 active staff
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('dashboard.sections.monthlyRevenue')}
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1">
            ETB 8,000,000
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            24.2% operating margin
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('dashboard.sections.activeContracts')}
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {activeSitesCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Fully deployed posts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('dashboard.sections.pendingApprovals')}
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400 mt-1">
            {pendingApprovalsCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dashboard.sections.requiresSignOff')}
          </p>
        </div>
      </div>

      {/* Management Notification Rail */}
      <ManagementNotificationRail
        onNavigateTab={onNavigateTab}
        lowStockCount={lowStockCount}
        activeSitesCount={activeSitesCount}
      />

      {/* Department Status Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t('dashboard.sections.departmentSummaryTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dashboard.sections.departmentSummarySubtitle')}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">{t('dashboard.sections.department')}</th>
                <th className="py-2.5 px-4">{t('dashboard.sections.indicators')}</th>
                <th className="py-2.5 px-4 text-center">{t('dashboard.sections.status')}</th>
                <th className="py-2.5 px-4 text-right">{t('dashboard.sections.scorecard')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{dept.name}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">{dept.indicators}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        dept.status === 'good'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {dept.ragLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openScorecard(dept.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      {t('dashboard.sections.viewDetails')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12-KPI Scorecard Drawer */}
      <ExecutiveScorecardDrawer
        isOpen={isScorecardOpen}
        department={selectedDept}
        onClose={() => setIsScorecardOpen(false)}
        onSelectDepartment={setSelectedDept}
      />
    </div>
  );
};

