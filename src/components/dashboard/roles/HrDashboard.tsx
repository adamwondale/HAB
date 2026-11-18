import React from 'react';
import { Users, UserPlus, Calendar, FileText, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Employee, Candidate, LeaveRequest, ClearanceRecord, OnboardingChecklist, PayrollRecord } from '../../../types/hrm';
import { Division } from '../../../types/division';
import { DashboardMetricCard } from '../shared/DashboardMetricCard';
import { WorkforceDistributionChart } from '../../WorkforceDistributionChart';
import { AttritionPieChart } from '../../AttritionPieChart';
import { PaymentIncrementOversightCard } from '../../PaymentIncrementOversightCard';

interface HrDashboardProps {
  employees: Employee[];
  candidates: Candidate[];
  leaveRequests: LeaveRequest[];
  clearances: ClearanceRecord[];
  onboardingList: OnboardingChecklist[];
  payroll?: PayrollRecord[];
  divisions?: Division[];
  onNavigateTab: (tabId: string) => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({
  employees,
  candidates,
  leaveRequests,
  clearances,
  onboardingList,
  payroll = [],
  divisions,
  onNavigateTab
}) => {
  const activeEmployees = employees.filter((e) => e.status !== 'Exited');
  const pendingLeave = leaveRequests.filter((r) => r.status === 'Pending');
  const openClearances = clearances.filter((r) => r.status === 'In Progress' || r.status === 'On Hold');
  const newStaff = onboardingList.filter((p) => p.progressPercent < 100);
  const activeCandidates = candidates.filter((c) => c.stage === 'Applied' || c.stage === 'Interview' || c.stage === 'Screened');

  const attentionItems = [
    { label: 'Pending Leave Approvals', count: pendingLeave.length, tab: 'leave', action: 'Review' },
    { label: 'Exit Clearances in Progress', count: openClearances.length, tab: 'clearance', action: 'Inspect' },
    { label: 'Recruits Completing Onboarding', count: newStaff.length, tab: 'onboarding', action: 'Track' },
    { label: 'Active Candidate Pipeline', count: activeCandidates.length, tab: 'recruitment', action: 'Shortlist' }
  ];

  return (
    <div className="space-y-6">
      {/* Top HR Operational KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Active Headcount"
          value={activeEmployees.length.toLocaleString()}
          note={`${employees.length - activeEmployees.length} exited records`}
          actionLabel="View Roster"
          onAction={() => onNavigateTab('management')}
          icon={Users}
          tone="bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <DashboardMetricCard
          label="Onboarding in Progress"
          value={newStaff.length.toLocaleString()}
          note="2-stage probation tracking"
          actionLabel="View Onboarding"
          onAction={() => onNavigateTab('onboarding')}
          icon={UserPlus}
          tone="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <DashboardMetricCard
          label="Pending Leave Requests"
          value={pendingLeave.length.toLocaleString()}
          note="Awaiting HR sign-off"
          actionLabel="Authorize"
          onAction={() => onNavigateTab('leave')}
          icon={Calendar}
          tone="bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <DashboardMetricCard
          label="Exit Clearances"
          value={openClearances.length.toLocaleString()}
          note="3-team signoff ledger"
          actionLabel="View Clearances"
          onAction={() => onNavigateTab('clearance')}
          icon={FileText}
          tone="bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        />
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkforceDistributionChart employees={activeEmployees} divisions={divisions} />
        <AttritionPieChart clearances={clearances} />
      </section>

      {/* Monthly Payment & Increment Oversight (HR Compensation Scope) */}
      <section aria-label="Monthly Payment & Increment Oversight">
        <PaymentIncrementOversightCard payroll={payroll} employees={employees} onNavigateTab={onNavigateTab} />
      </section>

      {/* HR Action Queue */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>HR Department Priority Queue</span>
            </h2>
            <p className="text-xs text-slate-500">Personnel dossiers, approvals, and employee transitions needing review.</p>
          </div>
          <span className="text-xs font-bold text-[#4C4541] dark:text-[#F2C46A]">
            {pendingLeave.length + openClearances.length + newStaff.length} Tasks
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {attentionItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${item.count > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-400'}`}>
                  {item.count > 0 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.count} items awaiting processing</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-[#FCF0DA] text-[#4C4541] hover:bg-[#F2C46A] transition-colors cursor-pointer"
              >
                <span>{item.action}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
