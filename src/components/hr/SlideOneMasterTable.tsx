import React, { useState } from 'react';
import { Search, Filter, Building2, Clock, Calendar, Award, User, DollarSign } from 'lucide-react';
import { Employee, LeaveRequest, AttendanceRecord, ServiceType } from '../../types/hrm';
import { SlideOneDrawer, DrawerCategory } from './SlideOneDrawer';

interface SlideOneMasterTableProps {
  employees: Employee[];
  leaveRequests?: LeaveRequest[];
  attendance?: AttendanceRecord[];
}

export const SlideOneMasterTable: React.FC<SlideOneMasterTableProps> = ({
  employees,
  leaveRequests = [],
  attendance = []
}) => {
  const [selectedDept, setSelectedDept] = useState<'All' | ServiceType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectEmployee, setInspectEmployee] = useState<Employee | null>(null);
  const [activeCategory, setActiveCategory] = useState<DrawerCategory>('profile');

  const filtered = employees.filter(emp => {
    if (selectedDept !== 'All' && emp.serviceType !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        (emp.currentSiteName && emp.currentSiteName.toLowerCase().includes(q)) ||
        emp.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCellClick = (emp: Employee, cat: DrawerCategory) => {
    setInspectEmployee(emp);
    setActiveCategory(cat);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4C4541] dark:text-[#F2C46A]" />
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:border-[#F2C46A] dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          >
            <option value="All">All Divisions ({employees.length})</option>
            <option value="Security">Security Division</option>
            <option value="Cleaning">Cleaning Division</option>
            <option value="Property Management">Property Management</option>
            <option value="Head Office Staff">Head Office Staff</option>
          </select>
          <span className="text-xs text-slate-500 font-mono">Showing {filtered.length} staff</span>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee, ID, site, role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:border-[#F2C46A] focus:bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
          />
        </div>
      </div>

      {/* 7-Column Master Ledger Table */}
      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <table className="w-full text-left text-xs min-w-[960px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] dark:bg-slate-800/90 dark:text-amber-200 dark:border-slate-700">
            <tr>
              <th className="py-3.5 px-4 font-bold">Employee</th>
              <th className="py-3.5 px-4 font-bold">HR Profile</th>
              <th className="py-3.5 px-4 font-bold">Pay Record</th>
              <th className="py-3.5 px-4 font-bold">Leave Days</th>
              <th className="py-3.5 px-4 font-bold">Overtime Record</th>
              <th className="py-3.5 px-4 font-bold">Site</th>
              <th className="py-3.5 px-4 font-bold">KPI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(emp => {
              const empLeaves = leaveRequests.filter(l => l.employeeId === emp.id && l.status === 'Approved');
              const usedDays = empLeaves.reduce((sum, l) => sum + l.days, 0);
              const remainingDays = Math.max(0, 16 - usedDays);
              const otHours = emp.serviceType === 'Security' ? 18.5 : 12.0;

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-[#FCF0DA]/30 transition-colors group cursor-pointer dark:hover:bg-slate-800/60"
                >
                  {/* 1. Employee */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'profile')}>
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

                  {/* 2. HR Profile */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'profile')}>
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

                  {/* 3. Pay Record */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'pay')}>
                    <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      ETB {emp.salary.baseSalary.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
                      Grade {emp.grade || 'L1'} · +10% Elig.
                    </div>
                  </td>

                  {/* 4. Leave Days */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'leave')}>
                    <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{remainingDays} / 16 d</span>
                    </div>
                    <div className="text-[10px] text-slate-500">10 Sick · 5 Comp.</div>
                  </td>

                  {/* 5. Overtime Record */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'overtime')}>
                    <div className="flex items-center gap-1 font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{otHours} hrs</span>
                    </div>
                    <div className="text-[10px] text-slate-500">1.50x · Supervised</div>
                  </td>

                  {/* 6. Site */}
                  <td className="py-3 px-4 max-w-xs truncate" onClick={() => handleCellClick(emp, 'site')}>
                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.currentSiteName || 'Reserve Pool'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{emp.currentShift || 'Day Duty'}</div>
                  </td>

                  {/* 7. KPI */}
                  <td className="py-3 px-4" onClick={() => handleCellClick(emp, 'kpi')}>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono tabular-nums font-bold text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Award className="w-3 h-3" />
                      <span>94%</span>
                    </span>
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">Exceeds</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over Inspection Drawer */}
      <SlideOneDrawer
        employee={inspectEmployee}
        category={activeCategory}
        isOpen={Boolean(inspectEmployee)}
        onClose={() => setInspectEmployee(null)}
        onSelectCategory={setActiveCategory}
        leaveRequests={leaveRequests}
        attendance={attendance}
      />
    </div>
  );
};
