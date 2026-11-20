import React from 'react';
import { Building2, Clock, Calendar, Award } from 'lucide-react';
import { Employee, LeaveRequest, DrawerCategory } from '../../types/hrm';

interface SlideOneTableRowProps {
  emp: Employee;
  isPreviousView: boolean;
  leaveRequests: LeaveRequest[];
  onCellClick: (emp: Employee, cat: DrawerCategory) => void;
  onKpiClick: (emp: Employee) => void;
}

export const SlideOneTableRow: React.FC<SlideOneTableRowProps> = ({
  emp,
  isPreviousView,
  leaveRequests,
  onCellClick,
  onKpiClick
}) => {
  const empLeaves = leaveRequests.filter(l => l.employeeId === emp.id && l.status === 'Approved');
  const usedDays = empLeaves.reduce((sum, l) => sum + l.days, 0);
  const remainingDays = Math.max(0, 16 - usedDays);
  const otHours = emp.serviceType === 'Security' ? 18.5 : 12.0;

  const kpi = emp.kpiRating || {
    attendanceScore: 96,
    customerScore: 4.5,
    compositeScore: 94,
    flag: 'Give Raise'
  };

  return (
    <tr className="hover:bg-[#FCF0DA]/30 transition-colors group cursor-pointer dark:hover:bg-slate-800/60">
      {/* 1. Employee */}
      <td className="py-3 px-4" onClick={() => onCellClick(emp, 'profile')}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F2C46A] text-[#4C4541] font-bold text-xs flex items-center justify-center shrink-0">
            {emp.firstName[0]}{emp.lastName[0]}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block group-hover:text-amber-900 dark:group-hover:text-[#F2C46A]">
              {emp.firstName} {emp.lastName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {emp.employeeCode} {emp.amharicName && `· ${emp.amharicName}`}
            </span>
          </div>
        </div>
      </td>

      {/* 2. HR Profile / Role */}
      <td className="py-3 px-4" onClick={() => onCellClick(emp, 'profile')}>
        <div className="font-medium text-slate-800 dark:text-slate-200">{emp.role}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold dark:bg-slate-800 dark:text-slate-300">
            {emp.serviceType}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
          }`}>
            {emp.status}
          </span>
        </div>
      </td>

      {/* 3. Pay Record or Exit Date */}
      <td className="py-3 px-4" onClick={() => onCellClick(emp, isPreviousView ? 'profile' : 'pay')}>
        {isPreviousView ? (
          <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
            {emp.exitDetails?.exitDate || '2026-09-30'}
          </span>
        ) : (
          <>
            <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
              ETB {emp.salary.baseSalary.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
              Grade {emp.grade || 'L1'} · +10% Elig.
            </div>
          </>
        )}
      </td>

      {/* 4. Leave Days or Exit Reason */}
      <td className="py-3 px-4" onClick={() => onCellClick(emp, isPreviousView ? 'profile' : 'leave')}>
        {isPreviousView ? (
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {emp.exitDetails?.reason || 'End of Contract'}
          </span>
        ) : (
          <>
            <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-slate-900 dark:text-white">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>{remainingDays} / 16 d</span>
            </div>
            <div className="text-[10px] text-slate-500">10 Sick · 5 Comp.</div>
          </>
        )}
      </td>

      {/* 5. Overtime or Rehire Eligibility */}
      <td className="py-3 px-4" onClick={() => onCellClick(emp, isPreviousView ? 'profile' : 'overtime')}>
        {isPreviousView ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            emp.exitDetails?.rehireEligibility === 'Eligible' || !emp.exitDetails
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
          }`}>
            {emp.exitDetails?.rehireEligibility === 'Eligible' || !emp.exitDetails ? 'Eligible to Return' : 'Ineligible / Blocked'}
          </span>
        ) : (
          <>
            <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-slate-900 dark:text-white">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>{otHours} hrs</span>
            </div>
            <div className="text-[10px] text-slate-500">1.50x · Supervised</div>
          </>
        )}
      </td>

      {/* 6. Site */}
      <td className="py-3 px-4 max-w-xs truncate" onClick={() => onCellClick(emp, 'site')}>
        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium truncate">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{emp.currentSiteName || 'Reserve Pool'}</span>
        </div>
        <div className="text-[10px] text-slate-500 truncate">{emp.currentShift || 'Day Duty'}</div>
      </td>

      {/* 7. KPI / Documentation */}
      <td className="py-3 px-4" onClick={() => {
        if (isPreviousView) {
          onCellClick(emp, 'profile');
        } else {
          onKpiClick(emp);
        }
      }}>
        {isPreviousView ? (
          <span className="text-[10px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 underline">
            View Dossier
          </span>
        ) : (
          <>
            <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-xs text-slate-900 dark:text-slate-100">
              <Award className="w-3 h-3 text-amber-500" />
              <span>{kpi.compositeScore}%</span>
            </div>
            <div className="mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold ${
                kpi.flag === 'Give Raise'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : kpi.flag === 'Assign Training'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : kpi.flag === 'Warning'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}>
                {kpi.flag}
              </span>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};
