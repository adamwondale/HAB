import React from 'react';
import { Clock, Repeat, Zap, CheckCircle2 } from 'lucide-react';
import { LearnedHabit, CopilotAction } from '../../types/copilot';

interface CopilotHabitsTabProps {
  learnedHabits: LearnedHabit[];
  onExecuteAction: (action: CopilotAction) => void;
}

export const CopilotHabitsTab: React.FC<CopilotHabitsTabProps> = ({
  learnedHabits,
  onExecuteAction
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#F2C46A]" />
          <span>Learned Operational Habits</span>
        </h4>
        <p className="text-[11px] text-slate-500">
          Routines automatically inferred from your repetitive approvals, shift checks, and monthly payroll cycles
        </p>
      </div>

      {learnedHabits.length === 0 ? (
        <div className="py-8 text-center text-slate-400 italic">
          No habits recorded yet. As you use the ERP, Copilot will suggest workflow automations.
        </div>
      ) : (
        learnedHabits.map((habit) => {
          const action = habit.defaultActions && habit.defaultActions.length > 0 ? habit.defaultActions[0] : undefined;
          return (
            <div
              key={habit.id}
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <Clock className="w-3.5 h-3.5 text-[#F2C46A]" />
                  <span>{habit.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {habit.confidence}% Confidence
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{habit.patternDescription}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  <span>Rule: {habit.promptRule}</span>
                </span>
                {action && (
                  <button
                    type="button"
                    onClick={() => onExecuteAction(action)}
                    className="px-2.5 py-1 rounded bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold cursor-pointer"
                  >
                    Run Routine
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
