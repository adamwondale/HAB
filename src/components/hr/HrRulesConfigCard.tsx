import React, { useState } from 'react';
import { Sliders, Check, Clock, Calendar, ShieldAlert } from 'lucide-react';

export const HrRulesConfigCard: React.FC = () => {
  const [probationDays, setProbationDays] = useState(60);
  const [baseLeaveDays, setBaseLeaveDays] = useState(16);
  const [tenureIncrementDays, setTenureIncrementDays] = useState(1);
  const [standardShiftHours, setStandardShiftHours] = useState(8);
  const [securityRotationHours, setSecurityRotationHours] = useState('24h ON / 48h REST');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [leaveTypes, setLeaveTypes] = useState([
    { name: 'Annual Leave', statutory: '16d + 1d/yr' },
    { name: 'Sick Leave', statutory: 'Up to 30d (Medical cert.)' },
    { name: 'Maternity Leave', statutory: '120 consecutive days' },
    { name: 'Compassionate Leave', statutory: '3 - 7 days' },
    { name: 'Emergency Family Leave', statutory: '3 days paid' }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('HR System Rules updated successfully (Labor Proclamation 1156/2019 compliant).');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="rounded-xl border border-[#EFE7D8] dark:border-[#3D3633] bg-white dark:bg-slate-900 p-5 space-y-4 text-xs shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F5EFE3] dark:border-[#3D3633] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FCF0DA] flex items-center justify-center">
            <Sliders className="w-4 h-4 text-[#F2C46A]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4C4541] dark:text-white uppercase tracking-wider">
              HR System Rules Configuration (Screen 9 Parity)
            </h3>
            <p className="text-[11px] text-slate-500">
              Statutory probation, tenure leave accrual, shift times, and leave categories
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] px-2 py-0.5 rounded border border-[#EFE7D8] w-fit">
          Proclamation No. 1156/2019
        </span>
      </div>

      {savedNotice && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" /> {savedNotice}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Probation Time */}
        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200 block">
            1. Probation Period Duration
          </label>
          <p className="text-[10px] text-slate-500">
            Mandatory evaluation timer before converting candidate to permanent employee roster.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={probationDays}
              onChange={(e) => setProbationDays(Number(e.target.value))}
              className="w-24 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold text-center"
            />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">Days (Default: 60 days / 2 months)</span>
          </div>
        </div>

        {/* 2. Leave Day Accrual Rule */}
        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200 block">
            2. Annual Leave Accrual & Tenure Rule
          </label>
          <p className="text-[10px] text-slate-500">
            Rule: "Increase per 1 year one day" &mdash; automatic +1 annual day added per year of service.
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-slate-500">Base:</span>
            <input
              type="number"
              value={baseLeaveDays}
              onChange={(e) => setBaseLeaveDays(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold text-center"
            />
            <span className="text-slate-500">days +</span>
            <input
              type="number"
              value={tenureIncrementDays}
              onChange={(e) => setTenureIncrementDays(Number(e.target.value))}
              className="w-14 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold text-center"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">day / year of service</span>
          </div>
        </div>

        {/* 3. Work Time & Shift Durations */}
        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200 block">
            3. Standard Working Hours & Duty Rotations
          </label>
          <p className="text-[10px] text-slate-500">
            Configure shift thresholds for cleaning crews and post duty cycles for security guards.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Daily Standard Shift:</span>
              <input
                type="number"
                value={standardShiftHours}
                onChange={(e) => setStandardShiftHours(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold mt-0.5"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Guard Duty Cycle:</span>
              <input
                type="text"
                value={securityRotationHours}
                onChange={(e) => setSecurityRotationHours(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold mt-0.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 4. Leave Categories */}
        <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200 block">
            4. Statutory Leave Categories
          </label>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {leaveTypes.map((t) => (
              <div key={t.name} className="flex items-center justify-between py-0.5 text-[10.5px]">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t.name}</span>
                <span className="font-mono text-slate-400">{t.statutory}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-4 py-2 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            Save HR System Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
