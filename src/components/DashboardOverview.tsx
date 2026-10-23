import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  TrendingUp,
  Filter
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
  ManagementPerson
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
}

const HabMetricCard: React.FC<HabMetricCardProps> = ({
  title,
  value,
  subtitle,
  onClick
}) => (
  <div
    onClick={onClick}
    className="bg-[#EBE834] hover:bg-[#E3E029] border border-[#D4D11E] rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between min-h-[132px] text-[#0E1525]"
  >
    <div className="flex items-start justify-between gap-2">
      <span className="text-xl sm:text-2xl font-black text-[#0E1525] font-mono tabular-nums tracking-tight">
        {value}
      </span>
    </div>
    <div className="mt-4">
      <div className="text-base sm:text-[17px] font-bold text-[#0E1525] leading-snug">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs font-semibold text-[#0E1525]/75 mt-0.5">
          {subtitle}
        </div>
      )}
    </div>
  </div>
);

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
  activeUser,
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const roleConfig = getRoleConfig(activeUser);
  const [chartFilter, setChartFilter] = useState<'All' | 'Security' | 'Cleaning'>('All');

  // Common Calculations across all 4 divisions
  const securityCount = employees.filter(e => e.serviceType === 'Security').length;
  const cleaningCount = employees.filter(e => e.serviceType === 'Cleaning').length;
  const propertyMgmtCount = employees.filter(e => e.serviceType === 'Property Management').length;
  const headOfficeCount = employees.filter(e => e.serviceType === 'Head Office Staff').length;

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
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length + leaveRequests.filter(r => r.status === 'Approved').length;

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
    <div className="space-y-6 animate-fadeIn">

      {/* ========================================================================= */}
      {/* 0. FINANCE & PAYROLL HEAD VIEW                                            */}
      {/* ========================================================================= */}
      {roleConfig.type === 'finance' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Finance KPIs in HAB Yellow-Green Card Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="30-Day Gross Payroll"
              value={`ETB ${payroll.reduce((s, r) => s + r.grossPay, 0).toLocaleString()}`}
              subtitle={`${payroll.length} staff across 4 divisions`}
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="11% Employer Pension"
              value={`ETB ${payroll.reduce((s, r) => s + (r.pensionEmployer11Percent || 0), 0).toLocaleString()}`}
              subtitle="Non-deductible company contribution"
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="Net Bank Disbursement"
              value={`ETB ${payroll.reduce((s, r) => s + r.netPay, 0).toLocaleString()}`}
              subtitle="CBE, Awash & Dashen Bank transfers"
              onClick={() => onNavigateTab('payroll')}
            />
            <HabMetricCard
              title="Clearance Deductions"
              value={`ETB ${totalUnreturnedDeductions.toLocaleString()}`}
              subtitle="Gate #3 Finance settlement queue"
              onClick={() => onNavigateTab('clearance')}
            />
          </div>

          {/* Finance Payroll & Clearance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>30-Day Standard Payroll Sheet Summary</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Additions (Basic, Transport, Mobile Card, House, OT) & Deductions (Tax, 7% Pension, Penalties, Food)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('payroll')}
                  className="text-xs bg-[#0E1525] text-[#FFF500] px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Sheet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {payroll.slice(0, 5).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onNavigateTab('payroll')}
                    className="p-3 bg-[#DFE16A]/20 hover:bg-[#DFE16A]/40 dark:bg-slate-800/60 rounded-lg border border-[#CFD25A]/50 dark:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{rec.employeeName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {rec.serviceType} · {rec.workingDays}/30 Days · 11% Pension: ETB {rec.pensionEmployer11Percent}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-[#0E1525] dark:text-[#FFF500]">ETB {rec.netPay.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">{rec.paymentStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Finance Department Quick Controls
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authorized financial & store accounting actions
                  </p>
                </div>
              </div>
              <div className="space-y-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigateTab('payroll')}
                  className="w-full p-3.5 rounded-xl border border-[#D4D11E] bg-[#EBE834] hover:bg-[#E3E029] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-[#0E1525]">Approve & Disburse 30-Day Payroll</div>
                    <div className="text-[11px] text-[#0E1525]/80">Edit working days, allowances, penalties & food sharing</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0E1525] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('clearance')}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-[#DFE16A]/30 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Sign Off Clearance Gate #3 (Finance)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Settle severance and deduct unreturned store gear</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('store')}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-[#DFE16A]/30 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">Audit Store & Stock Valuation</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Review warehouse inventory costs across 4 divisions</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STOREKEEPER & EQUIPMENT CONTROLLER VIEW                                */}
      {/* ========================================================================= */}
      {roleConfig.type === 'storekeeper' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1-Click 3D Physical Warehouse Quick-Access Banner for Stock Manager */}
          <div className="bg-[#0E1525] border border-slate-800 rounded-xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#EBE834] text-[#0E1525] shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFF500]">
                    Interactive Spatial Digital Twin
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#DFE16A]/20 text-[#FFF500] border border-[#FFF500]/30 text-[10px] font-semibold">
                    4 Division Bays Live
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  3D Physical Warehouse & Rack Inspector
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Inspect Bay A/B (Security Gear & Radios), Bay C (Cleaning Chemicals), Bay D (Property Tools), and Bay E (HQ Stationery) in 3D and issue or restock directly from shelves.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFF500] hover:bg-[#EBE834] text-[#0E1525] font-bold text-xs rounded-full transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Launch 3D Warehouse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Store Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="Pending Property Handover"
              value={`${pendingStoreSignoffs.length} Returns`}
              subtitle="Awaiting store inspection"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Unreturned Gear Deductions"
              value={`ETB ${totalUnreturnedDeductions.toLocaleString()}`}
              subtitle="To deduct from final severance"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Onboarding Gear Issuance"
              value={`${newRecruitsAwaitingGear.length} Recruits`}
              subtitle="Uniform, cap & boots needed"
              onClick={() => onNavigateTab('onboarding')}
            />
            <HabMetricCard
              title="Active Uniform Records"
              value={`${employees.length} Profiles`}
              subtitle="Sized for boot & uniform inventory"
              onClick={() => onNavigateTab('management')}
            />
          </div>

          {/* Storekeeper Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>Clearance Property Handover Watchlist</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verify returned shirts, trousers, boots, and ID badges</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('clearance')}
                  className="text-xs font-bold text-[#0E1525] dark:text-[#FFF500] hover:underline"
                >
                  Open Clearance Tab →
                </button>
              </div>

              <div className="space-y-3">
                {clearances.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#DFE16A]/15 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.employeeName}</span>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{c.employeeCode}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#EBE834] text-[#0E1525]">
                          {c.serviceType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Reason: {c.exitReason} · Site: {c.siteName}
                      </div>
                      <div className="text-[11px] text-slate-800 dark:text-amber-300 mt-1 font-semibold">
                        Property Status: {c.storeAssetSignoff?.completed ? '✓ Handover Signed Off' : '⚠️ Pending Store Inspection'} 
                        {(c.financeSignoff?.unreturnedGearCost || 0) > 0 && ` (ETB ${c.financeSignoff.unreturnedGearCost.toLocaleString()} deduction)`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('clearance')}
                      className="px-3.5 py-1.5 bg-[#0E1525] hover:bg-[#19233C] text-white font-semibold text-xs rounded-full shadow-xs shrink-0 cursor-pointer"
                    >
                      Inspect Return
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Onboarding Uniform & PPE Kits</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Newly hired guards and cleaners ready for uniform issuance</p>
              </div>

              <div className="space-y-2.5">
                {onboardingList.map((ob) => {
                  const equipTask = ob.tasks.find(t => t.category === 'Equipment');
                  return (
                    <div key={ob.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{ob.fullName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{ob.role} · {ob.serviceType}</div>
                        <div className="text-[10px] font-semibold text-slate-700 dark:text-amber-400 mt-0.5">
                          Equipment Task: {equipTask?.completed ? '✓ Issued' : '⏳ Ready for Handout'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('onboarding')}
                        className="text-xs bg-[#EBE834] text-[#0E1525] px-2.5 py-1 rounded-full font-bold cursor-pointer"
                      >
                        Issue Kit →
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
        <div className="space-y-6 animate-fadeIn">
          {/* Supervisor Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="Present Today"
              value={`${presentAttendance.length} / ${attendance.length}`}
              subtitle={`${attendanceRate}% present at posts`}
              onClick={() => onNavigateTab('attendance')}
            />
            <HabMetricCard
              title="Unfilled Posts Alert"
              value={`${unfilledPostsCount} Shortage`}
              subtitle="Across 5 client facilities"
              onClick={() => onNavigateTab('deployment')}
            />
            <HabMetricCard
              title="Active Security Platoon"
              value="Platoon Alpha"
              subtitle="24hr Duty ON / 48hr Rest"
              onClick={() => onNavigateTab('deployment')}
            />
            <HabMetricCard
              title="On Leave"
              value={`${pendingLeavesRequiringCover.length} Requests`}
              subtitle="Assign replacement guard"
              onClick={() => onNavigateTab('leave')}
            />
          </div>

          {/* Supervisor Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>Client Facility Guarding Readiness</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Field inspection of guard posts and hospital cleaning squads</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('deployment')}
                  className="text-xs font-bold text-[#0E1525] dark:text-[#FFF500] hover:underline"
                >
                  Deployments Tab →
                </button>
              </div>

              <div className="space-y-2.5">
                {sites.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#DFE16A]/15 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.subcity} · {s.clientOrganization}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {s.securityStaffDeployed}/{s.securityStaffRequired}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Security</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('attendance')}
                        className="px-3 py-1 bg-[#0E1525] hover:bg-[#19233C] text-white text-[11px] font-semibold rounded-full shadow-xs cursor-pointer"
                      >
                        Roll Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Today's Shift Attendance Roster</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Guards & cleaners clocked in at client posts</p>
              </div>

              <div className="space-y-2">
                {attendance.slice(0, 5).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{a.employeeName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{a.siteName} · {a.shift}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBE834] text-[#0E1525]">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TALENT ACQUISITION & RECORDS OFFICER VIEW                             */}
      {/* ========================================================================= */}
      {roleConfig.type === 'hr_talent' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Talent Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="Candidate Pipeline"
              value={`${activeCandidates.length} Active`}
              subtitle="Screening & interviews"
              onClick={() => onNavigateTab('recruitment')}
            />
            <HabMetricCard
              title="Guarantor Checks"
              value={`${pendingGuarantors.length} Pending`}
              subtitle="Kebele & government letters"
              onClick={() => onNavigateTab('recruitment')}
            />
            <HabMetricCard
              title="Onboarding Checklists"
              value={`${activeOnboarding.length} Recruits`}
              subtitle="Contract & orientation"
              onClick={() => onNavigateTab('onboarding')}
            />
            <HabMetricCard
              title="Experience Certificates"
              value={`${workExperiences.length} Issued`}
              subtitle="Official service certificates"
              onClick={() => onNavigateTab('experience')}
            />
          </div>

          {/* Talent Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>Candidate Vetting & Interview Pipeline</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Review applicants for Security Guards and Hospital Cleaning Teams</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('recruitment')}
                  className="text-xs font-bold text-[#0E1525] dark:text-[#FFF500] hover:underline"
                >
                  Recruitment Tab →
                </button>
              </div>

              <div className="space-y-2.5">
                {candidates.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#DFE16A]/15 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.fullName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#EBE834] text-[#0E1525]">
                          {c.targetService}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {c.phone}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Applied Role: {c.targetRole} · Stage: <span className="font-semibold text-slate-800 dark:text-slate-200">{c.stage}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('recruitment')}
                      className="px-3.5 py-1.5 bg-[#0E1525] hover:bg-[#19233C] text-white font-semibold text-xs rounded-full shadow-xs shrink-0 cursor-pointer"
                    >
                      Screen Candidate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Onboarding Progress Monitor</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tracking contracts, Kebele IDs, and initial site postings</p>
              </div>

              <div className="space-y-3">
                {onboardingList.map((ob) => (
                  <div key={ob.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span>{ob.fullName}</span>
                      <span className="text-[#0E1525] dark:text-[#FFF500]">{ob.progressPercent}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2 overflow-hidden">
                      <div className="bg-[#0E1525] dark:bg-[#FFF500] h-2 rounded-full" style={{ width: `${ob.progressPercent}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
                      <span>Role: {ob.role}</span>
                      <span>Target: {ob.targetStartDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HR OPERATIONS OFFICER VIEW                                             */}
      {/* ========================================================================= */}
      {roleConfig.type === 'hr_ops' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Ops Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="Total Employees"
              value={employees.length}
              subtitle="Across 4 service divisions"
              onClick={() => onNavigateTab('management')}
            />
            <HabMetricCard
              title="Present Today"
              value={`${attendanceRate}%`}
              subtitle={`${presentAttendance.length} clocked in at client sites`}
              onClick={() => onNavigateTab('attendance')}
            />
            <HabMetricCard
              title="On Leave"
              value={leaveRequests.filter(r => r.status === 'Pending').length}
              subtitle="Awaiting relief coverage sign-off"
              onClick={() => onNavigateTab('leave')}
            />
            <HabMetricCard
              title="Cleaning Shift Week"
              value="Week 1"
              subtitle="Rotates Monday 06:00"
              onClick={() => onNavigateTab('deployment')}
            />
          </div>

          {/* Ops Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>Site Deployments & Staffing Quota</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live deployment counts against contractual client agreements</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('deployment')}
                  className="text-xs font-bold text-[#0E1525] dark:text-[#FFF500] hover:underline"
                >
                  Manage Deployments →
                </button>
              </div>

              <div className="space-y-2.5">
                {sites.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#DFE16A]/15 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.subcity} · {s.clientOrganization}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        Sec: {s.securityStaffDeployed}/{s.securityStaffRequired} · Cln: {s.cleaningStaffDeployed}/{s.cleaningStaffRequired}
                      </div>
                      <span className="text-[10px] text-slate-700 dark:text-[#FFF500] font-bold block">
                        Fulfillment: {Math.round(((s.securityStaffDeployed + s.cleaningStaffDeployed) / (s.securityStaffRequired + s.cleaningStaffRequired)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Leave Requests & Replacement Watch</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ensure posts are not left unguarded during annual or sick leave</p>
              </div>

              <div className="space-y-2.5">
                {leaveRequests.map((lr) => (
                  <div key={lr.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{lr.employeeName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBE834] text-[#0E1525]">
                        {lr.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {lr.leaveType} · {lr.days} days ({lr.startDate} to {lr.endDate})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LEGAL ADVISOR VIEW                                                     */}
      {/* ========================================================================= */}
      {roleConfig.type === 'legal' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Legal Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <HabMetricCard
              title="Proclamation Clearances"
              value={`${pendingClearances.length} Active`}
              subtitle="Proclamation No. 1156/2019"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Severance Settlements"
              value={`ETB ${totalSeverancePending.toLocaleString()}`}
              subtitle="Final compensation audit"
              onClick={() => onNavigateTab('clearance')}
            />
            <HabMetricCard
              title="Authenticated Certificates"
              value={`${workExperiences.length} Validated`}
              subtitle="Article 22 compliance"
              onClick={() => onNavigateTab('experience')}
            />
            <HabMetricCard
              title="Guarantor Compliance"
              value="100%"
              subtitle="Civil indemnity contracts"
              onClick={() => onNavigateTab('management')}
            />
          </div>

          {/* Legal Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                    <span>Exit Clearance Legal Sign-off (Proclamation 1156/2019)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Audit notice periods, statutory severance, and property handover</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('clearance')}
                  className="text-xs font-bold text-[#0E1525] dark:text-[#FFF500] hover:underline"
                >
                  Clearance Audit →
                </button>
              </div>

              <div className="space-y-3">
                {clearances.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#DFE16A]/15 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.employeeName}</span>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{c.employeeCode}</span>
                        <span className="text-[10px] bg-[#EBE834] text-[#0E1525] px-1.5 py-0.5 rounded font-bold">
                          {c.exitReason}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Target Exit Date: {c.targetExitDate} · Initiated: {c.initiationDate}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('clearance')}
                      className="px-3.5 py-1.5 bg-[#0E1525] hover:bg-[#19233C] text-white font-semibold text-xs rounded-full shadow-xs shrink-0 cursor-pointer"
                    >
                      Audit Sign-off
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Authenticated Work Experience Records</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Legal certificates under Ethiopian Labor Law Article 22</p>
              </div>

              <div className="space-y-3">
                {workExperiences.map((w) => (
                  <div key={w.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span>{w.employeeName}</span>
                      <span className="font-mono text-[#0E1525] dark:text-[#FFF500] text-[10px]">{w.certificateNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {w.role} · {w.serviceType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EXECUTIVE & GENERAL MANAGEMENT VIEW (HR DIRECTOR / EXECUTIVE DASHBOARD)*/}
      {/* ========================================================================= */}
      {roleConfig.type === 'executive' && (() => {
        // Prepare chart data for Weekly Deployment Capacity vs Actual Deployment
        const chartData = sites.map(site => {
          let capacity = 0;
          let actual = 0;
          const secCap = site.securityStaffRequired;
          const secAct = site.securityStaffDeployed;
          const clnCap = site.cleaningStaffRequired;
          const clnAct = site.cleaningStaffDeployed;

          if (chartFilter === 'Security') {
            capacity = secCap;
            actual = secAct;
          } else if (chartFilter === 'Cleaning') {
            capacity = clnCap;
            actual = clnAct;
          } else {
            capacity = secCap + clnCap;
            actual = secAct + clnAct;
          }

          const deficit = Math.max(0, capacity - actual);
          const fulfillment = capacity > 0 ? Math.round((actual / capacity) * 100) : 100;

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
            deficit,
            fulfillment
          };
        });

        const totalFilteredCapacity = chartData.reduce((acc, curr) => acc + curr.capacity, 0);
        const totalFilteredActual = chartData.reduce((acc, curr) => acc + curr.actual, 0);
        const filteredFulfillmentRate = totalFilteredCapacity > 0 ? Math.round((totalFilteredActual / totalFilteredCapacity) * 100) : 100;
        const totalShortage = Math.max(0, totalFilteredCapacity - totalFilteredActual);

        const CustomChartTooltip = ({ active, payload }: any) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div className="bg-[#0E1525] text-white p-3.5 rounded-xl shadow-2xl border border-[#FFF500]/30 text-xs min-w-[230px]">
                <div className="font-bold text-xs text-[#FFF500] border-b border-white/10 pb-1.5 mb-2 leading-snug">
                  {data.fullName}
                </div>
                <div className="space-y-1.5 text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#64748B]"></span>
                      Weekly Capacity:
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">{data.capacity} Staff</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#EBE834]"></span>
                      Actual Deployment:
                    </span>
                    <span className="font-mono font-bold text-[#EBE834] tabular-nums">{data.actual} Staff</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <span className="text-slate-400">Fulfillment Rate:</span>
                    <span className={`font-mono font-bold ${data.fulfillment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {data.fulfillment}%
                    </span>
                  </div>
                  {data.deficit > 0 ? (
                    <div className="text-[11px] text-rose-300 font-medium bg-rose-950/60 px-2 py-1 rounded border border-rose-800/60 mt-1">
                      ⚠️ Shortage: {data.deficit} post{data.deficit > 1 ? 's' : ''} to fill
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-300 font-medium bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 mt-1">
                      ✓ Full Capacity Met
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        };

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Primary Row: Exact 3 Hero Cards from Image 2 (Total Employees, Present Today, On Leave) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HabMetricCard
                title="Total Employees"
                value={employees.length}
                subtitle={`${securityCount} Sec · ${cleaningCount} Cln · ${propertyMgmtCount} Prop · ${headOfficeCount} HQ`}
                onClick={() => onNavigateTab('management')}
              />
              <HabMetricCard
                title="Present Today"
                value={`${presentAttendance.length} (${attendanceRate}%)`}
                subtitle={`${totalStaffDeployed}/${totalStaffRequired} site posts fulfilled (${overallFulfillmentRate}%)`}
                onClick={() => onNavigateTab('attendance')}
              />
              <HabMetricCard
                title="On Leave"
                value={onLeaveCount}
                subtitle={`${leaveRequests.filter(r => r.status === 'Pending').length} pending relief approvals`}
                onClick={() => onNavigateTab('leave')}
              />
            </div>

            {/* Recharts Bar Chart: Weekly Deployment Capacity vs Actual Deployment */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#EBE834] text-[#0E1525] shrink-0">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Weekly Deployment Capacity vs Actual Deployment
                    </h2>
                    <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DFE16A]/40 text-[#0E1525] border border-[#C8CB54]/50">
                      HR Director Analytics
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Contractual staffing quota capacity compared against active on-site deployments across client facilities
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    <span>View:</span>
                  </span>
                  {(['All', 'Security', 'Cleaning'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setChartFilter(f)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        chartFilter === f
                          ? 'bg-[#0E1525] text-[#FFF500] shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      {f === 'All' ? 'Combined (All)' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Summary strip for the chart */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Contract Capacity</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                    {totalFilteredCapacity} Posts
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Actual Deployed</div>
                  <div className="text-lg font-bold text-[#0E1525] dark:text-[#FFF500] font-mono tabular-nums mt-0.5">
                    {totalFilteredActual} Staff
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fulfillment Rate</div>
                  <div className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${
                    filteredFulfillmentRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {filteredFulfillmentRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Staffing Gap</div>
                  <div className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${
                    totalShortage > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {totalShortage > 0 ? `-${totalShortage} Shortage` : '0 (Optimal)'}
                  </div>
                </div>
              </div>

              {/* Recharts Bar Chart Container */}
              <div className="w-full h-72 sm:h-80 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
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
                      domain={[0, 'auto']}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                      formatter={(value) => (
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{value}</span>
                      )}
                    />
                    <Bar
                      dataKey="capacity"
                      name="Weekly Deployment Capacity"
                      fill="#64748B"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={38}
                    />
                    <Bar
                      dataKey="actual"
                      name="Actual Deployment"
                      fill="#EBE834"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={38}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Client Sites & Staffing Quota */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0E1525] dark:text-[#FFF500]" />
                  <span>Client Sites & Staffing Fulfillment</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Staffing across major client facilities in Addis Ababa</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('deployment')}
                className="text-xs bg-[#0E1525] text-[#FFF500] px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sites.map((site) => (
                <div 
                  key={site.id} 
                  onClick={() => onNavigateTab('deployment')}
                  className="p-4 bg-[#DFE16A]/20 hover:bg-[#DFE16A]/40 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-[#CFD25A]/60 dark:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#0E1525] dark:text-slate-100">{site.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#0E1525]/70 dark:text-slate-400" />
                      <span>{site.subcity}</span>
                      <span>·</span>
                      <span>{site.clientOrganization}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    {site.servicesProvided.includes('Security') && (
                      <div className="text-right px-2.5 py-1 rounded-lg bg-[#EBE834] text-[#0E1525]">
                        <span className="text-[10px] font-bold block">Security</span>
                        <span className="font-mono font-black">
                          {site.securityStaffDeployed}/{site.securityStaffRequired}
                        </span>
                      </div>
                    )}

                    {site.servicesProvided.includes('Cleaning') && (
                      <div className="text-right px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#0E1525]/15 text-[#0E1525] dark:text-slate-100">
                        <span className="text-[10px] font-bold block">Cleaning</span>
                        <span className="font-mono font-black">
                          {site.cleaningStaffDeployed}/{site.cleaningStaffRequired}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        );
      })()}

    </div>
  );
};
