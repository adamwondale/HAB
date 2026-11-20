import React, { useState } from 'react';
import { FileDown, Search, CheckCircle, Clock, ShieldCheck, Award } from 'lucide-react';
import { ClearanceRecord, Employee } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';

interface ClearanceWorkLetterSplitViewProps {
  clearances: ClearanceRecord[];
  employees: Employee[];
  onOpenDocumentWriter: (employeeId?: string) => void;
}

export const ClearanceWorkLetterSplitView: React.FC<ClearanceWorkLetterSplitViewProps> = ({
  clearances,
  employees,
  onOpenDocumentWriter
}) => {
  // Left Panel States
  const [clearanceTab, setClearanceTab] = useState<'Waiting' | 'Finished'>('Waiting');
  const [clearanceSearch, setClearanceSearch] = useState('');

  // Right Panel States
  const [workLetterFilter, setWorkLetterFilter] = useState<'all' | 'requested' | 'this_year'>('all');
  const [workLetterSearch, setWorkLetterSearch] = useState('');

  const filteredClearances = clearances.filter((c) => {
    const isFinished = c.status === 'Completed' || c.stage === 'completed';
    const matchesTab = clearanceTab === 'Finished' ? isFinished : !isFinished;
    const matchesSearch =
      !clearanceSearch ||
      c.employeeName.toLowerCase().includes(clearanceSearch.toLowerCase()) ||
      c.employeeCode.toLowerCase().includes(clearanceSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const exportClearanceReport = () => {
    downloadCsv(`Clearance_Report_${new Date().toISOString().slice(0, 10)}.csv`, ['Employee', 'Exit Date', 'Store Items', 'Finance Suspense', 'Handover', 'Status'], filteredClearances.map((c) => [
      `${c.employeeName} (${c.employeeCode})`, c.targetExitDate || c.initiationDate || '2026-09-30', c.storeItemsReturned ? 'Checked / Returned' : 'Pending Return', c.financeStatus === 'liquidated' ? 'Clear' : 'Pending Settlement', c.siteSupervisorSignoff?.completed ? 'Completed' : 'Pending Handover', c.status
    ]));
  };

  const exportWorkLetterReport = () => {
    downloadCsv(`Work_Letters_${new Date().toISOString().slice(0, 10)}.csv`, ['Employee', 'Job Title', 'Work Period', 'Leave & Salary', 'Behavior & Performance', 'Date Made'], employees.slice(0, 10).map((e) => [
      `${e.firstName} ${e.lastName}`, e.role, `${e.hireDate} to ${e.status === 'Exited' ? '2026-09-30' : 'Present'}`, `Salary: ETB ${e.salary.baseSalary.toLocaleString()}`, e.kpiRating?.flag || 'Good Standing', new Date().toISOString().slice(0, 10)
    ]));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
      {/* Left Panel: Clearance Station (Wireframe Screen 5 Parity) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8]">
              Clearance Panel
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">Exit Clearance Checklist</span>
          </div>
          <button
            type="button"
            onClick={exportClearanceReport}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-md text-[11px] cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
            {(['Waiting', 'Finished'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setClearanceTab(tab)}
                className={`px-3 py-1 rounded cursor-pointer font-bold ${
                  clearanceTab === tab ? 'bg-[#F2C46A] text-[#4C4541]' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for exit..."
              value={clearanceSearch}
              onChange={(e) => setClearanceSearch(e.target.value)}
              className="pl-6 pr-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
            />
          </div>
        </div>

        {/* Clearance Data Table */}
        <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-2.5">Employee</th>
                <th className="py-2 px-2">Resignation Date</th>
                <th className="py-2 px-2">Store Items</th>
                <th className="py-2 px-2">Payment Suspense</th>
                <th className="py-2 px-2">Handover</th>
                <th className="py-2 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredClearances.slice(0, 6).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td className="py-2 px-2.5">
                    <span className="font-semibold block text-slate-900 dark:text-white">{c.employeeName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.employeeCode}</span>
                  </td>
                  <td className="py-2 px-2 font-mono text-slate-600 dark:text-slate-300">{c.targetExitDate || c.initiationDate || '2026-09-30'}</td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${c.storeItemsReturned ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {c.storeItemsReturned ? 'Checked ✓' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${c.financeStatus === 'liquidated' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                      {c.financeStatus === 'liquidated' ? 'Clear' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${c.siteSupervisorSignoff?.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                      {c.siteSupervisorSignoff?.completed ? 'Signed ✓' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel: Work Letter Station (Wireframe Screen 5 Parity) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Work Letter Panel
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">Service Certificate & Experience</span>
          </div>
          <button
            type="button"
            onClick={exportWorkLetterReport}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-md text-[11px] cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
            {[
              { id: 'all', label: 'All Letters' },
              { id: 'requested', label: 'Requested' },
              { id: 'this_year', label: 'This Year' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setWorkLetterFilter(f.id as any)}
                className={`px-2.5 py-1 rounded cursor-pointer font-bold ${
                  workLetterFilter === f.id ? 'bg-[#F2C46A] text-[#4C4541]' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search work letter..."
              value={workLetterSearch}
              onChange={(e) => setWorkLetterSearch(e.target.value)}
              className="pl-6 pr-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
            />
          </div>
        </div>

        {/* Work Letter Table */}
        <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-2.5">Employee</th>
                <th className="py-2 px-2">Job Title</th>
                <th className="py-2 px-2">Work Period</th>
                <th className="py-2 px-2">Salary</th>
                <th className="py-2 px-2">Behavior / Perf.</th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.slice(0, 6).map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                  <td className="py-2 px-2.5 font-semibold text-slate-900 dark:text-white">
                    {e.firstName} {e.lastName}
                  </td>
                  <td className="py-2 px-2 text-slate-700 dark:text-slate-300">{e.role}</td>
                  <td className="py-2 px-2 font-mono text-[10px] text-slate-500">
                    {e.hireDate} ~ {e.status === 'Exited' ? '2026-09-30' : 'Present'}
                  </td>
                  <td className="py-2 px-2 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    ETB {e.salary.baseSalary.toLocaleString()}
                  </td>
                  <td className="py-2 px-2">
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {e.kpiRating?.flag || 'Exemplary'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDocumentWriter(e.id)}
                      className="px-2 py-0.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold rounded text-[10px] cursor-pointer"
                    >
                      Issue Letter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
