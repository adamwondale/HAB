import React, { useState } from 'react';
import { Search, Calendar, Plus } from 'lucide-react';
import { Employee, EmployeeLeaveBalance, ServiceType } from '../../types/hrm';
import { HrLaborRulesSettings } from '../../types/systemSettings';
import { calculateEmployeeStatutoryLeave, loadSystemSettings } from '../../utils/systemSettingsStorage';

interface LeaveAvailableTabProps {
  employees: Employee[];
  leaveBalances: Record<string, EmployeeLeaveBalance>;
  rules?: HrLaborRulesSettings;
  onRequestLeaveForEmployee: (empId: string) => void;
}

export const LeaveAvailableTab: React.FC<LeaveAvailableTabProps> = ({
  employees,
  leaveBalances,
  rules,
  onRequestLeaveForEmployee
}) => {
  const activeRules = rules || loadSystemSettings().hrLaborRules;
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');

  const filteredEmployees = employees.filter(emp => {
    if (divisionFilter !== 'All' && emp.serviceType !== divisionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const code = emp.employeeCode.toLowerCase();
      const site = (emp.currentSiteName || '').toLowerCase();
      return name.includes(q) || code.includes(q) || site.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee leave directory..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto max-w-full">
          {['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'].map(div => (
            <button
              key={div}
              type="button"
              onClick={() => setDivisionFilter(div)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                divisionFilter === div
                  ? 'bg-[#4C4541] text-[#FCF0DA]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-amber-200 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Service Division</th>
              <th className="py-3.5 px-4">Assigned Facility</th>
              <th className="py-3.5 px-4">Annual Leave Balance</th>
              <th className="py-3.5 px-4">Sick Leave Balance</th>
              <th className="py-3.5 px-4">Compassionate</th>
              <th className="py-3.5 px-4 text-center">Total Remaining</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">No employees found matching the filter.</td>
              </tr>
            ) : (
              filteredEmployees.map(emp => {
                const statutory = calculateEmployeeStatutoryLeave(emp.hireDate, activeRules);
                const annualTotal = statutory.statutoryDays;
                const bal = leaveBalances[emp.id] || {
                  annual: annualTotal,
                  sick: 30,
                  compassionate: 7,
                  totalRemaining: annualTotal + 37
                };

                const annualRemaining = bal.annual !== undefined ? bal.annual : annualTotal;
                const annualPct = Math.max(0, Math.min(100, Math.round((annualRemaining / annualTotal) * 100)));
                const sickPct = Math.max(0, Math.min(100, Math.round((bal.sick / 30) * 100)));
                const bonusDays = annualTotal - activeRules.baseLeaveDays;
                const totalRemaining = annualRemaining + bal.sick + bal.compassionate;

                return (
                  <tr key={emp.id} className="odd:bg-white even:bg-slate-50/70 hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-normal">
                      <div className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{emp.employeeCode} · {emp.role}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {emp.serviceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {emp.currentSiteName || 'Head Office / Standby'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-700 font-bold">{annualRemaining} / {annualTotal} Days</span>
                        <span className="text-slate-400 font-mono">{annualPct}%</span>
                      </div>
                      <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${annualRemaining > 5 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${annualPct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium mt-1">
                        Statutory: {annualTotal}d ({activeRules.baseLeaveDays} Base{bonusDays > 0 ? ` + ${bonusDays}d for ${statutory.tenureYears}y service` : ' · Year 1'})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-700 font-bold">{bal.sick} / 30 Days</span>
                        <span className="text-slate-400 font-mono">{sickPct}%</span>
                      </div>
                      <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${bal.sick > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${sickPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800">{bal.compassionate} / 7 Days</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold text-xs">
                        {totalRemaining} Days
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRequestLeaveForEmployee(emp.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#F2C46A] text-slate-700 hover:text-[#4C4541] font-bold text-[11px] rounded-lg transition-colors border border-slate-200"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Request</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
