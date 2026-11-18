import React from 'react';
import {
  Users,
  Wallet,
  Package,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sliders
} from 'lucide-react';
import {
  Employee,
  ClientSite,
  PayrollRecord,
  StockItem,
  ClearanceRecord,
  LeaveRequest,
  OnboardingChecklist
} from '../../../types/hrm';
import { Division } from '../../../types/division';
import { DashboardMetricCard } from '../shared/DashboardMetricCard';
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
  onNavigateTab
}) => {
  const activeEmployees = employees.filter((e) => e.status !== 'Exited');
  const pendingLeave = leaveRequests.filter((r) => r.status === 'Pending');
  const openClearance = clearances.filter((r) => r.status === 'In Progress' || r.status === 'On Hold');
  const lowStock = stockItems.filter((i) => i.quantityInStock <= i.minReorderLevel);
  const newStaff = onboardingList.filter((p) => p.progressPercent < 100);
  const monthlyPay = payroll.reduce((sum, r) => sum + r.netPay, 0);
  const propertyValue = stockItems.reduce((sum, i) => sum + i.quantityInStock * i.unitCostETB, 0);
  const activeSites = sites.filter((s) => s.status === 'Active');

  const attentionItems = [
    { label: 'Pending Leave Requests', count: pendingLeave.length, tab: 'leave' },
    { label: 'Active Exit Clearances', count: openClearance.length, tab: 'clearance' },
    { label: 'Low Stock Threshold Items', count: lowStock.length, tab: 'store' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Enterprise KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Total Workforce"
          value={activeEmployees.length.toLocaleString()}
          note={`${newStaff.length} recruits onboarding`}
          actionLabel="View Team"
          onAction={() => onNavigateTab('management')}
          icon={Users}
          tone="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        />
        <DashboardMetricCard
          label="Monthly Pay Liability"
          value={`ETB ${monthlyPay.toLocaleString()}`}
          note={`${payroll.length} records processed`}
          actionLabel="View Payroll"
          onAction={() => onNavigateTab('payroll')}
          icon={Wallet}
          tone="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <DashboardMetricCard
          label="Store Assets Value"
          value={`ETB ${propertyValue.toLocaleString()}`}
          note={`${stockItems.length} catalog items`}
          actionLabel="View Store"
          onAction={() => onNavigateTab('store')}
          icon={Package}
          tone="bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <DashboardMetricCard
          label="Active Client Sites"
          value={activeSites.length.toLocaleString()}
          note={`${sites.length} total client contracts`}
          actionLabel="View Sites"
          onAction={() => onNavigateTab('deployment')}
          icon={MapPin}
          tone="bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        />
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkforceDistributionChart employees={activeEmployees} divisions={divisions} />
        <AttritionPieChart clearances={clearances} />
      </section>

      {/* Needs Attention & Quick System Actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Needs Attention Queue */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Needs Executive Attention</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              {pendingLeave.length + openClearance.length + lowStock.length} items flagged
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {attentionItems.map((item, idx) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className={`flex min-h-13 w-full items-center justify-between gap-4 px-4 text-left hover:bg-[#FCF0DA]/30 dark:hover:bg-slate-800/60 cursor-pointer ${
                  idx > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''
                }`}
              >
                <div>
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">{item.label}</span>
                  <span className="text-[11px] text-slate-500">
                    {item.count === 0 ? 'All clear — zero pending items' : `${item.count} items require sign-off`}
                  </span>
                </div>
                {item.count === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Security Audit & Master Config Launcher */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>System Health & Governance</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">RBAC Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('audit')}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#F2C46A] hover:bg-[#FCF0DA]/20 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Audit Trail Log</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Review user security logins, data mutations, and permission logs.</p>
              <span className="mt-3 text-[10.5px] font-bold text-[#4C4541] dark:text-[#F2C46A]">Open Audit Ledger →</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('master-setup')}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#F2C46A] hover:bg-[#FCF0DA]/20 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Master Config</span>
                <Sliders className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Statutory tax brackets, pension percentage, and credentials.</p>
              <span className="mt-3 text-[10.5px] font-bold text-[#4C4541] dark:text-[#F2C46A]">Open Master Setup →</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('divisions')}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#AEAC78] hover:bg-[#FCF0DA]/20 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Divisions</span>
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Manage security, cleaning, property and custom units.</p>
              <span className="mt-3 text-[10.5px] font-bold text-[#4C4541] dark:text-[#F2C46A]">View Divisions →</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('recruitment')}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#AEAC78] hover:bg-[#FCF0DA]/20 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Recruitment</span>
                <Users className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Candidate applicant pipeline and interview stages.</p>
              <span className="mt-3 text-[10.5px] font-bold text-[#4C4541] dark:text-[#F2C46A]">View Applicants →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
