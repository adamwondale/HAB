import React from 'react';
import { Sparkles, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import { ProactiveNudge, CopilotAction } from '../../types/copilot';

interface CopilotNudgeBarProps {
  nudges: ProactiveNudge[];
  activeIndex: number;
  isDismissed: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDismiss: () => void;
  onOpenCopilot: () => void;
  onExecuteAction: (action: CopilotAction) => void;
}

export const CopilotNudgeBar: React.FC<CopilotNudgeBarProps> = ({
  nudges,
  activeIndex,
  isDismissed,
  onPrev,
  onNext,
  onDismiss,
  onOpenCopilot,
  onExecuteAction
}) => {
  if (isDismissed || nudges.length === 0) return null;

  const safeIndex = activeIndex % nudges.length;
  const currentNudge = nudges[safeIndex];
  const primaryAction = currentNudge.actions && currentNudge.actions.length > 0 ? currentNudge.actions[0] : undefined;

  return (
    <div className="bg-[#FCF0DA] dark:bg-slate-900 border border-[#EFE7D8] dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#4C4541] dark:text-slate-100 shadow-xs">
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-[#F2C46A] shrink-0" />
        <div>
          <span className="font-bold text-[#4C4541] dark:text-slate-100">{currentNudge.routineReason}: </span>
          <span className="text-slate-600 dark:text-slate-300">{currentNudge.observation}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {primaryAction && (
          <button
            type="button"
            onClick={() => onExecuteAction(primaryAction)}
            className="px-2.5 py-1 rounded bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1"
          >
            <span>{primaryAction.label}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          onClick={onOpenCopilot}
          className="px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
        >
          Ask Copilot
        </button>

        {nudges.length > 1 && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-200">
            <button type="button" onClick={onPrev} className="p-0.5 hover:text-slate-700 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>{safeIndex + 1}/{nudges.length}</span>
            <button type="button" onClick={onNext} className="p-0.5 hover:text-slate-700 cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
