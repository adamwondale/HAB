import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock } from 'lucide-react';
import { OnboardingChecklist } from '../../types/hrm';

interface OnboardingTaskListProps {
  checklist: OnboardingChecklist;
  isTaskAuthorizedForRole: (category: string) => boolean;
  onToggleTask: (checklistId: string, taskId: string) => void;
}

export const OnboardingTaskList: React.FC<OnboardingTaskListProps> = ({
  checklist,
  isTaskAuthorizedForRole,
  onToggleTask
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {checklist.tasks.map((task) => {
        const canToggle = isTaskAuthorizedForRole(task.category);
        return (
          <div
            key={task.id}
            onClick={() => { if (canToggle) onToggleTask(checklist.id, task.id); }}
            className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
              !canToggle
                ? 'bg-slate-50/60 border-slate-200/70 opacity-65 cursor-not-allowed'
                : task.completed
                ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-300 dark:border-emerald-700 text-slate-900 cursor-pointer'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 hover:border-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                disabled={!canToggle}
                onChange={() => {}}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-500 border-slate-300 disabled:cursor-not-allowed"
              />
              <div>
                <div className={`text-xs font-medium ${task.completed ? 'text-slate-900 dark:text-white line-through opacity-80' : 'text-slate-700 dark:text-slate-200'}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded border text-[10px] font-medium bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    {task.category}
                  </span>
                  {task.completedAt && <span>Verified on: {task.completedAt}</span>}
                </div>
              </div>
            </div>
            {task.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : !canToggle ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                <Lock className="w-2.5 h-2.5" />
                {t('recruitment.otherDept')}
              </span>
            ) : (
              <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono">
                {t('common.pending')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
