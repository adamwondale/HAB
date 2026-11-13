import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import { Employee } from '../../types/hrm';

interface ProbationRosterTablesProps {
  mode: 'probation' | 'finished';
  employees: Employee[];
  onInspectAssignment: (employee: Employee) => void;
  onGenerateDoc: (employee: Employee) => void;
}

export const ProbationRosterTables: React.FC<ProbationRosterTablesProps> = ({
  mode,
  employees,
  onInspectAssignment,
  onGenerateDoc
}) => {
  const probationStaff = employees.filter(e => e.status === 'Probation' || e.grade === 'L1').slice(0, 8);
  const finishedStaff = employees.filter(e => e.status === 'Active').slice(0, 10);

  if (mode === 'probation') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/30 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">Active Probation & Trial Period Management</h2>
            <p className="text-xs text-slate-500">60-Day Ethiopian Labour Proclamation trial period with supervisor checkpoints.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-[#F2C46A] text-[#4C4541] px-2.5 py-1 rounded-md">
            {probationStaff.length} On Trial
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-slate-200 dark:bg-slate-800 dark:text-amber-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Role & Division</th>
                <th className="py-2.5 px-3">Deployed Post</th>
                <th className="py-2.5 px-3">Probation End Date</th>
                <th className="py-2.5 px-3">Supervisor Checkpoint</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {probationStaff.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    <div>{emp.firstName} {emp.lastName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{emp.employeeCode}</div>
                  </td>
                  <td className="py-2.5 px-3">{emp.role} · <span className="text-slate-500">{emp.serviceType}</span></td>
                  <td className="py-2.5 px-3">{emp.currentSiteName || 'Main Station Pool'}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-800 dark:text-amber-400">
                    {idx % 2 === 0 ? '2026-11-30' : '2026-12-15'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Month 1 Checkpoint: 92% Approved</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onInspectAssignment(emp)}
                      className="px-2.5 py-1 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-[11px] rounded-md shadow-xs cursor-pointer"
                    >
                      Inspect Assignment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/30 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Finished Probation · Permanent Staff Roster</h2>
          <p className="text-xs text-slate-500">Confirmed personnel with full tenure rights, official work verification, and clearance options.</p>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
          {finishedStaff.length} Confirmed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-slate-200 dark:bg-slate-800 dark:text-amber-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Confirmed Staff</th>
              <th className="py-2.5 px-3">Position & Division</th>
              <th className="py-2.5 px-3">Site Assignment</th>
              <th className="py-2.5 px-3">Confirmation Date</th>
              <th className="py-2.5 px-3">Tenure Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {finishedStaff.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                  <div>{emp.firstName} {emp.lastName}</div>
                  <div className="text-[10px] font-mono text-slate-500">{emp.employeeCode}</div>
                </td>
                <td className="py-2.5 px-3">{emp.role} · <span className="text-slate-500">{emp.serviceType}</span></td>
                <td className="py-2.5 px-3">{emp.currentSiteName || 'Commercial Bank HQ'}</td>
                <td className="py-2.5 px-3 font-mono">{emp.hireDate}</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Award className="w-3 h-3" />
                    <span>Confirmed Permanent</span>
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => onInspectAssignment(emp)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-md border border-slate-200 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Assignment
                  </button>
                  <button
                    type="button"
                    onClick={() => onGenerateDoc(emp)}
                    className="px-2.5 py-1 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-[11px] rounded-md shadow-xs cursor-pointer"
                  >
                    Generate Doc
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
