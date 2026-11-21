import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Users, FileCheck, CheckCircle2 } from 'lucide-react';
import { Division } from '../../types/division';
import { Employee } from '../../types/hrm';

interface AssignedStaffBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  divisions: Division[];
  employees: Employee[];
}

export const AssignedStaffBreakdownModal: React.FC<AssignedStaffBreakdownModalProps> = ({
  isOpen, onClose, divisions, employees
}) => {
  const { t } = useTranslation();
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [contractFilter, setContractFilter] = useState<'All' | 'Permanent' | 'Contract'>('All');

  if (!isOpen) return null;

  // 600-workforce target breakdown (60% Sec, 28% Cln, 10% Prop, 2% HQ)
  const divisionTargets: Record<string, { total: number; permanent: number; contract: number; pct: number }> = {
    'Security': { total: 360, permanent: 250, contract: 110, pct: 60 },
    'Cleaning': { total: 168, permanent: 115, contract: 53, pct: 28 },
    'Property Management': { total: 60, permanent: 45, contract: 15, pct: 10 },
    'Head Office Staff': { total: 12, permanent: 12, contract: 0, pct: 2 }
  };

  const totalHeadcount = 600;
  const totalPermanent = 422;
  const totalContract = 178;

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDivision !== 'All' && emp.serviceType !== selectedDivision) return false;
    const empType = emp.employmentType || (emp.role.includes('Lead') || emp.role.includes('Supervisor') ? 'Permanent' : 'Contract');
    if (contractFilter !== 'All' && empType !== contractFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A]/20 flex items-center justify-center text-[#4C4541] dark:text-[#F2C46A]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Workforce Classification: Permanent vs Contract
              </h2>
              <p className="text-xs text-slate-500">
                HAB Business PLC — 600 Total Enterprise Personnel Distribution
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Aggregate Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Active Staff</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{totalHeadcount}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Full Operating Capacity</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Permanent Staff</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-300 mt-1">{totalPermanent}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">70.3% of Workforce • Full Benefits</div>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Contract Staff</span>
                <FileCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-300 mt-1">{totalContract}</div>
              <div className="text-[11px] text-amber-600 font-medium mt-1">29.7% of Workforce • Fixed-Term</div>
            </div>
          </div>

          {/* Division Split Matrix (60% Sec, 28% Cln, 10% Prop, 2% HQ) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Statutory 600 Workforce Breakdown by Division
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {Object.entries(divisionTargets).map(([name, data]) => {
                const isSelected = selectedDivision === name;
                return (
                  <div
                    key={name}
                    onClick={() => setSelectedDivision(isSelected ? 'All' : name)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#F2C46A] ring-2 ring-[#F2C46A]/30 bg-[#FCF0DA]/30 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {data.pct}%
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {data.total} Staff
                      </span>
                    </div>

                    {/* Progress Bar of Division Share */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex mb-2.5">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(data.permanent / data.total) * 100}%` }}
                        title={`Permanent: ${data.permanent}`}
                      />
                      <div
                        className="bg-amber-400 h-full"
                        style={{ width: `${(data.contract / data.total) * 100}%` }}
                        title={`Contract: ${data.contract}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Permanent: <strong className="text-slate-700 dark:text-slate-300 font-mono">{data.permanent}</strong> ({Math.round((data.permanent / data.total) * 100)}%)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Contract: <strong className="text-slate-700 dark:text-slate-300 font-mono">{data.contract}</strong> ({Math.round((data.contract / data.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roster Drilldown with Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Staff Roster Sample ({filteredEmployees.length} Shown)
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="text-xs border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Divisions</option>
                  <option value="Security">Security (60%)</option>
                  <option value="Cleaning">Cleaning (28%)</option>
                  <option value="Property Management">Property Mgt (10%)</option>
                  <option value="Head Office Staff">Head Office (2%)</option>
                </select>
                <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
                  {(['All', 'Permanent', 'Contract'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setContractFilter(mode)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                        contractFilter === mode
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Employee</th>
                    <th className="py-2 px-3">Division</th>
                    <th className="py-2 px-3">Classification</th>
                    <th className="py-2 px-3">Current Site</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredEmployees.map((emp) => {
                    const empType = emp.employmentType || (emp.role.includes('Lead') || emp.role.includes('Supervisor') ? 'Permanent' : 'Contract');
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">
                          {emp.firstName} {emp.lastName}
                          <span className="block text-[10px] text-slate-400 font-mono">{emp.employeeCode}</span>
                        </td>
                        <td className="py-2 px-3">{emp.serviceType}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            empType === 'Permanent'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {empType}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{emp.currentSiteName || 'Unassigned'}</td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
