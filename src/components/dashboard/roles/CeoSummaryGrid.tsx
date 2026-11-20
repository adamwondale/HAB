import React from 'react';
import { Employee } from '../../../types/hrm';

interface CeoSummaryGridProps {
  employees: Employee[];
}

export const CeoSummaryGrid: React.FC<CeoSummaryGridProps> = ({ employees }) => {
  const activeStaff = employees.filter((e) => e.status !== 'Exited').length;

  return (
    <section className="rounded-xl border border-[#EFE7D8] bg-white p-5 dark:border-[#3D3633] dark:bg-[#24201E]">
      <div className="flex items-center justify-between border-b border-[#F5EFE3] pb-3 dark:border-[#3D3633]">
        <h2 className="text-sm font-semibold text-[#4C4541] dark:text-white">
          Employees Summary Table
        </h2>
        <span className="text-[10px] text-[#8C847E] dark:text-[#68615C]">
          {activeStaff} active records &mdash; wireframe parity
        </span>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs border-collapse min-w-[720px]">
          <thead className="bg-[#FFF9DB] text-[#4C4541] dark:bg-[#2C2724] dark:text-white font-semibold border-b border-[#FDE68A] dark:border-[#3D3633]">
            <tr>
              <th className="py-2.5 px-3 font-mono">No</th>
              <th className="py-2.5 px-3 font-mono">Employee Name</th>
              <th className="py-2.5 px-3 font-mono">Employee ID</th>
              <th className="py-2.5 px-3 font-mono">Payroll Record Status</th>
              <th className="py-2.5 px-3 font-mono text-center">Leave Days</th>
              <th className="py-2.5 px-3 font-mono text-center">Overtime Record</th>
              <th className="py-2.5 px-3 font-mono text-center">KPI</th>
              <th className="py-2.5 px-3 font-mono text-right" colSpan={2}>
                Salary Adjustment
              </th>
            </tr>
            <tr className="border-t border-[#FDE68A]/60 dark:border-[#3D3633] text-[10px] text-slate-500 dark:text-slate-400">
              <th colSpan={7}></th>
              <th className="py-1 px-2 text-right font-normal">Deduction (%)</th>
              <th className="py-1 px-2 text-right font-normal">Increment (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE3] dark:divide-[#3D3633]">
            {employees.slice(0, 8).map((emp, idx) => (
              <tr key={emp.id} className="hover:bg-[#F7F4EE] dark:hover:bg-[#2C2724] transition-colors">
                <td className="py-2.5 px-3 font-mono text-[#68615C] dark:text-[#8C847E]">{idx + 1}</td>
                <td className="py-2.5 px-3 font-semibold text-[#4C4541] dark:text-white">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="py-2.5 px-3 font-mono text-[#4C4541] dark:text-white">{emp.employeeCode}</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-[#047857]/20 dark:text-[#34D399] dark:border-[#047857]">
                    Active
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[#4C4541] dark:text-white text-center tabular-nums">
                  14 d
                </td>
                <td className="py-2.5 px-3 font-mono text-[#4C4541] dark:text-white text-center tabular-nums">
                  {idx % 2 === 0 ? '12.5 hrs' : '0 hrs'}
                </td>
                <td className="py-2.5 px-3 font-mono text-[#4C4541] dark:text-white text-center tabular-nums font-bold">
                  {90 + (idx % 8)}%
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-[#B45309] tabular-nums">
                  {idx % 3 === 0 ? '-2%' : '0%'}
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-[#047857] tabular-nums font-semibold">
                  +{3 + (idx % 4)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
