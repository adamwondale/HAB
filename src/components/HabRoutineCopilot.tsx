import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Repeat,
  Layers,
} from 'lucide-react';
import {
  ManagementPerson,
  Employee,
  ClientSite,
  Deployment,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  StockItem,
  ClearanceRecord,
  OnboardingChecklist,
} from '../types/hrm';
import {
  CopilotAction,
  CopilotChatMessage,
  CopilotModelId,
  LearnedHabit,
  ProactiveNudge,
  RippleSimulationScenario,
  UserActionTelemetry,
} from '../types/copilot';
import { RIPPLE_SIMULATION_SCENARIOS } from '../utils/copilotEngine';
import { getRoleConfig } from '../utils/roleConfig';

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
  actionTelemetry,
  executedActionIds,
  onExecuteCopilotAction,
  onTriggerRippleScenario,
  toastMessage,
  onDismissToast,
  onNavigateTab,
}) => {
  const roleConfig = getRoleConfig(activeUser);
  const [activeNudgeIndex, setActiveNudgeIndex] = useState(0);
  const [isNudgeBarDismissed, setIsNudgeBarDismissed] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'chat' | 'habits' | 'simulator'>('chat');
  const [selectedModel, setSelectedModel] = useState<CopilotModelId>('gemini-3.8-flash');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const lowStockCount = stockItems.filter((s) => s.quantityInStock <= s.minReorderLevel).length;
  const pendingPayrollCount = payroll.filter((p) => p.paymentStatus !== 'Disbursed').length;
  const pendingLeaveCount = leaveRequests.filter((l) => l.status === 'Pending').length;

  const [messages, setMessages] = useState<CopilotChatMessage[]>(() => {
    const initialNudge = proactiveNudges[0];
    return [
      {
        id: 'msg-init-1',
        role: 'model',
        timestamp: 'Just now',
        modelUsed: 'gemini-3.8-flash',
        observation:
          initialNudge?.observation ||
          'Since you usually reconcile Bole Tower and CBE security attendance before approving payroll on Mondays, I have prepared both views for you.',
        tier: initialNudge?.tier || 1,
        tierLabel: initialNudge?.tierLabel || 'Tier 1 — Habit Shortcut',
        outcomeValue: initialNudge?.outcomeValue || 'Harmony',
        text: `Welcome back, ${activeUser.name}. I am monitoring Security, Cleaning, and Property Management across all 6 ERP modules.`,
        crossModuleImpact: initialNudge?.crossModuleImpact || [
          {
            module: 'HRM',
            impact: `${employees.length} active staff; ${attendance.length} shift logs tracked today.`,
          },
          {
            module: 'Inventory',
            impact: `${lowStockCount} store item(s) at or below reorder buffer.`,
          },
          {
            module: 'Finance',
            impact: `${pendingPayrollCount} payroll records queued for disbursement.`,
          },
        ],
        suggestedActions: initialNudge?.actions || [],
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && drawerTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, drawerTab]);

  const safeNudgeIndex =
    proactiveNudges.length > 0 ? activeNudgeIndex % proactiveNudges.length : 0;
  const currentNudge = proactiveNudges[safeNudgeIndex];

  const getPersonaQuickPrompts = (): string[] => {
    switch (roleConfig.type) {
      case 'finance':
        return [
          'Pending payroll vouchers & SLA billing',
          'Audit Gate #3 exit gear deductions',
          'Cost of restocking 20 drums of sanitizer',
        ];
      case 'storekeeper':
        return [
          'Items below safety stock buffer',
          'Uniform kits for onboarding recruits',
          'Ripple of restocking 20 drums sanitizer',
        ];
      case 'site_supervisor':
        return [
          'Morning shift check & unfilled posts',
          'Assign standby guard for leave requests',
          'Bole Complex generator service status',
        ];
      case 'hr_talent':
        return [
          'Guarantor verification & onboarding handoffs',
          'Trace onboarding ripple to Store & Finance',
          'Upcoming probation contract renewals',
        ];
      default:
        return [
          'Cross-division margins & operational risks',
          'Run Monday attendance-to-payroll routine',
          'Impact of onboarding 3 guards for Kazanchis',
        ];
    }
  };

  const buildLiveErpContext = () => {
    const lowStock = stockItems
      .filter((s) => s.quantityInStock <= s.minReorderLevel)
      .map((s) => ({
        name: s.name,
        division: s.division,
        inStock: s.quantityInStock,
        minLevel: s.minReorderLevel,
        unit: s.unit,
        unitCostETB: s.unitCostETB,
      }));

    const siteGaps = sites.map((s) => ({
      name: s.name,
      subcity: s.subcity,
      securityDeployed: `${s.securityStaffDeployed}/${s.securityStaffRequired}`,
      cleaningDeployed: `${s.cleaningStaffDeployed}/${s.cleaningStaffRequired}`,
      status: s.status,
    }));

    return {
      totalEmployees: employees.length,
      divisions: {
        security: employees.filter((e) => e.serviceType === 'Security').length,
        cleaning: employees.filter((e) => e.serviceType === 'Cleaning').length,
        propertyManagement: employees.filter((e) => e.serviceType === 'Property Management').length,
        headOffice: employees.filter((e) => e.serviceType === 'Head Office Staff').length,
      },
      siteCoverage: siteGaps,
      lowStockItems: lowStock,
      pendingLeaveRequests: pendingLeaveCount,
      pendingPayrollVouchers: pendingPayrollCount,
      totalMonthlyGrossPayrollETB: payroll.reduce((sum, p) => sum + p.grossPay, 0),
      activeOnboardingRecruits: onboardingList.map((o) => ({
        name: o.fullName,
        role: o.role,
        serviceType: o.serviceType,
        site: o.initialSiteAssigned,
        progressPercent: o.progressPercent,
      })),
      pendingExitClearances: clearances
        .filter((c) => c.status === 'In Progress')
        .map((c) => ({
          employeeName: c.employeeName,
          siteName: c.siteName,
          unreturnedGearCostETB: c.financeSignoff?.unreturnedGearCost || 0,
        })),
    };
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText ?? inputPrompt).trim();
    if (!textToSend || isLoading) return;

    if (!promptText) {
      setInputPrompt('');
    }
    setErrorBanner(null);

    const userMsg: CopilotChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedHistory.map((m) => ({
            role: m.role,
            text: m.observation ? `${m.observation}\n${m.text}` : m.text,
          })),
          erpContext: buildLiveErpContext(),
          activeRole: {
            id: activeUser.id,
            name: activeUser.name,
            title: activeUser.title,
            department: activeUser.department,
            roleType: roleConfig.type,
          },
          learnedHabits: learnedHabits.map((h) => ({
            name: h.name,
            category: h.category,
            confidence: `${h.confidence}%`,
            promptRule: h.promptRule,
          })),
          recentActions: actionTelemetry.slice(0, 6),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to reach HAB Routine Copilot service.');
      }

      const data = result.data || {};
      const modelMsg: CopilotChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: result.modelUsed || selectedModel,
        observation: data.observation || 'Live cross-departmental state analyzed across all 6 ERP modules.',
        tier: (data.tier === 1 || data.tier === 2 || data.tier === 3 ? data.tier : 2) as 1 | 2 | 3,
        tierLabel: data.tierLabel || 'Tier 2 — Workflow Handoff',
        outcomeValue: data.outcomeValue || 'Harmony',
        text: data.conversationalReply || 'Here is the cross-departmental impact and your 1-click actions.',
        crossModuleImpact: Array.isArray(data.crossModuleImpact) ? data.crossModuleImpact : [],
        suggestedActions: Array.isArray(data.suggestedActions)
          ? data.suggestedActions.map((act: any, idx: number) => ({
              id: `ai-act-${Date.now()}-${idx}`,
              actionType: act.actionType || 'NAVIGATE_MODULE',
              label: act.label || 'Execute Action',
              targetModule: act.targetModule || 'Management Dashboard',
              targetTabId: act.targetTabId || 'overview',
              description: act.description || 'Execute cross-departmental workflow update.',
            }))
          : [],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      setErrorBanner(err?.message || 'Connection error while contacting Gemini Copilot.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateScenarioInChat = (scenario: RippleSimulationScenario) => {
    onTriggerRippleScenario(scenario);
    const simMsg: CopilotChatMessage = {
      id: `sim-${Date.now()}`,
      role: 'model',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
      observation: scenario.observation,
      tier: scenario.tier,
      tierLabel: scenario.tierLabel,
      outcomeValue: scenario.outcomeValue,
      text: `Simulated ${scenario.category}: "${scenario.title}". Review the cross-module impact and 1-click actions below.`,
      crossModuleImpact: scenario.crossModuleImpact,
      suggestedActions: scenario.actions,
    };
    setMessages((prev) => [...prev, simMsg]);
    setDrawerTab('chat');
  };

  const primaryAction = currentNudge?.actions[0];

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. QUIET SINGLE-LINE SMART NUDGE STRIP                                */}
      {/* ===================================================================== */}
      {currentNudge && !isNudgeBarDismissed && (
        <section
          aria-label="HAB Routine Copilot Smart Nudge Bar"
          className="bg-[#FFFDE8] dark:bg-slate-900 border-b border-[#EFE1AA] dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2 transition-colors"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            {/* Left: Concise Observation */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0E1525] dark:text-[#EBE834] shrink-0">
                <Brain className="w-3.5 h-3.5" />
                <span>Copilot</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">|</span>
              <p className="text-[#0E1525] dark:text-slate-200 truncate">
                {currentNudge.observation}
              </p>
            </div>

            {/* Right: Primary 1-Click Action + Pager + Drawer Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              {primaryAction && (() => {
                const isDone = executedActionIds.includes(primaryAction.actionType);
                return (
                  <button
                    type="button"
                    onClick={() => onExecuteCopilotAction(primaryAction)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                      isDone
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB]'
                    }`}
                    title={primaryAction.description}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                    ) : (
                      <Zap className="w-3 h-3 text-[#EBE834] shrink-0" />
                    )}
                    <span>{isDone ? 'Applied' : primaryAction.label}</span>
                  </button>
                );
              })()}

              <button
                type="button"
                onClick={onOpen}
                className="px-2.5 py-1 rounded-md bg-[#FFF9DB] hover:bg-[#F5EAB8] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 text-[#0E1525] dark:text-slate-200 font-semibold cursor-pointer whitespace-nowrap"
              >
                Details ({ currentNudge.crossModuleImpact.length } modules)
              </button>

              {proactiveNudges.length > 1 && (
                <div className="flex items-center gap-0.5 text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveNudgeIndex((prev) =>
                        prev === 0 ? proactiveNudges.length - 1 : prev - 1
                      )
                    }
                    className="p-1 hover:text-[#0E1525] dark:hover:text-white cursor-pointer"
                    aria-label="Previous nudge"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>
                    {safeNudgeIndex + 1}/{proactiveNudges.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveNudgeIndex((prev) => (prev + 1) % proactiveNudges.length)
                    }
                    className="p-1 hover:text-[#0E1525] dark:hover:text-white cursor-pointer"
                    aria-label="Next nudge"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsNudgeBarDismissed(true)}
                className="p-1 text-slate-400 hover:text-[#0E1525] dark:hover:text-white cursor-pointer"
                aria-label="Dismiss nudge bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 2. CONFIRMATION TOAST FOR 1-CLICK COPILOT EXECUTION                   */}
      {/* ===================================================================== */}
      {toastMessage && (
        <section
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#0E1525] text-white border border-[#EBE834]/50 rounded-lg p-3.5 shadow-xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-4 h-4 text-[#EBE834] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#EBE834]">{toastMessage.title}</div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage.detail}</p>
            {toastMessage.targetTabId && (
              <button
                type="button"
                onClick={() => {
                  onNavigateTab(toastMessage.targetTabId!);
                  onDismissToast();
                }}
                className="mt-1.5 text-[11px] font-semibold text-[#EBE834] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Module</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onDismissToast}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. SLIDE-OVER COPILOT DRAWER                                          */}
      {/* ===================================================================== */}
      {isOpen && (
        <section aria-label="HAB Routine Copilot Drawer" className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-xs transition-opacity"
          />

          <aside className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-[#EFE1AA] dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl">
            {/* Drawer Header */}
            <div className="bg-[#FFF9DB] dark:bg-slate-900 border-b border-[#EFE1AA] dark:border-slate-800 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-[#0E1525] text-[#EBE834] shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100 truncate">
                      HAB Routine Copilot
                    </h2>
                    <p className="text-[11px] text-[#0E1525]/70 dark:text-slate-400 truncate">
                      {activeUser.name} · {activeUser.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#0E1525]/70 hover:text-[#0E1525] hover:bg-black/5 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  aria-label="Close Copilot drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Tabs + Model Selector */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-[#EFE1AA] dark:border-slate-800">
                <div className="flex items-center gap-1 p-0.5 bg-[#FFFDE8] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDrawerTab('chat')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      drawerTab === 'chat'
                        ? 'bg-[#0E1525] text-[#FFF9DB]'
                        : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerTab('habits')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      drawerTab === 'habits'
                        ? 'bg-[#0E1525] text-[#FFF9DB]'
                        : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                    }`}
                  >
                    Routines ({learnedHabits.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerTab('simulator')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      drawerTab === 'simulator'
                        ? 'bg-[#0E1525] text-[#FFF9DB]'
                        : 'text-[#0E1525]/75 dark:text-slate-300 hover:text-[#0E1525]'
                    }`}
                  >
                    Ripple Lab
                  </button>
                </div>

                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as CopilotModelId)}
                  aria-label="Select Gemini Intelligence Mode"
                  className="bg-[#FFFDE8] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-medium text-[#0E1525] dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="gemini-3.1-flash-lite">Flash Lite</option>
                  <option value="gemini-3.8-flash">3.8 Flash</option>
                  <option value="gemini-4-argon">4 Argon</option>
                </select>
              </div>
            </div>

            {/* =============================================================== */}
            {/* TAB 1: CLEAN MULTI-TURN CHAT THREAD                             */}
            {/* =============================================================== */}
            {drawerTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/40">
                  {messages.map((msg) => {
                    if (msg.role === 'user') {
                      return (
                        <div key={msg.id} className="flex justify-end">
                          <div className="max-w-[85%] rounded-xl bg-[#0E1525] text-[#FFF9DB] px-3.5 py-2.5">
                            <p className="text-xs leading-relaxed">{msg.text}</p>
                            <div className="text-[10px] text-slate-400 mt-1 text-right font-mono tabular-nums">
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                      >
                        {/* Quiet Metadata Line */}
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>
                            {msg.tierLabel || 'Routine Insight'}
                            {msg.outcomeValue ? ` · ${msg.outcomeValue}` : ''}
                          </span>
                          <span className="font-mono tabular-nums">{msg.timestamp}</span>
                        </div>

                        {/* Observation */}
                        {msg.observation && (
                          <p className="text-xs sm:text-[13px] font-semibold text-[#0E1525] dark:text-slate-100 leading-snug">
                            {msg.observation}
                          </p>
                        )}

                        {/* Conversational Note */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {msg.text}
                        </p>

                        {/* Cross-Module Ripple List (Flat hairline rows, no nested boxes) */}
                        {msg.crossModuleImpact && msg.crossModuleImpact.length > 0 && (
                          <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
                            {msg.crossModuleImpact.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-1.5 text-xs flex items-baseline gap-2"
                              >
                                <span className="font-semibold text-[#0E1525] dark:text-[#EBE834] w-28 shrink-0 truncate">
                                  {item.module}
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 flex-1">
                                  {item.impact}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 1-Click Decisions */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                            {msg.suggestedActions.map((act) => {
                              const isExecuted = executedActionIds.includes(act.actionType);
                              return (
                                <button
                                  key={act.id}
                                  type="button"
                                  onClick={() => onExecuteCopilotAction(act)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    isExecuted
                                      ? 'bg-emerald-700 text-white'
                                      : 'bg-[#EBE834] hover:bg-[#E3E029] text-[#0E1525] border border-[#D4D11E]'
                                  }`}
                                  title={act.description}
                                >
                                  {isExecuted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  ) : (
                                    <Zap className="w-3.5 h-3.5 shrink-0" />
                                  )}
                                  <span>{isExecuted ? `${act.label} (Done)` : act.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 animate-pulse">
                      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  )}

                  {errorBanner && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorBanner}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts + Chat Input */}
                <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {getPersonaQuickPrompts().map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="px-2.5 py-1 rounded-md bg-[#FFFDE8] hover:bg-[#FFF9DB] dark:bg-slate-800 border border-[#EFE1AA] dark:border-slate-700 text-[11px] font-medium text-[#0E1525] dark:text-slate-200 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      placeholder="Ask Copilot about routines, staffing, inventory, or payroll..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-[#0E1525] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0E1525]"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputPrompt.trim()}
                      className="px-3.5 py-2 rounded-lg bg-[#0E1525] hover:bg-[#19233C] disabled:opacity-50 text-[#EBE834] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* =============================================================== */}
            {/* TAB 2: LEARNED ROUTINES                                         */}
            {/* =============================================================== */}
            {drawerTab === 'habits' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/40">
                {learnedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {habit.category === 'Time-Based Routine' && <Clock className="w-3.5 h-3.5" />}
                          {habit.category === 'Sequential Chain (Habit Loop)' && <Repeat className="w-3.5 h-3.5" />}
                          {habit.category === 'Preference Memory' && <Layers className="w-3.5 h-3.5" />}
                          <span>{habit.category}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{habit.occurrences}x</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0E1525] dark:text-slate-100 mt-0.5">
                          {habit.name}
                        </h4>
                      </div>

                      <span className="text-xs font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {habit.confidence}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {habit.promptRule}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500">
                        {habit.linkedModules.join(' → ')}
                      </span>
                      <div className="flex gap-1.5">
                        {habit.defaultActions.map((act) => (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => onExecuteCopilotAction(act)}
                            className="px-2.5 py-1 rounded-md bg-[#0E1525] hover:bg-[#19233C] text-[#FFF9DB] text-[11px] font-semibold cursor-pointer"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB 3: RIPPLE SIMULATOR LAB                                     */}
            {/* =============================================================== */}
            {drawerTab === 'simulator' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/40">
                {RIPPLE_SIMULATION_SCENARIOS.map((scen) => (
                  <div
                    key={scen.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{scen.category}</span>
                      <span>{scen.tierLabel}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {scen.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {scen.triggerDescription}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500">
                        {scen.crossModuleImpact.map((c) => c.module).join(' → ')}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSimulateScenarioInChat(scen)}
                        className="px-3 py-1 rounded-md bg-[#EBE834] hover:bg-[#E3E029] text-[#0E1525] border border-[#D4D11E] text-xs font-semibold cursor-pointer"
                      >
                        Simulate Ripple
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>
      )}
    </>
  );
};
