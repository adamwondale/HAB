import React, { useState } from 'react';
import { Brain, X, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  ManagementPerson, Employee, ClientSite, Deployment, AttendanceRecord,
  LeaveRequest, PayrollRecord, StockItem, ClearanceRecord, OnboardingChecklist
} from '../types/hrm';
import {
  CopilotAction, CopilotChatMessage, CopilotModelId, LearnedHabit,
  ProactiveNudge, RippleSimulationScenario, UserActionTelemetry
} from '../types/copilot';
import { getRoleConfig } from '../utils/roleConfig';
import { CopilotNudgeBar } from './copilot/CopilotNudgeBar';
import { CopilotChatTab } from './copilot/CopilotChatTab';
import { CopilotHabitsTab } from './copilot/CopilotHabitsTab';
import { CopilotSimulatorTab } from './copilot/CopilotSimulatorTab';
import { buildLiveErpContext, getPersonaQuickPrompts, createLocalFallbackReply } from './copilot/copilotHelpers';

interface HabRoutineCopilotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  activeUser: ManagementPerson;
  employees: Employee[];
  sites: ClientSite[];
  deployments: Deployment[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  stockItems: StockItem[];
  clearances: ClearanceRecord[];
  onboardingList: OnboardingChecklist[];
  proactiveNudges: ProactiveNudge[];
  learnedHabits: LearnedHabit[];
  actionTelemetry: UserActionTelemetry[];
  executedActionIds: string[];
  onExecuteCopilotAction: (action: CopilotAction) => void;
  onTriggerRippleScenario: (scenario: RippleSimulationScenario) => void;
  toastMessage: { title: string; detail: string; targetTabId?: string } | null;
  onDismissToast: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const HabRoutineCopilot: React.FC<HabRoutineCopilotProps> = ({
  isOpen,
  onOpen,
  onClose,
  activeUser,
  employees,
  sites,
  attendance,
  leaveRequests,
  payroll,
  stockItems,
  clearances,
  onboardingList,
  proactiveNudges,
  learnedHabits,
  onExecuteCopilotAction,
  onTriggerRippleScenario,
  toastMessage,
  onDismissToast,
  onNavigateTab
}) => {
  const roleConfig = getRoleConfig(activeUser);
  const [activeNudgeIndex, setActiveNudgeIndex] = useState(0);
  const [isNudgeBarDismissed, setIsNudgeBarDismissed] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'chat' | 'habits' | 'simulator'>('chat');
  const [selectedModel, setSelectedModel] = useState<CopilotModelId>('gemini-3.8-flash');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<CopilotChatMessage[]>([
    {
      id: 'init-msg',
      role: 'model',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${activeUser.name || 'there'}! I am your HAB Routine Copilot. You are signed in as ${roleConfig.title}. How can I assist your operations today?`
    }
  ]);

  const quickPrompts = getPersonaQuickPrompts(roleConfig.type);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText ?? inputPrompt).trim();
    if (!textToSend || isLoading) return;

    if (!promptText) setInputPrompt('');
    const userMsg: CopilotChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: updated.map((m) => ({ role: m.role, text: m.text })),
          erpContext: buildLiveErpContext({ employees, sites, attendance, leaveRequests, payroll, stockItems, clearances, onboardingList })
        })
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || {};
        const modelMsg: CopilotChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.conversationalReply || 'Operational review completed.'
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error('API returned non-200');
      }
    } catch {
      // Intelligent local fallback answering
      const fallback = createLocalFallbackReply(textToSend);
      const fallbackMsg: CopilotChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: fallback.reply,
        suggestedActions: fallback.action ? [fallback.action] : undefined
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Proactive Nudge Bar */}
      <CopilotNudgeBar
        nudges={proactiveNudges}
        activeIndex={activeNudgeIndex}
        isDismissed={isNudgeBarDismissed}
        onPrev={() => setActiveNudgeIndex((p) => (p === 0 ? proactiveNudges.length - 1 : p - 1))}
        onNext={() => setActiveNudgeIndex((p) => (p + 1) % proactiveNudges.length)}
        onDismiss={() => setIsNudgeBarDismissed(true)}
        onOpenCopilot={onOpen}
        onExecuteAction={onExecuteCopilotAction}
      />

      {/* 2. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#4C4541] text-white border border-[#F2C46A]/50 rounded-xl p-3.5 shadow-xl flex items-start gap-3 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#F2C46A] shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-[#F2C46A]">{toastMessage.title}</div>
            <p className="text-slate-200 mt-0.5">{toastMessage.detail}</p>
            {toastMessage.targetTabId && (
              <button
                type="button"
                onClick={() => { onNavigateTab(toastMessage.targetTabId!); onDismissToast(); }}
                className="mt-1 text-[11px] font-bold text-[#F2C46A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Module</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <button type="button" onClick={onDismissToast} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Slide-Over Copilot Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#FCF0DA] dark:bg-[#2C2724]">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#4C4541] dark:text-[#F2C46A]" />
                <div>
                  <h3 className="font-bold text-sm text-[#4C4541] dark:text-slate-100">HAB Routine Copilot</h3>
                  <p className="text-[10px] text-slate-500">Autonomous operational assistant & routine engine</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-black/5 text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtab Switcher */}
            <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex gap-1 text-xs">
                {(['chat', 'habits', 'simulator'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDrawerTab(tab)}
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] capitalize cursor-pointer transition-colors ${
                      drawerTab === tab
                        ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'chat' ? 'Chat' : tab === 'habits' ? `Routines (${learnedHabits.length})` : 'Ripple Lab'}
                  </button>
                ))}
              </div>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as CopilotModelId)}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="gemini-3.8-flash">Flash 3.8</option>
                <option value="gemini-2.5-pro">Pro 2.5</option>
              </select>
            </div>

            {/* Drawer Body */}
            {drawerTab === 'chat' && (
              <CopilotChatTab
                messages={messages}
                inputPrompt={inputPrompt}
                isLoading={isLoading}
                quickPrompts={quickPrompts}
                onInputChange={setInputPrompt}
                onSendMessage={handleSendMessage}
                onExecuteAction={(act) => {
                  onExecuteCopilotAction(act);
                  if (act.targetTabId) onNavigateTab(act.targetTabId);
                }}
              />
            )}

            {drawerTab === 'habits' && (
              <CopilotHabitsTab
                learnedHabits={learnedHabits}
                onExecuteAction={(act) => {
                  onExecuteCopilotAction(act);
                  if (act.targetTabId) onNavigateTab(act.targetTabId);
                }}
              />
            )}

            {drawerTab === 'simulator' && (
              <CopilotSimulatorTab
                onTriggerScenario={onTriggerRippleScenario}
                onSimulateInChat={(scenario) => {
                  onTriggerRippleScenario(scenario);
                  setDrawerTab('chat');
                  handleSendMessage(`Analyze ripple simulation for: ${scenario.title}`);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
