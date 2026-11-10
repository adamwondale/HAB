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

type StatusTone = 'good' | 'warn' | 'quiet';

const statusStyles: Record<StatusTone, string> = {
  good: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  warn: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  quiet: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

function StatusBadge({ children, tone = 'quiet' }: { children: React.ReactNode; tone?: StatusTone }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[tone]}`}>
      {children}
    </span>
  );
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  employees,
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

  const reportDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const downloadSummary = () => {
    const fileDate = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `HAB_Simple_Summary_${fileDate}.csv`,
      ['Area', 'Number', 'Note'],
      [
        ['Employees', activeEmployees.length, 'Active employee records'],
        ['Payroll', monthlyPay, 'Net pay in ETB'],
        ['Store supplies', propertyValue, 'Stock value in ETB'],
        ['Needs attention', itemsToCheck, 'Open leave, clearance, and low stock items']
      ]
    );
  };

  const sharedRecords = activeEmployees.slice(0, 6).map(employee => {
    const pay = payroll.find(record => record.employeeId === employee.id);
    const clearance = clearances.find(record => record.employeeId === employee.id && record.status !== 'Completed');

    return {
      employee,
      payStatus: pay?.paymentStatus || 'Not added',
      propertyStatus: clearance && !clearance.storeAssetSignoff.completed ? 'Return due' : 'Up to date'
    };
  });

  return (
    <div className="space-y-8 pb-6">
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl">
            Overview
          </h1>
          <p className="mt-2 max-w-[65ch] text-sm leading-6 text-slate-600 dark:text-slate-300">
            See company status, workforce numbers, and pending items in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadSummary}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#F2C46A] px-4 text-sm font-semibold text-[#4C4541] transition-colors hover:bg-[#E5B558] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A] focus-visible:ring-offset-2 dark:bg-[#F2C46A] dark:text-[#4C4541]"
        >
          <FileDown className="h-4 w-4" />
          Download report
        </button>
      </section>

      <section aria-labelledby="company-summary-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="company-summary-title" className="text-base font-bold text-slate-950 dark:text-white">
              Company summary
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Updated {reportDate}</p>
          </div>
          <StatusBadge tone={itemsToCheck === 0 ? 'good' : 'warn'}>
            {itemsToCheck === 0 ? 'Everything is up to date' : `${itemsToCheck} items need attention`}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-1 border-y border-slate-200 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Employees', value: activeEmployees.length.toLocaleString(), note: `${newStaff.length} new staff in progress`, icon: Users },
            { label: 'Monthly pay', value: `ETB ${monthlyPay.toLocaleString()}`, note: `${payroll.length} payroll records`, icon: Wallet },
            { label: 'Store supplies', value: `ETB ${propertyValue.toLocaleString()}`, note: `${stockItems.length} stock items`, icon: Package },
            { label: 'Needs attention', value: itemsToCheck.toLocaleString(), note: 'Open work from all teams', icon: AlertTriangle }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`py-5 sm:px-5 ${index > 0 ? 'border-t border-slate-200 dark:border-slate-800 sm:border-t-0' : ''} ${index % 2 === 1 ? 'sm:border-l' : ''} ${index === 2 ? 'sm:border-t lg:border-l lg:border-t-0' : ''} ${index === 3 ? 'lg:border-l' : ''}`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </div>
                <div className="mt-3 font-mono text-xl font-bold tabular-nums text-slate-950 dark:text-white sm:text-2xl">
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-950 dark:text-white">One record, three teams</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Everyone sees the same employee information. This helps stop missing or different records.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-left text-xs">
                <thead>
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">HR record</th>
                    <th className="px-4 py-3">Pay record</th>
                    <th className="px-4 py-3">Store record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sharedRecords.map(({ employee, payStatus, propertyStatus }) => (
                    <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => onNavigateTab('management')}
                          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A]"
                        >
                          <span className="block font-semibold text-slate-950 dark:text-white">{employee.firstName} {employee.lastName}</span>
                          <span className="mt-0.5 block font-mono text-xs text-slate-500">{employee.employeeCode}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge tone={employee.status === 'Active' || employee.status === 'Probation' ? 'good' : employee.status === 'In Clearance' || employee.status === 'Suspended' ? 'warn' : 'quiet'}>
                          {employee.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge tone={payStatus === 'Not added' ? 'warn' : 'good'}>{payStatus}</StatusBadge></td>
                      <td className="px-4 py-3.5"><StatusBadge tone={propertyStatus === 'Return due' ? 'warn' : 'good'}>{propertyStatus}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4" aria-labelledby="attention-title">
          <div className="mb-4">
            <h2 id="attention-title" className="text-base font-bold text-slate-950 dark:text-white">Needs attention</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Finish these items first.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {[
              { label: 'Leave requests', count: pendingLeave.length, tab: 'leave' },
              { label: 'Employee clearances', count: openClearance.length, tab: 'clearance' },
              { label: 'Low stock items', count: lowStock.length, tab: 'store' }
            ].map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className={`flex min-h-16 w-full items-center justify-between gap-4 px-4 text-left transition-colors hover:bg-[#FCF0DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2C46A] dark:hover:bg-slate-800 ${index > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    {item.count === 0 ? 'No open items' : `${item.count} open ${item.count === 1 ? 'item' : 'items'}`}
                  </span>
                </span>
                {item.count === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Complete" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section aria-labelledby="team-work-title">
        <div className="mb-4">
          <h2 id="team-work-title" className="text-base font-bold text-slate-950 dark:text-white">Open a team workspace</h2>
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
              <button
                key={item.title}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="group flex min-h-36 flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-[#AEAC78] hover:bg-[#FCF0DA]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A] dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <Icon className="h-5 w-5 text-[#4C4541] dark:text-[#F2C46A]" aria-hidden="true" />
                <span className="mt-4 text-sm font-bold text-slate-950 dark:text-white">{item.title}</span>
                <span className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{item.text}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-[#4C4541] dark:text-[#F2C46A]">
                  {item.action}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Signed in as {activeUser?.name || 'HAB staff'}.
      </p>
    </div>
  );
};
