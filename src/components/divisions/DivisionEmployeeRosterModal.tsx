import React, { useState } from 'react';
import { X, Users, Search, ArrowRightLeft } from 'lucide-react';
import { Division } from '../../types/division';
import { Employee, ServiceType } from '../../types/hrm';

interface DivisionEmployeeRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  employees: Employee[];
  allDivisions: Division[];
  onReassignEmployee: (employeeId: string, targetDivisionName: ServiceType) => void;
}

export const DivisionEmployeeRosterModal: React.FC<DivisionEmployeeRosterModalProps> = ({
  isOpen,
  onClose,
  division,
  employees,
  allDivisions,
  onReassignEmployee
}) => {
  const [search, setSearch] = useState('');
  if (!isOpen || !division) return null;

  const assignedEmployees = employees.filter((e) => e.serviceType === division.name);
  const filtered = assignedEmployees.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.employeeCode.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#FCF0DA] dark:bg-[#2C2724]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#4C4541] dark:text-[#F2C46A]" />
            <div>
              <h3 className="font-bold text-sm text-[#4C4541] dark:text-slate-100">
                {division.name} Roster ({assignedEmployees.length} staff)
              </h3>
              <p className="text-[11px] text-slate-500">{division.code} · {division.headOfDivision || 'Unassigned lead'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-black/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assigned employees by name, ID, or post..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No employees currently assigned to {division.name}.
            </div>
          ) : (
            filtered.map((emp) => (
              <div key={emp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                    {emp.firstName} {emp.lastName}
                    <span className="ml-2 font-mono text-[10px] text-slate-400 font-normal">
                      {emp.employeeCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{emp.role}</span>
                    <span>·</span>
                    <span>{emp.currentSiteName || 'Head Office'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Move to:</span>
                  <select
                    value={emp.serviceType}
                    onChange={(e) => onReassignEmployee(emp.id, e.target.value as ServiceType)}
                    className="text-xs px-2 py-1 border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-medium"
                  >
                    {allDivisions.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} {d.name === division.name ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs text-slate-500">
          <span>Showing {filtered.length} of {assignedEmployees.length} employees</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-bold rounded-lg bg-[#F2C46A] text-[#4C4541] hover:bg-[#e4b55b]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
