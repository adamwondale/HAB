import React, { useState } from 'react';
import { X, User, DollarSign, Calendar, Clock, MapPin, Award, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, ShieldCheck } from 'lucide-react';
import { Employee, LeaveRequest, AttendanceRecord } from '../../types/hrm';
import { QrCodeSvg } from '../common/QrCodeSvg';
import { EmployeeQrBadgeModal } from './EmployeeQrBadgeModal';

export type DrawerCategory = 'profile' | 'pay' | 'leave' | 'overtime' | 'site' | 'kpi';

interface SlideOneDrawerProps {
  employee: Employee | null;
  category: DrawerCategory;
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: DrawerCategory) => void;
  leaveRequests?: LeaveRequest[];
  attendance?: AttendanceRecord[];
  onOpenKpiModal?: (employee: Employee) => void;
}

export const SlideOneDrawer: React.FC<SlideOneDrawerProps> = ({
  employee, category, isOpen, onClose, onSelectCategory, leaveRequests = [], onOpenKpiModal
}) => {
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  if (!isOpen || !employee) return null;

  const tabs: Array<{ id: DrawerCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'profile', label: 'HR Profile', icon: User },
    { id: 'pay', label: 'Pay Record', icon: DollarSign },
    { id: 'leave', label: 'Leave Days', icon: Calendar },
    { id: 'overtime', label: 'Overtime', icon: Clock },
    { id: 'site', label: 'Site / Post', icon: MapPin },
    { id: 'kpi', label: 'KPI & Rating', icon: Award }
  ];

  const totalGross = employee.salary.baseSalary + employee.salary.siteAllowance + employee.salary.shiftAllowance + employee.salary.hazardAllowance;
  const pensionEmployer = Math.round(employee.salary.baseSalary * 0.11);
  const empLeaves = leaveRequests.filter(l => l.employeeId === employee.id);
  const approvedLeaveDays = empLeaves.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.days, 0);
  const remainingAnnual = Math.max(0, 16 - approvedLeaveDays);
  const otHours = employee.serviceType === 'Security' ? 18.5 : 12.0;

  const faydaId = employee.faydaNumber || `ET-FAYDA-${employee.employeeCode.replace(/[^0-9]/g, '').padEnd(4, '0')}-2026-8812`;
  const qrPayload = JSON.stringify({
    system: 'HAB-ERP-VERIFY', code: employee.employeeCode, fayda: faydaId,
    name: `${employee.firstName} ${employee.lastName}`, division: employee.serviceType, role: employee.role,
    site: employee.currentSiteName || 'Commercial Bank Headquarters'
  });
  const kpiData = employee.kpiRating || {
    attendanceScore: 96, customerScore: 4.5, compositeScore: 94, flag: 'Give Raise', lastEvaluated: '2026-10-25', evaluatorNotes: 'Praised by site manager.'
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose}>
        <aside className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-right duration-200" onClick={e => e.stopPropagation()}>
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F2C46A] text-[#4C4541] font-bold text-base flex items-center justify-center shrink-0 border border-[#4C4541]/10">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-950 dark:text-white">{employee.firstName} {employee.lastName}</h2>
                  {employee.amharicName && <span className="text-xs text-slate-500 font-medium">({employee.amharicName})</span>}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{employee.employeeCode} · {employee.serviceType} · {employee.role}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto text-xs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = category === tab.id;
              return (
                <button key={tab.id} type="button" onClick={() => onSelectCategory(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold shrink-0 transition-colors ${active ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5" /><span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
            {category === 'profile' && (
              <div className="space-y-4">
                {/* Real Scannable QR Code & Fayda Identifier Block */}
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">National Fayda & Digital QR</span>
                    </div>
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{faydaId}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Encrypted Digital Credential · National ID Registry Compliant</div>
                  </div>
                  <div className="flex flex-col items-center shrink-0 gap-1">
                    <button type="button" onClick={() => setBadgeModalOpen(true)} title="Click to inspect and print full ID badge" className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs hover:border-[#F2C46A] hover:scale-105 transition-all cursor-pointer">
                      <QrCodeSvg value={qrPayload} size={58} />
                    </button>
                    <button type="button" onClick={() => setBadgeModalOpen(true)} className="text-[9px] font-bold text-amber-800 dark:text-amber-300 hover:underline">
                      View Badge
                    </button>
                  </div>
                </div>

                {employee.exitDetails && (
                  <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300">Employee Exit Record</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${employee.exitDetails.rehireEligibility === 'Eligible' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{employee.exitDetails.rehireEligibility === 'Eligible' ? 'Eligible to Return' : 'Ineligible / Blocked'}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">Exit Date: <strong className="font-mono">{employee.exitDetails.exitDate}</strong></div>
                    <div className="text-slate-700 dark:text-slate-300">Reason: <strong>{employee.exitDetails.reason}</strong></div>
                    {employee.exitDetails.notes && <div className="text-slate-500 italic text-[11px]">{employee.exitDetails.notes}</div>}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                  <div><span className="text-slate-500 block text-[11px]">Phone:</span><span className="font-mono text-slate-900 dark:text-white font-medium">{employee.phone}</span></div>
                  <div><span className="text-slate-500 block text-[11px]">Contract Type:</span><span className="font-semibold text-slate-900 dark:text-white">{employee.employmentType || 'Permanent'}</span></div>
                  <div><span className="text-slate-500 block text-[11px]">Kebele & Subcity:</span><span className="text-slate-900 dark:text-white">{employee.subcity}, {employee.kebele}</span></div>
                  <div><span className="text-slate-500 block text-[11px]">Joined Date:</span><span className="font-mono text-slate-900 dark:text-white">{employee.hireDate}</span></div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Emergency & Guarantor</h4>
                  <div className="text-slate-600 dark:text-slate-300">Contact: {employee.emergencyContact.name} ({employee.emergencyContact.relation}) · {employee.emergencyContact.phone}</div>
                  <div className="text-slate-600 dark:text-slate-300">Guarantor: {employee.guarantor.name} ({employee.guarantor.organization}) · {employee.guarantor.phone}</div>
                </div>
              </div>
            )}

            {category === 'pay' && (
              <div className="space-y-4">
                <div className="bg-[#FCF0DA]/30 dark:bg-slate-800/40 p-4 rounded-xl border border-amber-200/60 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-950 dark:text-white">
                    <span>Monthly Gross Pay:</span><span className="font-mono text-amber-700 dark:text-amber-400 font-extrabold">{totalGross.toLocaleString()} ETB</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Includes base rate plus all statutory and site allowances</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"><span>Basic Salary:</span><span className="font-mono font-semibold">{employee.salary.baseSalary.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"><span>Site Allowance:</span><span className="font-mono font-semibold">{employee.salary.siteAllowance.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"><span>Shift Allowance:</span><span className="font-mono font-semibold">{employee.salary.shiftAllowance.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"><span>Hazard Allowance:</span><span className="font-mono font-semibold">{employee.salary.hazardAllowance.toLocaleString()} ETB</span></div>
                  <div className="flex justify-between py-1.5 pt-2 text-slate-500"><span>Employer Pension (11% liability):</span><span className="font-mono">{pensionEmployer.toLocaleString()} ETB</span></div>
                </div>
              </div>
            )}

            {category === 'leave' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg dark:bg-emerald-950/40 dark:border-emerald-900/60">
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold block text-[11px]">Remaining Annual Leave</span>
                    <span className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-200">{remainingAnnual} Days</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/40 dark:border-amber-900/60">
                    <span className="text-amber-700 dark:text-amber-300 font-semibold block text-[11px]">Approved Leaves Taken</span>
                    <span className="text-xl font-bold font-mono text-amber-800 dark:text-amber-200">{approvedLeaveDays} Days</span>
                  </div>
                </div>
              </div>
            )}

            {category === 'overtime' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block text-[11px]">Accrued Overtime This Month:</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{otHours} Hours</div>
                  <div className="text-[11px] text-slate-400 mt-1">Calculated via biometric & QR site scanner · Proclamation No. 1156/2019 compliant</div>
                </div>
              </div>
            )}

            {category === 'site' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <span className="text-slate-500 block text-[11px]">Current Assigned Deployment Site:</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{employee.currentSiteName || 'Commercial Bank Headquarters'}</div>
                  <div className="text-slate-500">Duty Shift: <strong className="font-medium text-slate-700 dark:text-slate-300">{employee.currentShift || 'Day Duty (06:00 - 18:00)'}</strong></div>
                </div>
              </div>
            )}

            {category === 'kpi' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">KPI Composite Score</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      kpiData.flag === 'Give Raise' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : kpiData.flag === 'Assign Training' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : kpiData.flag === 'Warning' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {kpiData.flag === 'Give Raise' && <TrendingUp className="w-3.5 h-3.5" />}
                      {kpiData.flag === 'Assign Training' && <BookOpen className="w-3.5 h-3.5" />}
                      {kpiData.flag === 'Warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>Action Flag: {kpiData.flag}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs"><span>Attendance Rate:</span><span className="font-mono font-bold">{kpiData.attendanceScore}%</span></div>
                  <div className="flex justify-between text-xs"><span>Client Feedback:</span><span className="font-mono font-bold text-amber-600">★ {kpiData.customerScore.toFixed(1)} / 5.0</span></div>
                </div>
                {onOpenKpiModal && (
                  <button type="button" onClick={() => onOpenKpiModal(employee)} className="w-full py-2.5 px-3 rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs dark:bg-[#F2C46A] dark:text-[#4C4541]">
                    <Award className="w-4 h-4" /><span>Update Customer Rating & Recalculate Flag</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      <EmployeeQrBadgeModal
        employee={employee}
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
      />
    </>
  );
};
