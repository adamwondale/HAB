import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, UserCheck, Lock, Plus } from 'lucide-react';
import { OnboardingChecklist, ClientSite, ManagementPerson, Candidate } from '../types/hrm';
import { EnrollOnboardingModal } from './onboarding/EnrollOnboardingModal';
import { OnboardingProbationCard } from './onboarding/OnboardingProbationCard';
import { OnboardingTaskList } from './onboarding/OnboardingTaskList';
import { loadSystemSettings } from '../utils/systemSettingsStorage';
import { SystemSettings } from '../types/systemSettings';

export interface OnboardingViewProps {
  onboardingList: OnboardingChecklist[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  candidates?: Candidate[];
  onToggleTask: (checklistId: string, taskId: string) => void;
  onCompleteOnboarding: (checklistId: string) => void;
  onEnrollChecklist?: (newChecklist: OnboardingChecklist) => void;
  onConfirmPermanent?: (checklistId: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onboardingList,
  sites,
  activeUser,
  candidates = [],
  onToggleTask,
  onCompleteOnboarding,
  onEnrollChecklist,
  onConfirmPermanent
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<OnboardingChecklist[]>(onboardingList);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>(onboardingList[0]?.id || '');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'All Candidates' | 'In Review' | 'On Probation' | 'Ready for Permanent'>('All Candidates');
  const [probationDays, setProbationDays] = useState<number>(() => loadSystemSettings().hrLaborRules.probationDurationDays || 60);

  useEffect(() => { setItems(onboardingList); }, [onboardingList]);

  useEffect(() => {
    const handleSettingsUpdated = (e: Event) => {
      const custom = e as CustomEvent<SystemSettings>;
      if (custom.detail?.hrLaborRules?.probationDurationDays) setProbationDays(custom.detail.hrLaborRules.probationDurationDays);
    };
    window.addEventListener('hab_system_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('hab_system_settings_updated', handleSettingsUpdated);
  }, []);

  const selectedChecklist = items.find(o => o.id === selectedChecklistId) || items[0];
  const canActivateEmployee = activeUser ? activeUser.permissions.canEditEmployees : true;

  const handlePermanentConfirmed = (id: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, probationStatus: 'Completed', contractType: 'Permanent' } : it));
    onConfirmPermanent?.(id);
  };

  const isTaskAuthorizedForRole = (cat: string) =>
    !activeUser || (activeUser.id === 'mgmt-storekeeper' ? cat === 'Uniform & Equipment' : activeUser.id === 'mgmt-legal' ? cat === 'Police & Guarantor' : true);

  const filteredList = items.filter(item => {
    const isPerm = item.probationStatus === 'Completed' || item.contractType === 'Permanent';
    const elapsed = Math.floor(Math.max(0, Date.now() - new Date(item.joinedDate || item.targetStartDate || '2026-10-01').getTime()) / 86400000);
    const isReady = !isPerm && (elapsed >= probationDays || item.probationStatus === 'Due for Permanent Confirmation');
    if (filterTab === 'In Review') return item.tasks.some(t => !t.completed);
    if (filterTab === 'On Probation') return !isPerm && !isReady;
    if (filterTab === 'Ready for Permanent') return isReady;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Centralized Onboarding & Probation Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('recruitment.onboardingTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('recruitment.onboardingSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>{t('recruitment.inInduction')}: </span><strong className="text-slate-900 dark:text-white font-bold">{items.length} {t('recruitment.newHires')}</strong>
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

      {/* Wireframe Image 7 Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {(['All Candidates', 'In Review', 'On Probation', 'Ready for Permanent'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterTab === tab
                ? 'bg-[#4C4541] text-[#FCF0DA] dark:bg-[#F2C46A] dark:text-[#4C4541] shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate Onboarding & Probation Roster */}
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {filterTab} ({filteredList.length})
          </h2>
          <div className="space-y-2">
            {filteredList.map((item) => {
              const isSelected = selectedChecklist?.id === item.id;
              const completedTasks = item.tasks.filter(t => t.completed).length;
              const totalTasks = item.tasks.length;
              const percent = Math.round((completedTasks / totalTasks) * 100);
              const elapsed = Math.floor(Math.max(0, Date.now() - new Date(item.joinedDate || item.targetStartDate || '2026-10-01').getTime()) / 86400000);
              const isPerm = item.probationStatus === 'Completed' || item.contractType === 'Permanent';
              const isReady = !isPerm && (elapsed >= probationDays || item.probationStatus === 'Due for Permanent Confirmation');

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
                    {isPerm ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Permanent</span>
                    ) : isReady ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">⚡ Due</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">Day {elapsed}/{probationDays}</span>
                    )}
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

        {/* Right Column: Probation Clock & Verification Milestones */}
        <div className="lg:col-span-8 space-y-4">
          {selectedChecklist ? (
            <>
              {/* 60-Day Probation Tracker Card */}
              <OnboardingProbationCard
                item={selectedChecklist}
                onConfirmPermanent={handlePermanentConfirmed}
                activeUser={activeUser}
              />

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedChecklist.fullName}</h2>
                      <span className="text-xs font-mono text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {selectedChecklist.employeeCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('recruitment.designatedDeployment')}: <strong className="text-slate-800 dark:text-slate-200">{selectedChecklist.initialSiteAssigned || 'TBD'}</strong>
                    </p>
                  </div>

                  {selectedChecklist.tasks.every(t => t.completed) ? (
                    canActivateEmployee ? (
                      <button type="button" onClick={() => onCompleteOnboarding(selectedChecklist.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer">
                        <UserCheck className="w-4 h-4" /><span>{t('recruitment.activateInduct')}</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /><span>{t('recruitment.readyForHrActivation')}</span>
                      </span>
                    )
                  ) : (
                    <button type="button" onClick={() => selectedChecklist.tasks.forEach(t => { if (!t.completed) onToggleTask(selectedChecklist.id, t.id); })} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /><span>{t('recruitment.completeAllChecks')}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-xs">{t('recruitment.requiredMilestones')}</span>
                    <span>{t('recruitment.clickToToggle')}</span>
                  </div>
                  <OnboardingTaskList
                    checklist={selectedChecklist}
                    isTaskAuthorizedForRole={isTaskAuthorizedForRole}
                    onToggleTask={onToggleTask}
                  />
                </div>
              </div>
            </>
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
          existingCount={items.length}
        />
      )}
    </div>
  );
};
