import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, UserCheck, Lock, Plus } from 'lucide-react';
import { OnboardingChecklist, ClientSite, ManagementPerson, Candidate } from '../types/hrm';
import { EnrollOnboardingModal } from './onboarding/EnrollOnboardingModal';

interface OnboardingViewProps {
  onboardingList: OnboardingChecklist[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  candidates?: Candidate[];
  onToggleTask: (checklistId: string, taskId: string) => void;
  onCompleteOnboarding: (checklistId: string) => void;
  onEnrollChecklist?: (newChecklist: OnboardingChecklist) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onboardingList,
  sites,
  activeUser,
  candidates = [],
  onToggleTask,
  onCompleteOnboarding,
  onEnrollChecklist
}) => {
  const { t } = useTranslation();
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>(onboardingList[0]?.id || '');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const selectedChecklist = onboardingList.find(o => o.id === selectedChecklistId) || onboardingList[0];

  const isStorekeeper = activeUser?.id === 'mgmt-storekeeper';
  const isLegal = activeUser?.id === 'mgmt-legal';
  const canActivateEmployee = activeUser ? activeUser.permissions.canEditEmployees : true;

  const isTaskAuthorizedForRole = (cat: string) =>
    !activeUser || (isStorekeeper ? cat === 'Uniform & Equipment' : isLegal ? cat === 'Police & Guarantor' : true);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('recruitment.onboardingTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('recruitment.onboardingSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>{t('recruitment.inInduction')}: </span><strong className="text-slate-900 dark:text-white font-bold">{onboardingList.length} {t('recruitment.newHires')}</strong>
          </div>
          {onEnrollChecklist && (
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer transition-colors dark:bg-slate-100 dark:text-slate-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('recruitment.enrollNewHire')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('recruitment.pendingInductions')} ({onboardingList.length})
          </h2>
          <div className="space-y-2">
            {onboardingList.map((item) => {
              const isSelected = selectedChecklist?.id === item.id;
              const completedTasks = item.tasks.filter(t => t.completed).length;
              const totalTasks = item.tasks.length;
              const percent = Math.round((completedTasks / totalTasks) * 100);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedChecklistId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.fullName}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {item.serviceType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.employeeCode} · {item.role}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{percent}%</span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-900 dark:bg-slate-200 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{t('recruitment.targetStart')}: <strong className="text-slate-800 dark:text-slate-300">{item.targetStartDate}</strong></span>
                    <span>{completedTasks}/{totalTasks} {t('recruitment.done')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedChecklist ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedChecklist.fullName}</h2>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {selectedChecklist.employeeCode}
                    </span>
                    <span className="text-xs text-slate-500">· {selectedChecklist.role}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('recruitment.designatedDeployment')}: <strong className="text-slate-800 dark:text-slate-200">{selectedChecklist.initialSiteAssigned || 'TBD'}</strong>
                  </p>
                </div>

                {selectedChecklist.tasks.every(t => t.completed) ? (
                  canActivateEmployee ? (
                    <button
                      type="button"
                      onClick={() => onCompleteOnboarding(selectedChecklist.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('recruitment.activateInduct')}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t('recruitment.readyForHrActivation')}</span>
                    </span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      selectedChecklist.tasks.forEach(t => {
                        if (!t.completed) onToggleTask(selectedChecklist.id, t.id);
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    title={t('recruitment.completeAllChecks')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('recruitment.completeAllChecks')}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-xs">{t('recruitment.requiredMilestones')}</span>
                  <span>{t('recruitment.clickToToggle')}</span>
                </div>
                <div className="space-y-2">
                  {selectedChecklist.tasks.map((task) => {
                    const canToggle = isTaskAuthorizedForRole(task.category);
                    return (
                      <div
                        key={task.id}
                        onClick={() => { if (canToggle) onToggleTask(selectedChecklist.id, task.id); }}
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
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"><Lock className="w-2.5 h-2.5" />{t('recruitment.otherDept')}</span>
                        ) : (
                          <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono">{t('common.pending')}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs shadow-xs dark:bg-slate-900 dark:border-slate-800">
              {t('recruitment.selectCandidate')}
            </div>
          )}
        </div>
      </div>

      {isEnrollModalOpen && onEnrollChecklist && (
        <EnrollOnboardingModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnroll={(newOnb) => {
            onEnrollChecklist(newOnb);
            setSelectedChecklistId(newOnb.id);
          }}
          candidates={candidates}
          sites={sites}
          existingCount={onboardingList.length}
        />
      )}
    </div>
  );
};
