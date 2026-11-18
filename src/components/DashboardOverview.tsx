import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, LayoutDashboard } from 'lucide-react';
import {
  AttendanceRecord,
  Candidate,
  ClearanceRecord,
  ClientSite,
  Deployment,
  Employee,
  LeaveRequest,
  ManagementPerson,
  OnboardingChecklist,
  PayrollRecord,
  StockItem,
  StockTransaction,
  TransferPromotionRecord,
  WorkExperienceRecord
} from '../types/hrm';
import { Division } from '../types/division';
import { downloadCsv } from '../utils/csvExport';
import { DashboardRouter } from './dashboard/DashboardRouter';

interface DashboardOverviewProps {
  employees: Employee[];
  sites: ClientSite[];
  deployments: Deployment[];
  clearances: ClearanceRecord[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onboardingList: OnboardingChecklist[];
  payroll?: PayrollRecord[];
  candidates?: Candidate[];
  transfers?: TransferPromotionRecord[];
  workExperiences?: WorkExperienceRecord[];
  stockItems?: StockItem[];
  stockTransactions?: StockTransaction[];
  divisions?: Division[];
  activeUser?: ManagementPerson;
  managementPersons?: ManagementPerson[];
  onSelectActiveUser?: (user: ManagementPerson) => void;
  onNavigateTab: (tabId: string) => void;
  onQuickAction?: (action: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  employees,
  sites = [],
  deployments = [],
  attendance = [],
  clearances,
  leaveRequests,
  onboardingList,
  payroll = [],
  candidates = [],
  transfers = [],
  workExperiences = [],
  stockItems = [],
  stockTransactions = [],
  divisions,
  activeUser,
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const activeEmployees = employees.filter((e) => e.status !== 'Exited');
  const monthlyPay = payroll.reduce((total, r) => total + r.netPay, 0);
  const propertyValue = stockItems.reduce((total, i) => total + i.quantityInStock * i.unitCostETB, 0);

  const downloadSummary = () => {
    const fileDate = new Date().toISOString().slice(0, 10);
    downloadCsv(`HAB_Simple_Summary_${fileDate}.csv`, ['Area', 'Number', 'Note'], [
      ['Employees', activeEmployees.length, 'Active employee records'],
      ['Payroll', monthlyPay, 'Net pay in ETB'],
      ['Store supplies', propertyValue, 'Stock value in ETB'],
      ['Work Sites', sites.length, 'Active client contracts']
    ]);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Overview Header */}
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-[#4C4541] dark:text-[#F2C46A]" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {t('dashboard.headerTitle')}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t('dashboard.headerSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={downloadSummary}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#F2C46A] px-4 text-xs font-bold text-[#4C4541] hover:bg-[#E5B558] shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A]"
        >
          <FileDown className="h-4 w-4" /> {t('common.exportReport')}
        </button>
      </section>

      {/* Role-Specific Dashboard Router */}
      <DashboardRouter
        employees={employees}
        sites={sites}
        deployments={deployments}
        clearances={clearances}
        attendance={attendance}
        leaveRequests={leaveRequests}
        onboardingList={onboardingList}
        payroll={payroll}
        candidates={candidates}
        transfers={transfers}
        workExperiences={workExperiences}
        stockItems={stockItems}
        stockTransactions={stockTransactions}
        divisions={divisions}
        activeUser={activeUser}
        onNavigateTab={onNavigateTab}
      />

      <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
        {t('common.signedInAs')} <span className="font-semibold text-slate-700 dark:text-slate-300">{activeUser?.name || 'HAB Staff'}</span> ({activeUser?.role || 'staff'}).
      </p>
    </div>
  );
};
