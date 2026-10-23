import React, { useState } from 'react';
import { 
  CheckCircle2, 
  UserCheck,
  Lock
} from 'lucide-react';
import { OnboardingChecklist, ClientSite, ManagementPerson } from '../types/hrm';

interface OnboardingViewProps {
  onboardingList: OnboardingChecklist[];
  sites: ClientSite[];
  activeUser?: ManagementPerson;
  onToggleTask: (checklistId: string, taskId: string) => void;
  onCompleteOnboarding: (checklistId: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onboardingList,
  activeUser,
  onToggleTask,
  onCompleteOnboarding
}) => {
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>(onboardingList[0]?.id || '');
  const selectedChecklist = onboardingList.find(o => o.id === selectedChecklistId) || onboardingList[0];

  const isStorekeeper = activeUser?.id === 'mgmt-storekeeper';
  const isLegal = activeUser?.id === 'mgmt-legal';
  const canActivateEmployee = activeUser ? activeUser.permissions.canEditEmployees : true;

  const isTaskAuthorizedForRole = (category: string) => {
    if (!activeUser) return true;
    if (isStorekeeper) return category === 'Uniform & Equipment';
    if (isLegal) return category === 'Police & Guarantor';
    return true;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              New Hire Induction
            </span>
            {isStorekeeper && (
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                Storekeeper Gear Issuance Mode
              </span>
            )}
            {isLegal && (
              <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                Legal & Guarantor Vetting Mode
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Employee Onboarding & Gear Issuance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isStorekeeper
              ? 'Verify and sign off on Uniform & Equipment issuance milestones for new hires before site deployment.'
              : isLegal
              ? 'Verify Police Clearance certificates and Notarized Guarantor contracts for new hires.'
              : 'Verify Kebele ID, police clearance, notarized guarantor, and issue company uniforms and boots prior to deployment.'}
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <span>In Induction: </span>
          <strong className="text-slate-900 font-bold">{onboardingList.length} New Hires</strong>
        </div>
      </div>

      {/* Main Grid: Onboarding Candidates list & Active Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Candidates undergoing induction (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Pending Inductions ({onboardingList.length})
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
                      ? 'bg-amber-50/40 border-amber-600 shadow-xs ring-1 ring-amber-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{item.fullName}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.serviceType === 'Security'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.serviceType === 'Cleaning'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.serviceType === 'Property Management'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {item.serviceType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.employeeCode} · {item.role}</div>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-800">
                      {percent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target Start: <strong className="text-slate-800">{item.targetStartDate}</strong></span>
                    <span>{completedTasks}/{totalTasks} Done</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed Induction Checklist (8 cols) */}
        <div className="lg:col-span-8">
          {selectedChecklist ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedChecklist.fullName}</h2>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {selectedChecklist.employeeCode}
                    </span>
                    <span className="text-xs text-slate-500">· {selectedChecklist.role}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Designated client deployment: <strong className="text-slate-800">{selectedChecklist.initialSiteAssigned || 'TBD'}</strong>
                  </p>
                </div>

                {selectedChecklist.tasks.every(t => t.completed) && (
                  canActivateEmployee ? (
                    <button
                      type="button"
                      onClick={() => onCompleteOnboarding(selectedChecklist.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs self-start sm:self-auto"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Activate Employee</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ready for HR Activation</span>
                    </span>
                  )
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Required Onboarding Milestones
                  </span>
                  <span>
                    {isStorekeeper
                      ? 'Storekeeper: Uniform & Equipment tasks unlocked'
                      : isLegal
                      ? 'Legal: Police & Guarantor tasks unlocked'
                      : 'Click item to toggle completion'}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedChecklist.tasks.map((task) => {
                    const canToggle = isTaskAuthorizedForRole(task.category);
                    return (
                      <div
                        key={task.id}
                        onClick={() => {
                          if (canToggle) onToggleTask(selectedChecklist.id, task.id);
                        }}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                          !canToggle
                            ? 'bg-slate-50/60 border-slate-200/70 opacity-65 cursor-not-allowed'
                            : task.completed
                            ? 'bg-slate-50 border-emerald-300 text-slate-900 cursor-pointer'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            disabled={!canToggle}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 disabled:cursor-not-allowed"
                          />
                          <div>
                            <div className={`text-xs font-medium ${task.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                              {task.title}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span className={`px-1.5 py-0.2 rounded border text-[10px] font-medium ${
                                canToggle && (isStorekeeper || isLegal)
                                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                                  : 'bg-slate-100 border-slate-200 text-slate-600'
                              }`}>
                                {task.category}
                              </span>
                              {task.completedAt && (
                                <span>Verified on: {task.completedAt}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : !canToggle ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5" />
                            Other Dept
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono">
                            Pending
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs shadow-xs">
              Select an onboarding candidate from the left list.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
