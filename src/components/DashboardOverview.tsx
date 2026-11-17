import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileDown,
  Package,
  Users,
  Wallet
} from 'lucide-react';
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
import { downloadCsv } from '../utils/csvExport';
import { WorkforceDistributionChart } from './WorkforceDistributionChart';
import { AttritionPieChart } from './AttritionPieChart';
import { PaymentIncrementOversightCard } from './PaymentIncrementOversightCard';
import { SharedRecordsTable } from './SharedRecordsTable';
import { ExecutiveCeoSummary } from './dashboard/ExecutiveCeoSummary';
import { TechnicalManagerDashboard } from './dashboard/TechnicalManagerDashboard';

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
  activeUser?: ManagementPerson;
  managementPersons?: ManagementPerson[];
  onSelectActiveUser?: (user: ManagementPerson) => void;
  onNavigateTab: (tabId: string) => void;
  onQuickAction: (action: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  employees,
  sites = [],
  attendance = [],
  clearances,
  leaveRequests,
  onboardingList,
  payroll = [],
  candidates = [],
  stockItems = [],
  activeUser,
  onNavigateTab
}) => {
  const activeEmployees = employees.filter(employee => employee.status !== 'Exited');
  const pendingLeave = leaveRequests.filter(request => request.status === 'Pending');
  const openClearance = clearances.filter(record => record.status === 'In Progress' || record.status === 'On Hold');
  const lowStock = stockItems.filter(item => item.quantityInStock <= item.minReorderLevel);
  const newStaff = onboardingList.filter(person => person.progressPercent < 100);
  const monthlyPay = payroll.reduce((total, record) => total + record.netPay, 0);
  const propertyValue = stockItems.reduce((total, item) => total + item.quantityInStock * item.unitCostETB, 0);
  const itemsToCheck = pendingLeave.length + openClearance.length + lowStock.length;
  const isHrRole = !activeUser || activeUser.role === 'hr' || activeUser.role === 'super_admin' || activeUser.id.includes('hr');

  const downloadSummary = () => {
    const fileDate = new Date().toISOString().slice(0, 10);
    downloadCsv(`HAB_Simple_Summary_${fileDate}.csv`, ['Area', 'Number', 'Note'], [
      ['Employees', activeEmployees.length, 'Active employee records'],
      ['Payroll', monthlyPay, 'Net pay in ETB'],
      ['Store supplies', propertyValue, 'Stock value in ETB'],
      ['Needs attention', itemsToCheck, 'Open leave, clearance, and low stock items']
    ]);
  };

  const kpis = [
    { label: 'Employees', value: activeEmployees.length.toLocaleString(), note: `${newStaff.length} new in progress`, action: 'View Team', icon: Users, tab: 'management', tone: 'bg-slate-100 text-slate-800' },
    { label: 'Monthly pay', value: `ETB ${monthlyPay.toLocaleString()}`, note: `${payroll.length} payroll records`, action: 'View Payroll', icon: Wallet, tab: 'payroll', tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Store supplies', value: `ETB ${propertyValue.toLocaleString()}`, note: `${stockItems.length} stock items`, action: 'View Store', icon: Package, tab: 'store', tone: 'bg-amber-50 text-amber-800' },
    { label: 'Needs attention', value: itemsToCheck.toLocaleString(), note: 'Open tasks across units', action: 'Review Items', icon: AlertTriangle, tab: 'leave', tone: 'bg-rose-50 text-rose-700' }
  ];

  return (
    <div className="space-y-8 pb-6">
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl">Overview</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            See company status, workforce numbers, and pending items in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadSummary}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F2C46A] px-4 text-sm font-semibold text-[#4C4541] hover:bg-[#E5B558] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A]"
        >
          <FileDown className="h-4 w-4" /> Export Report
        </button>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigateTab(item.tab)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 text-left shadow-sm hover:border-[#F2C46A] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${item.tone}`}><Icon className="h-4 w-4" /></div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#4C4541] inline-flex items-center gap-0.5">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="mt-3 font-mono text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{item.value}</div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800 text-[11px]">
                <span className="text-slate-500 truncate">{item.note}</span>
                <span className="font-bold text-[#4C4541] dark:text-[#F2C46A]">{item.action}</span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Role-Specific Executive & Technical Dashboards */}
      {(activeUser?.role === 'executive' || activeUser?.role === 'super_admin') && (
        <section aria-labelledby="ceo-summary-title">
          <ExecutiveCeoSummary
            employees={activeEmployees}
            candidates={candidates}
            payroll={payroll}
            stockItems={stockItems}
            onNavigateTab={onNavigateTab}
          />
        </section>
      )}

      {(activeUser?.role === 'tech' || activeUser?.role === 'super_admin') && (
        <section aria-labelledby="tech-summary-title">
          <TechnicalManagerDashboard
            sites={sites}
            employees={activeEmployees}
            attendance={attendance}
            stockItems={stockItems}
            onNavigateTab={onNavigateTab}
          />
        </section>
      )}

      {/* Analytics Charts: Workforce Distribution alongside Attrition Analytics */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkforceDistributionChart employees={activeEmployees} />
        <AttritionPieChart clearances={clearances} />
      </section>

      {/* Monthly Payment & Increment Oversight (Visible to HR) */}
      {isHrRole && (
        <section aria-labelledby="hr-oversight-title">
          <PaymentIncrementOversightCard payroll={payroll} employees={employees} onNavigateTab={onNavigateTab} />
        </section>
      )}

      {/* One Record, Three Teams & Needs Attention */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-950 dark:text-white">One record, three teams</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Everyone sees the same employee information across HR, Payroll, and Property.</p>
          </div>
          <SharedRecordsTable employees={activeEmployees} payroll={payroll} clearances={clearances} onNavigateTab={onNavigateTab} />
        </div>

        <aside className="lg:col-span-4">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-950 dark:text-white">Needs attention</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Finish these items first.</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {[
              { label: 'Leave requests', count: pendingLeave.length, tab: 'leave' },
              { label: 'Employee clearances', count: openClearance.length, tab: 'clearance' },
              { label: 'Low stock items', count: lowStock.length, tab: 'store' }
            ].map((item, idx) => (
              <button key={item.label} type="button" onClick={() => onNavigateTab(item.tab)} className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left hover:bg-[#FCF0DA] dark:hover:bg-slate-800 ${idx > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                <span>
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{item.count === 0 ? 'No open items' : `${item.count} open ${item.count === 1 ? 'item' : 'items'}`}</span>
                </span>
                {item.count === 0 ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ArrowRight className="h-4 w-4 text-slate-500" />}
              </button>
            ))}
          </div>
        </aside>
      </section>

      {/* Team Workspaces */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Open a team workspace</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choose the work you want to do.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { title: 'HR', text: `${activeEmployees.length} employee records and ${candidates.length} job applicants`, action: 'View employees', tab: 'management', icon: Users },
            { title: 'Finance', text: `${payroll.length} pay records for this month`, action: 'View payroll', tab: 'payroll', icon: Wallet },
            { title: 'Property', text: `${stockItems.length} stock items and ${lowStock.length} low items`, action: 'View property', tab: 'store', icon: Package }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.title} type="button" onClick={() => onNavigateTab(item.tab)} className="group flex min-h-32 flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left hover:border-[#AEAC78] hover:bg-[#FCF0DA]/30 dark:border-slate-800 dark:bg-slate-900">
                <Icon className="h-5 w-5 text-[#4C4541] dark:text-[#F2C46A]" />
                <span className="mt-3 text-sm font-bold text-slate-950 dark:text-white">{item.title}</span>
                <span className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.text}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-[#4C4541] dark:text-[#F2C46A]">
                  {item.action} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as {activeUser?.name || 'HAB staff'}.</p>
    </div>
  );
};
