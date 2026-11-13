import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { Employee } from '../../types/hrm';

interface LegacyEmployeeTableProps {
  employees: Employee[];
  isStorekeeperMode?: boolean;
  isLegalMode?: boolean;
  canEditEmployees?: boolean;
  onInspect: (emp: Employee) => void;
  onClearance: (empId: string) => void;
}

export const LegacyEmployeeTable: React.FC<LegacyEmployeeTableProps> = ({
  employees,
  isStorekeeperMode,
  isLegalMode,
  canEditEmployees = true,
  onInspect,
  onClearance
}) => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
      <table className="w-full text-left text-xs min-w-[760px]">
        <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] dark:bg-slate-800 dark:text-amber-200 dark:border-slate-700">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Division</th>
            {isStorekeeperMode ? (
              <>
                <th className="py-3 px-4">Shirt Size</th>
                <th className="py-3 px-4">Trousers</th>
                <th className="py-3 px-4">Boots</th>
                <th className="py-3 px-4">Site</th>
              </>
            ) : isLegalMode ? (
              <>
                <th className="py-3 px-4">National ID</th>
                <th className="py-3 px-4">Guarantor</th>
                <th className="py-3 px-4">Guarantor Org</th>
                <th className="py-3 px-4">Status</th>
              </>
            ) : (
              <>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Assigned Site</th>
                <th className="py-3 px-4">Guarantor</th>
                <th className="py-3 px-4">Status</th>
              </>
            )}
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {employees.map(emp => (
            <tr key={emp.id} className="hover:bg-[#FCF0DA]/20 transition-colors dark:hover:bg-slate-800/60">
              <td className="py-3 px-4">
                <div className="font-semibold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                <div className="text-[11px] font-mono text-slate-500">{emp.employeeCode} · {emp.phone}</div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                  {emp.serviceType}
                </span>
              </td>
              {isStorekeeperMode ? (
                <>
                  <td className="py-3 px-4 font-mono font-bold">{emp.uniformSizes.shirt}</td>
                  <td className="py-3 px-4 font-mono font-bold">{emp.uniformSizes.trousers}</td>
                  <td className="py-3 px-4 font-mono font-bold">EU {emp.uniformSizes.boots}</td>
                  <td className="py-3 px-4 truncate max-w-xs">{emp.currentSiteName || 'Reserve Pool'}</td>
                </>
              ) : isLegalMode ? (
                <>
                  <td className="py-3 px-4 font-mono">{emp.nationalId}</td>
                  <td className="py-3 px-4 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{emp.guarantor.name}</td>
                  <td className="py-3 px-4">{emp.guarantor.organization}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">{emp.status}</span></td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4">{emp.role}</td>
                  <td className="py-3 px-4 truncate max-w-xs">{emp.currentSiteName || 'Reserve Pool'}</td>
                  <td className="py-3 px-4 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{emp.guarantor.name.split(' ')[0]}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">{emp.status}</span></td>
                </>
              )}
              <td className="py-3 px-4 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <button type="button" onClick={() => onInspect(emp)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded dark:bg-slate-800 dark:text-slate-300">
                    Details
                  </button>
                  {canEditEmployees && emp.status !== 'In Clearance' && emp.status !== 'Exited' && (
                    <button type="button" onClick={() => onClearance(emp.id)} className="px-2 py-1 text-slate-400 hover:text-amber-800 text-[11px]">
                      Clear
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
