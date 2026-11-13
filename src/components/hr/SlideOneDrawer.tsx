import React from 'react';
import { X, User, DollarSign, Calendar, Clock, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { Employee, LeaveRequest, AttendanceRecord } from '../../types/hrm';

export type DrawerCategory = 'profile' | 'pay' | 'leave' | 'overtime' | 'site' | 'kpi';

interface SlideOneDrawerProps {
  employee: Employee | null;
  category: DrawerCategory;
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: DrawerCategory) => void;
  leaveRequests?: LeaveRequest[];
  attendance?: AttendanceRecord[];
}

export const SlideOneDrawer: React.FC<SlideOneDrawerProps> = ({
  employee,
  category,
  isOpen,
  onClose,
  onSelectCategory,
  leaveRequests = []
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose}>
      <aside
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
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
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold shrink-0 transition-colors ${
                  active ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          {category === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <div><span className="text-slate-500 block text-[11px]">Phone:</span><span className="font-mono text-slate-900 dark:text-white font-medium">{employee.phone}</span></div>
                <div><span className="text-slate-500 block text-[11px]">National ID:</span><span className="font-mono text-slate-900 dark:text-white font-medium">{employee.nationalId}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Kebele & Subcity:</span><span className="text-slate-900 dark:text-white">{employee.subcity}, {employee.kebele}</span></div>
                <div><span className="text-slate-500 block text-[11px]">Joined Date:</span><span className="font-mono text-slate-900 dark:text-white">{employee.hireDate}</span></div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">Emergency Contact</span>
                <p className="text-slate-700 dark:text-slate-300">{employee.emergencyContact.name} ({employee.emergencyContact.relation})</p>
                <p className="font-mono text-slate-500 text-[11px] mt-0.5">{employee.emergencyContact.phone}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Notarized Guarantor</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{employee.guarantor.name} · {employee.guarantor.organization}</p>
                <p className="font-mono text-slate-500 text-[11px]">Kebele ID: {employee.guarantor.kebeleId} · Tel: {employee.guarantor.phone}</p>
              </div>
            </div>
          )}

          {category === 'pay' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Contracted Basic Salary:</span><span className="font-mono font-bold text-slate-900 dark:text-white">ETB {employee.salary.baseSalary.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Site & Hazard Allowances:</span><span className="font-mono">ETB {(employee.salary.siteAllowance + employee.salary.hazardAllowance).toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>11% Employer Pension Rate:</span><span className="font-mono text-amber-700 dark:text-amber-400 font-medium">+ETB {pensionEmployer.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-slate-950 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700"><span>Total Monthly Gross:</span><span className="font-mono">ETB {totalGross.toLocaleString()}</span></div>
              </div>
              <div className="bg-[#FCF0DA]/50 p-3.5 rounded-lg border border-[#F2C46A]/50 dark:bg-slate-800/80">
                <span className="font-bold text-[#4C4541] dark:text-[#F2C46A] block">Annual Increment Planning</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Eligible next cycle: <strong className="font-mono text-emerald-700 dark:text-emerald-400">+ETB {Math.round(employee.salary.baseSalary * 0.10).toLocaleString()} (Grade Jump)</strong></p>
                <p className="text-[11px] text-slate-500 mt-0.5">Last reviewed: 2025-08-01 · Bank: {employee.bankAccount.bankName} ({employee.bankAccount.accountNumber})</p>
              </div>
            </div>
          )}

          {category === 'leave' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900"><span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 block">Annual Leave</span><span className="text-xl font-mono font-bold text-emerald-900 dark:text-emerald-200">{remainingAnnual}</span><span className="text-[10px] text-emerald-600 block">/ 16 days</span></div>
                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-900"><span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 block">Sick Leave</span><span className="text-xl font-mono font-bold text-amber-900 dark:text-amber-200">10</span><span className="text-[10px] text-amber-600 block">/ 10 days</span></div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"><span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">Compassionate</span><span className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100">5</span><span className="text-[10px] text-slate-500 block">/ 5 days</span></div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-2">Leave History & Deductions</span>
                {empLeaves.length === 0 ? (
                  <p className="text-slate-500 text-[11px] italic">No leave deductions taken this fiscal cycle.</p>
                ) : (
                  <div className="space-y-1.5">{empLeaves.map(l => (
                    <div key={l.id} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100 dark:border-slate-800"><span>{l.leaveType} ({l.days} days)</span><span className="font-mono text-emerald-700 font-semibold">{l.status}</span></div>
                  ))}</div>
                )}
              </div>
            </div>
          )}

          {category === 'overtime' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 space-y-2">
                <div className="flex justify-between"><span>Accumulated Monthly OT:</span><span className="font-mono font-bold text-slate-900 dark:text-white">{otHours} hrs</span></div>
                <div className="flex justify-between"><span>Approved OT Multiplier:</span><span className="font-mono">1.50x (Weekend/Night rate)</span></div>
                <div className="flex justify-between"><span>Estimated OT Pay:</span><span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">ETB {Math.round((employee.salary.baseSalary / 240) * otHours * 1.5).toLocaleString()}</span></div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 text-[11px]">Authorized by Site Supervisor: <strong className="text-slate-800 dark:text-slate-200">Ato Tadesse Wolde</strong></div>
              </div>
            </div>
          )}

          {category === 'site' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 space-y-2">
                <div className="flex justify-between"><span>Assigned Client Site:</span><span className="font-bold text-slate-900 dark:text-white">{employee.currentSiteName || 'Reserve Pool'}</span></div>
                <div className="flex justify-between"><span>Active Shift:</span><span className="text-slate-800 dark:text-slate-200">{employee.currentShift || 'Standard Schedule'}</span></div>
                <div className="flex justify-between"><span>Platoon / Rotation:</span><span>{employee.securityPlatoon || employee.cleaningShiftWeek || 'Main Wing'}</span></div>
                <div className="flex justify-between text-slate-500 text-[11px]"><span>Uniform Spec:</span><span>Boots: EU {employee.uniformSizes.boots} · Shirt: {employee.uniformSizes.shirt}</span></div>
              </div>
            </div>
          )}

          {category === 'kpi' && (
            <div className="space-y-4">
              <div className="bg-[#FCF0DA]/60 p-4 rounded-lg border border-[#F2C46A]/60 dark:bg-slate-800 text-center">
                <span className="text-[11px] font-bold text-[#4C4541] dark:text-[#F2C46A] uppercase tracking-wider block">Performance Score</span>
                <span className="text-3xl font-mono font-bold text-slate-950 dark:text-white mt-1 block">94%</span>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Exceeds Expectations</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between"><span>Punctuality & Attendance:</span><span className="font-mono font-bold text-slate-900 dark:text-white">98% (0 unexcused)</span></div>
                <div className="flex justify-between"><span>Conduct & Uniform Rating:</span><span className="font-semibold text-emerald-700">Exceptional</span></div>
                <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700">Next Performance Appraisal: Tahsas 2019</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
