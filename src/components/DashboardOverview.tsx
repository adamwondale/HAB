import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Users, 
  MapPin, 
  Clock, 
  LogOut, 
  Calendar, 
  CreditCard, 
  Award, 
  ArrowRight, 
  CheckSquare,
  UserPlus,
  Package,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Employee, 
  ClientSite, 
  Deployment, 
  ClearanceRecord, 
  AttendanceRecord, 
  LeaveRequest, 
  OnboardingChecklist,
  PayrollRecord,
  Candidate,
  TransferPromotionRecord,
  WorkExperienceRecord,
  ManagementPerson,
  StockItem,
  StockTransaction
} from '../types/hrm';
import { getRoleConfig } from '../utils/roleConfig';

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

interface HabMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
  variant?: 'brand' | 'light-gold';
  className?: string;
}

const HabMetricCard: React.FC<HabMetricCardProps> = ({
  title,
  value,
  subtitle,
  onClick,
  variant = 'light-gold',
  className
}) => {
  const isLightGold = variant === 'light-gold';
  const defaultClasses = isLightGold
    ? "bg-[#FFF9DB] hover:bg-[#FFF4BF] dark:bg-slate-800/90 border border-[#EFE1AA] dark:border-slate-700 text-[#0E1525] dark:text-slate-100"
    : "bg-[#EBE834] hover:bg-[#E3E029] border border-[#D4D11E] text-[#0E1525]";

  return (
    <div
      onClick={onClick}
      className={className || `${defaultClasses} rounded-xl p-4 sm:p-5 cursor-pointer transition-colors flex flex-col justify-between min-h-[116px]`}
    >
      <div className="text-xs font-semibold text-[#0E1525]/75 dark:text-slate-300">
        {title}
      </div>
      <div className="my-2">
        <span className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${isLightGold ? 'text-[#0E1525] dark:text-[#FFF500]' : 'text-[#0E1525]'}`}>
          {value}
        </span>
      </div>
      {subtitle && (
        <div className="text-[11px] text-[#0E1525]/65 dark:text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  employees,
  sites,
  clearances,
  attendance,
  leaveRequests,
  onboardingList,
  payroll = [],
  candidates = [],
  workExperiences = [],
  stockItems = [],
  stockTransactions = [],
  activeUser,
  onNavigateTab
}) => {
  const roleConfig = getRoleConfig(activeUser);
  const [chartFilter, setChartFilter] = useState<'All' | 'Security' | 'Cleaning'>('All');
  const [executiveTab, setExecutiveTab] = useState<'summary' | 'inputs-outputs' | 'coverage'>('summary');

  // Common Calculations across all divisions
  const totalRequiredSec = sites.reduce((sum, s) => sum + s.securityStaffRequired, 0);
  const totalDeployedSec = sites.reduce((sum, s) => sum + s.securityStaffDeployed, 0);
  const totalRequiredCln = sites.reduce((sum, s) => sum + s.cleaningStaffRequired, 0);
  const totalDeployedCln = sites.reduce((sum, s) => sum + s.cleaningStaffDeployed, 0);

  const totalStaffRequired = totalRequiredSec + totalRequiredCln;
  const totalStaffDeployed = totalDeployedSec + totalDeployedCln;
  const overallFulfillmentRate = totalStaffRequired > 0 ? Math.round((totalStaffDeployed / totalStaffRequired) * 100) : 98;

  const pendingClearances = clearances.filter(c => c.status === 'In Progress');
  const presentAttendance = attendance.filter(a => a.status === 'Present' || a.status === 'Late' || a.status === 'Overtime');
  const attendanceRate = attendance.length > 0 ? Math.round((presentAttendance.length / attendance.length) * 100) : 100;

  // Storekeeper Calculations
  const pendingStoreSignoffs = clearances.filter(c => !c.storeAssetSignoff?.completed);
  const totalUnreturnedDeductions = clearances.reduce((sum, c) => sum + (c.financeSignoff?.unreturnedGearCost || 0), 0);
  const newRecruitsAwaitingGear = onboardingList.filter(o => 
    o.tasks.some(t => t.category === 'Equipment' && !t.completed)
  );

  // Field Supervisor Calculations
  const unfilledPostsCount = Math.max(0, totalStaffRequired - totalStaffDeployed);
  const pendingLeavesRequiringCover = leaveRequests.filter(r => r.status === 'Pending');

  // Talent Acquisition Calculations
  const activeCandidates = candidates.filter(c => c.stage !== 'Onboarded' && c.stage !== 'Rejected');
  const pendingGuarantors = candidates.filter(c => !c.guarantorProvided);
  const activeOnboarding = onboardingList.filter(o => o.progressPercent < 100);

  // Legal Calculations
  const totalSeverancePending = clearances.reduce((sum, c) => sum + (c.financeSignoff?.finalSeveranceSettlement || 0), 0);

  return (
    <div className="space-y-6">

      {/* ========================================================================= */}
      {/* 0. FINANCE & PAYROLL HEAD VIEW                                            */}
      {/* ========================================================================= */}
      {roleConfig.type === 'finance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Finance & 30-Day Payroll Overview
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disbursements, statutory 11% employer pension, and exit clearance deductions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('payroll')}
              className="px-3.5 py-2 rounded-lg bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Payroll Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="30-Day Gross Payroll"
              value={`ETB ${payroll.reduce((s, r) => s + r.grossPay, 0).toLocaleString()}`}
              subtitle={`${payroll.length} staff records`}
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="11% Employer Pension"
              value={`ETB ${payroll.reduce((s, r) => s + (r.pensionEmployer11Percent || 0), 0).toLocaleString()}`}
              subtitle="Company contribution"
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="Net Bank Disbursement"
              value={`ETB ${payroll.reduce((s, r) => s + r.netPay, 0).toLocaleString()}`}
              subtitle="CBE bulk transfer ready"
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="Clearance Deductions"
              value={`ETB ${totalUnreturnedDeductions.toLocaleString()}`}
              subtitle="Gate #3 settlement queue"
              onClick={() => onNavigateTab('clearance')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Recent Payroll Ledger Records
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('payroll')}
                className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
              >
                View All ({payroll.length})
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {payroll.slice(0, 6).map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onNavigateTab('payroll')}
                  className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-4 cursor-pointer text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{rec.employeeName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {rec.serviceType} · {rec.workingDays}/30 Days · 11% Pension: ETB {rec.pensionEmployer11Percent.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <div className="font-bold text-slate-900 dark:text-slate-100">ETB {rec.netPay.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500">{rec.paymentStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STOREKEEPER & EQUIPMENT CONTROLLER VIEW                                */}
      {/* ========================================================================= */}
      {roleConfig.type === 'storekeeper' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Central Store & Inventory Control
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uniform handouts, chemical stock buffers, and Gate #2 exit property returns
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="px-3.5 py-2 rounded-lg bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Package className="w-3.5 h-3.5 text-[#EBE834]" />
              <span>Open 3D Warehouse</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="Pending Property Returns"
              value={`${pendingStoreSignoffs.length} Returns`}
              subtitle="Gate #2 clearance inspection"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Unreturned Gear Value"
              value={`ETB ${totalUnreturnedDeductions.toLocaleString()}`}
              subtitle="Forwarded to Finance"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Onboarding Gear Queue"
              value={`${newRecruitsAwaitingGear.length} Recruits`}
              subtitle="Uniforms & boots needed"
              onClick={() => onNavigateTab('onboarding')}
            />
            <HabMetricCard
              title="Sized Staff Profiles"
              value={`${employees.length} Staff`}
              subtitle="Uniform & boot records"
              onClick={() => onNavigateTab('management')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Gate #2 Exit Property Returns
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigateTab('clearance')}
                  className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
                >
                  Open Clearances
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {clearances.map((c) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {c.employeeName} <span className="font-mono text-slate-400">({c.employeeCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {c.siteName} · {c.storeAssetSignoff?.completed ? 'Returned & Signed' : 'Pending Store Check'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('clearance')}
                      className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Onboarding Kit Handouts
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigateTab('onboarding')}
                  className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
                >
                  Open Onboarding
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {onboardingList.map((ob) => {
                  const equipTask = ob.tasks.find(t => t.category === 'Equipment');
                  return (
                    <div key={ob.id} className="px-5 py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{ob.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ob.role} · {equipTask?.completed ? 'Kit Issued' : 'Ready for Handout'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('onboarding')}
                        className="px-3 py-1 rounded-md bg-[#FFF9DB] hover:bg-[#EBE834] text-[#0E1525] border border-[#EFE1AA] font-semibold cursor-pointer"
                      >
                        Issue Kit
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FIELD SITE SUPERVISOR VIEW                                             */}
      {/* ========================================================================= */}
      {roleConfig.type === 'site_supervisor' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Field Site Supervision & Roll Call
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily shift attendance, guard platoons, and standby relief coverage
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('attendance')}
              className="px-3.5 py-2 rounded-lg bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Take Roll Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="Present Today"
              value={`${presentAttendance.length} / ${attendance.length}`}
              subtitle={`${attendanceRate}% clocked in`}
              onClick={() => onNavigateTab('attendance')}
            />
            <HabMetricCard
              title="Unfilled Posts"
              value={`${unfilledPostsCount} Posts`}
              subtitle="Across 5 client sites"
              onClick={() => onNavigateTab('deployment')}
            />
            <HabMetricCard
              title="Active Platoon"
              value="Platoon Alpha"
              subtitle="24hr Duty / 48hr Rest"
              onClick={() => onNavigateTab('deployment')}
            />
            <HabMetricCard
              title="Pending Leave Relief"
              value={`${pendingLeavesRequiringCover.length} Requests`}
              subtitle="Assign standby cover"
              onClick={() => onNavigateTab('leave')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Client Site Staffing Readiness
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('deployment')}
                className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
              >
                Open Scheduler
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sites.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-[11px] text-slate-500">{s.subcity} · {s.clientOrganization}</div>
                  </div>
                  <div className="flex items-center gap-4 font-mono tabular-nums">
                    <div>
                      <span className="text-slate-500 mr-1">Sec:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{s.securityStaffDeployed}/{s.securityStaffRequired}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-1">Cln:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{s.cleaningStaffDeployed}/{s.cleaningStaffRequired}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TALENT ACQUISITION & RECORDS OFFICER VIEW                             */}
      {/* ========================================================================= */}
      {roleConfig.type === 'hr_talent' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Recruitment & Onboarding Pipeline
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Applicant vetting, Kebele guarantor verification, and contract onboarding
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('recruitment')}
              className="px-3.5 py-2 rounded-lg bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Recruitment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="Candidate Pipeline"
              value={`${activeCandidates.length} Active`}
              subtitle="Screening & interviews"
              onClick={() => onNavigateTab('recruitment')}
            />
            <HabMetricCard
              title="Guarantor Checks"
              value={`${pendingGuarantors.length} Pending`}
              subtitle="Kebele verification"
              onClick={() => onNavigateTab('recruitment')}
            />
            <HabMetricCard
              title="Active Onboarding"
              value={`${activeOnboarding.length} Recruits`}
              subtitle="Pre-deployment checklist"
              onClick={() => onNavigateTab('onboarding')}
            />
            <HabMetricCard
              title="Service Certificates"
              value={`${workExperiences.length} Issued`}
              subtitle="Authenticated records"
              onClick={() => onNavigateTab('experience')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Candidates
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('recruitment')}
                className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
              >
                Manage Pipeline
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {candidates.map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{c.fullName}</div>
                    <div className="text-[11px] text-slate-500">{c.targetRole} · {c.targetService}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{c.stage}</span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('recruitment')}
                      className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HR OPERATIONS OFFICER VIEW                                             */}
      {/* ========================================================================= */}
      {roleConfig.type === 'hr_ops' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="Total Employees"
              value={employees.length}
              subtitle="Across 4 divisions"
              onClick={() => onNavigateTab('management')}
            />
            <HabMetricCard
              title="Present Today"
              value={`${attendanceRate}%`}
              subtitle={`${presentAttendance.length} clocked in`}
              onClick={() => onNavigateTab('attendance')}
            />
            <HabMetricCard
              title="Pending Leave"
              value={leaveRequests.filter(r => r.status === 'Pending').length}
              subtitle="Awaiting relief cover"
              onClick={() => onNavigateTab('leave')}
            />
            <HabMetricCard
              title="Cleaning Rotation"
              value="Week 1"
              subtitle="Rotates Monday 06:00"
              onClick={() => onNavigateTab('deployment')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Site Deployments & Quotas
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('deployment')}
                className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
              >
                Manage Deployments
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sites.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</div>
                    <div className="text-[11px] text-slate-500">{s.subcity} · {s.clientOrganization}</div>
                  </div>
                  <div className="font-mono tabular-nums text-right">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Sec {s.securityStaffDeployed}/{s.securityStaffRequired} · Cln {s.cleaningStaffDeployed}/{s.cleaningStaffRequired}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LEGAL ADVISOR VIEW                                                     */}
      {/* ========================================================================= */}
      {roleConfig.type === 'legal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
            <HabMetricCard
              title="Active Clearances"
              value={`${pendingClearances.length}`}
              subtitle="Proclamation 1156/2019"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Severance Queue"
              value={`ETB ${totalSeverancePending.toLocaleString()}`}
              subtitle="Final settlement audit"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Work Certificates"
              value={`${workExperiences.length}`}
              subtitle="Article 22 compliant"
              onClick={() => onNavigateTab('experience')}
            />
            <HabMetricCard
              title="Guarantor Compliance"
              value="100%"
              subtitle="Verified civil undertakings"
              onClick={() => onNavigateTab('management')}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Exit Clearance Legal Sign-Off Queue
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('clearance')}
                className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline cursor-pointer"
              >
                Open Clearances
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {clearances.map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.employeeName} <span className="font-mono text-slate-400">({c.employeeCode})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {c.exitReason} · Target Exit: {c.targetExitDate}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('clearance')}
                    className="px-3 py-1 rounded-md bg-[#0E1525] text-white font-semibold cursor-pointer"
                  >
                    Audit Sign-off
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EXECUTIVE & GENERAL MANAGEMENT VIEW (DISTILLED & PROGRESSIVE)          */}
      {/* ========================================================================= */}
      {roleConfig.type === 'executive' && (() => {
        const chartData = sites.map(site => {
          const secCap = site.securityStaffRequired;
          const secAct = site.securityStaffDeployed;
          const clnCap = site.cleaningStaffRequired;
          const clnAct = site.cleaningStaffDeployed;

          const capacity =
            chartFilter === 'Security' ? secCap : chartFilter === 'Cleaning' ? clnCap : secCap + clnCap;
          const actual =
            chartFilter === 'Security' ? secAct : chartFilter === 'Cleaning' ? clnAct : secAct + clnAct;

          let shortName = site.siteCode || site.name;
          if (site.name.includes('Commercial Bank')) shortName = 'CBE Tower';
          else if (site.name.includes('Ethiopian Airlines')) shortName = 'EAL Cargo';
          else if (site.name.includes('Hyatt Regency')) shortName = 'Hyatt Regency';
          else if (site.name.includes("St. Paul's")) shortName = "St. Paul's";
          else if (site.name.includes('Bole Medhanialem')) shortName = 'Bole Complex';

          return {
            id: site.id,
            fullName: site.name,
            name: shortName,
            capacity,
            actual,
            fulfillment: capacity > 0 ? Math.round((actual / capacity) * 100) : 100
          };
        });

        // GM Financials: Inputs vs Outputs
        const totalGrossPayroll = payroll.reduce((s, r) => s + r.grossPay, 0);
        const totalEmployerPension = payroll.reduce((s, r) => s + (r.pensionEmployer11Percent || 0), 0);
        const storeProcurementOutlay = stockTransactions
          .filter(t => t.transactionType === 'Received (Restock)')
          .reduce((s, t) => {
            const item = stockItems.find(i => i.id === t.itemId);
            return s + (t.quantity * (item?.unitCostETB || 350));
          }, 0) || 86400;
        const totalInputsCost = totalGrossPayroll + totalEmployerPension + storeProcurementOutlay;
        const totalWarehouseValuation = stockItems.reduce((s, item) => s + (item.quantityInStock * item.unitCostETB), 0) || 348500;
        const totalRecruitsInPipeline = candidates.filter(c => c.stage !== 'Rejected').length;

        const siteFinancials = sites.map(s => {
          const secRev = s.securityStaffDeployed * 7500;
          const clnRev = s.cleaningStaffDeployed * 5200;
          const totalRev = secRev + clnRev;
          const secCost = s.securityStaffDeployed * 4800;
          const clnCost = s.cleaningStaffDeployed * 3300;
          const totalCost = secCost + clnCost;
          const margin = totalRev - totalCost;
          const marginPercent = totalRev > 0 ? Math.round((margin / totalRev) * 100) : 0;
          return {
            ...s,
            totalRev,
            totalCost,
            margin,
            marginPercent
          };
        });

        const totalClientRevenue = siteFinancials.reduce((s, item) => s + item.totalRev, 0);
        const grossOperatingProfit = totalClientRevenue - totalInputsCost;
        const grossProfitMargin = totalClientRevenue > 0 ? Math.round((grossOperatingProfit / totalClientRevenue) * 100) : 34;
        const monthlySecurityHoursDelivered = totalDeployedSec * 240;

        return (
          <div className="space-y-6">
            
            {/* CHILD 1: Clean Page Header & Focused View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Executive Operations Overview
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Security, Cleaning, and Property Management performance across 5 institutional facilities
                </p>
              </div>

              {/* Progressive Disclosure Segmented Control */}
              <div className="flex items-center gap-1 bg-[#FFFDE8] dark:bg-slate-900 border border-[#EFE1AA] dark:border-slate-800 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setExecutiveTab('summary')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    executiveTab === 'summary'
                      ? 'bg-[#0E1525] text-[#FFF9DB]'
                      : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                  }`}
                >
                  Client Sites & Summary
                </button>
                <button
                  type="button"
                  onClick={() => setExecutiveTab('inputs-outputs')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    executiveTab === 'inputs-outputs'
                      ? 'bg-[#0E1525] text-[#FFF9DB]'
                      : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                  }`}
                >
                  Inputs vs. Outputs
                </button>
                <button
                  type="button"
                  onClick={() => setExecutiveTab('coverage')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    executiveTab === 'coverage'
                      ? 'bg-[#0E1525] text-[#FFF9DB]'
                      : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                  }`}
                >
                  Deployment Chart
                </button>
              </div>
            </div>

            {/* CHILD 2: Light Golden Yellow (#FFFDE8 / #FFF9DB) 4-Card Hero KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFFDE8] dark:bg-slate-900/60 border border-[#EFE1AA] dark:border-slate-800">
              <HabMetricCard
                variant="light-gold"
                title="Monthly Billed Revenue"
                value={`ETB ${totalClientRevenue.toLocaleString()}`}
                subtitle="5 active client SLA contracts"
                onClick={() => onNavigateTab('deployment')}
              />
              <HabMetricCard
                variant="light-gold"
                title="Direct Operating Costs"
                value={`ETB ${totalInputsCost.toLocaleString()}`}
                subtitle="Payroll + 11% pension + store"
                onClick={() => onNavigateTab('payroll')}
              />
              <HabMetricCard
                variant="light-gold"
                title="Net Operating Margin"
                value={`ETB ${grossOperatingProfit.toLocaleString()}`}
                subtitle={`${grossProfitMargin}% operating profit margin`}
                onClick={() => onNavigateTab('payroll')}
              />
              <HabMetricCard
                variant="light-gold"
                title="Site SLA Fulfillment"
                value={`${overallFulfillmentRate}%`}
                subtitle={`${totalStaffDeployed} of ${totalStaffRequired} posts manned`}
                onClick={() => onNavigateTab('deployment')}
              />
            </div>

            {/* CHILD 3: Focused View Content (1 Clear View at a time) */}
            {executiveTab === 'summary' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Unified Client Sites & Financial Performance Table */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Client Facilities & Contract Performance
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Staffing coverage, monthly billing, and net contribution by site
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('deployment')}
                      className="text-xs font-semibold text-[#0E1525] dark:text-[#EBE834] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Roster</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                        <tr>
                          <th className="py-3 px-4">Facility</th>
                          <th className="py-3 px-3 text-right">Staffing</th>
                          <th className="py-3 px-3 text-right">Monthly Billing</th>
                          <th className="py-3 px-3 text-right">Net Margin</th>
                          <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {siteFinancials.map(s => {
                          const totalReq = s.securityStaffRequired + s.cleaningStaffRequired;
                          const totalAct = s.securityStaffDeployed + s.cleaningStaffDeployed;
                          const fulfillment = totalReq > 0 ? Math.round((totalAct / totalReq) * 100) : 100;
                          return (
                            <tr
                              key={s.id}
                              onClick={() => onNavigateTab('deployment')}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  {s.subcity} · {s.servicesProvided.join(' & ')}
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{totalAct}/{totalReq}</span>
                                <span className="text-[11px] text-slate-400 ml-1">({fulfillment}%)</span>
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                                ETB {s.totalRev.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                  ETB {s.margin.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-slate-400 ml-1">({s.marginPercent}%)</span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span
                                  className={`text-[11px] font-semibold ${
                                    fulfillment >= 100
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : 'text-amber-700 dark:text-amber-400'
                                  }`}
                                >
                                  {fulfillment >= 100 ? 'Full Coverage' : `${totalReq - totalAct} Open Post`}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Priority Operational Actions (Flat hairline list, no nested cards) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Attention Required
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Key bottlenecks across departments
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                        <span>Site Staffing Gaps</span>
                        <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                          {unfilledPostsCount} open
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        CBE Tower and EAL Cargo have open shift posts. {onboardingList.length} vetted recruits are ready for assignment.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('deployment')}
                        className="text-[#0E1525] dark:text-[#EBE834] font-semibold hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer"
                      >
                        <span>Assign in Scheduler</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                        <span>Store Reorder Buffer</span>
                        <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                          {stockItems.filter(i => i.quantityInStock <= i.minReorderLevel).length} items low
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Review tactical boots and hospital sanitizer inventory before next onboarding batch.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('store')}
                        className="text-[#0E1525] dark:text-[#EBE834] font-semibold hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer"
                      >
                        <span>Open Warehouse Ledger</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                        <span>30-Day Payroll & Pension</span>
                        <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                          ETB {totalEmployerPension.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        11% employer pension isolated from 7% employee withholding. Ready for bank transfer.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('payroll')}
                        className="text-[#0E1525] dark:text-[#EBE834] font-semibold hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer"
                      >
                        <span>Review Payroll Sheet</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLEAN INPUTS VS. OUTPUTS LEDGER */}
            {executiveTab === 'inputs-outputs' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Operational Inputs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-4 h-4 text-rose-600" />
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Operational Inputs (Costs & Resources)
                        </h2>
                        <p className="text-xs text-slate-500">Monthly workforce, payroll, and store outlay</p>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-bold text-xs text-rose-700 dark:text-rose-400">
                      ETB {totalInputsCost.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">30-Day Gross Wages</div>
                        <div className="text-[11px] text-slate-500">{payroll.length} active staff on payroll</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ETB {totalGrossPayroll.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">11% Statutory Employer Pension</div>
                        <div className="text-[11px] text-slate-500">Proclamation 1156/2019 contribution</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ETB {totalEmployerPension.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Store & Uniform Procurement</div>
                        <div className="text-[11px] text-slate-500">Warehouse valuation: ETB {totalWarehouseValuation.toLocaleString()}</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ETB {storeProcurementOutlay.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Talent Intake & Vetting</div>
                        <div className="text-[11px] text-slate-500">100% Kebele guarantor verified</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {totalRecruitsInPipeline} Candidates
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Outputs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Business Outputs (Revenue & Delivery)
                        </h2>
                        <p className="text-xs text-slate-500">Client contract billing, patrol hours, and profit</p>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-bold text-xs text-emerald-700 dark:text-emerald-400">
                      ETB {totalClientRevenue.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Security Division Billing</div>
                        <div className="text-[11px] text-slate-500">{totalDeployedSec} guards deployed ({monthlySecurityHoursDelivered.toLocaleString()} hrs/mo)</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ETB {(totalDeployedSec * 7500).toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Cleaning Division Billing</div>
                        <div className="text-[11px] text-slate-500">{totalDeployedCln} cleaners deployed across hospitals & towers</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ETB {(totalDeployedCln * 5200).toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Net Operating Profit</div>
                        <div className="text-[11px] text-slate-500">{grossProfitMargin}% net operating margin</div>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                        ETB {grossOperatingProfit.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Exit Asset Recovery Rate</div>
                        <div className="text-[11px] text-slate-500">4-Gate clearance property verification</div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
                        100% Cleared
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DEPLOYMENT QUOTA CHART */}
            {executiveTab === 'coverage' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#0E1525] dark:text-[#EBE834]" />
                      <span>Weekly Deployment Capacity vs. Actual Deployment</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Contractual staffing quotas compared against active on-site deployments
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
                    {(['All', 'Security', 'Cleaning'] as const).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setChartFilter(f)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          chartFilter === f
                            ? 'bg-[#0E1525] text-[#FFF9DB]'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {f === 'All' ? 'Combined' : f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-72 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 15, left: -10, bottom: 20 }}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                        dy={8}
                      />
                      <YAxis
                        tick={{ fill: '#475569', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <Tooltip />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="capacity"
                        name="Contract Quota"
                        fill="#64748B"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={36}
                      />
                      <Bar
                        dataKey="actual"
                        name="Actual Deployed"
                        fill="#EBE834"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
};
