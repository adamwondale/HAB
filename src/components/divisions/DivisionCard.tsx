import React from 'react';
import { Users, Edit2 } from 'lucide-react';
import { Division } from '../../types/division';

interface DivisionCardProps {
  division: Division;
  staffCount: number;
  onOpenRoster: (div: Division) => void;
  onEdit: (div: Division) => void;
  onToggleStatus: (div: Division) => void;
}

export const DivisionCard: React.FC<DivisionCardProps> = ({
  division,
  staffCount,
  onOpenRoster,
  onEdit,
  onToggleStatus
}) => {
  const target = division.targetHeadcount || 30;
  const percent = Math.min(100, Math.round((staffCount / target) * 100));

  return (
    <div
      className={`rounded-xl border p-4.5 bg-white dark:bg-slate-900 transition-all ${
        division.status === 'Active'
          ? 'border-slate-200 dark:border-slate-800 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 opacity-75 bg-slate-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FCF0DA] dark:bg-[#3D3633] text-[#4C4541] dark:text-[#F2C46A]">
              {division.code}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{division.name}</h3>
          </div>
          {division.amharicName && <div className="text-[11px] text-slate-400 mt-0.5">{division.amharicName}</div>}
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            division.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-300'
          }`}
        >
          {division.status}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2">{division.description}</p>

      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Head of Division</div>
          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
            {division.headOfDivision || 'Unassigned'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Staff</div>
          <div className="font-bold font-mono text-slate-900 dark:text-slate-100">
            {staffCount} <span className="text-[10px] text-slate-400 font-normal">/ {target} target</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-[#F2C46A] h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onOpenRoster(division)}
          className="font-bold text-[#4C4541] dark:text-[#F2C46A] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" /> Staff Roster ({staffCount})
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(division)}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="Edit Division"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(division)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {division.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};
