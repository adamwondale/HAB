import React from 'react';
import { Eye, RotateCcw, ShieldAlert } from 'lucide-react';

export type DashboardPerspective = 'master' | 'hr' | 'finance' | 'store' | 'operations';

interface AdminPerspectiveSwitcherProps {
  activePerspective: DashboardPerspective;
  onSelectPerspective: (perspective: DashboardPerspective) => void;
  roleTitle?: string;
}

const PERSPECTIVES: Array<{ id: DashboardPerspective; label: string; badge: string }> = [
  { id: 'master', label: 'Master Overview', badge: 'Admin' },
  { id: 'hr', label: 'HR Cockpit', badge: 'Staff' },
  { id: 'finance', label: 'Finance Cockpit', badge: 'Ledger' },
  { id: 'store', label: 'Store Cockpit', badge: 'Inventory' },
  { id: 'operations', label: 'Operations Cockpit', badge: 'Sites' }
];

export const AdminPerspectiveSwitcher: React.FC<AdminPerspectiveSwitcherProps> = ({
  activePerspective,
  onSelectPerspective,
  roleTitle = 'Executive Admin'
}) => {
  return (
    <section
      aria-label="Admin Perspective Preview Controls"
      className="rounded-xl border border-[#F2C46A]/50 bg-[#FCF0DA]/40 p-3.5 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-[#F2C46A] p-2 text-[#4C4541] shadow-xs">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4C4541] dark:text-[#F2C46A]">
                Perspective Switcher
              </span>
              <span className="rounded-sm bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {roleTitle}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Preview role-locked landing screens as seen by departmental staff.
            </p>
          </div>
        </div>

        {activePerspective !== 'master' && (
          <button
            type="button"
            onClick={() => onSelectPerspective('master')}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to Master</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F2C46A]/30 dark:border-amber-900/30">
        {PERSPECTIVES.map((p) => {
          const isSelected = activePerspective === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPerspective(p.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs font-bold ring-1 ring-[#4C4541]/10'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{p.label}</span>
              <span
                className={`rounded px-1 py-0.2 text-[9.5px] uppercase font-mono ${
                  isSelected
                    ? 'bg-[#4C4541]/15 text-[#4C4541]'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {p.badge}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
