export type ErpModuleName =
  | 'HRM'
  | 'Finance'
  | 'Inventory'
  | 'Asset Management'
  | 'Property/Sales'
  | 'Management Dashboard';

export type UrgencyTier = 1 | 2 | 3;

export type OutcomeValue =
  | 'Harmony'
  | 'Accomplishment'
  | 'Security'
  | 'Truth'
  | 'Oneness';

export type CopilotModelId =
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.8-flash'
  | 'gemini-4-argon';

export type CopilotActionType =
  | 'APPROVE_PAYROLL_VOUCHER'
  | 'AUTO_RESTOCK_SANITIZER'
  | 'AUTO_RESTOCK_BOOTS'
  | 'ASSIGN_RELIEF_GUARD'
  | 'ISSUE_UNIFORM_QUEUE_PAYROLL'
  | 'RECONCILE_BOLE_ATTENDANCE'
  | 'APPROVE_CLEARANCE_SETTLEMENT'
  | 'SCHEDULE_GENERATOR_MAINTENANCE'
  | 'NAVIGATE_MODULE';

export interface CopilotAction {
  id: string;
  actionType: CopilotActionType;
  label: string;
  targetModule: ErpModuleName;
  targetTabId: string;
  description: string;
  executed?: boolean;
}

export interface CrossModuleImpactItem {
  module: ErpModuleName;
  impact: string;
}

export interface ProactiveNudge {
  id: string;
  tier: UrgencyTier;
  tierLabel: string;
  outcomeValue: OutcomeValue;
  personaTarget: string[]; // e.g., ['executive', 'finance', 'hr_head']
  routineReason: string;
  observation: string;
  crossModuleImpact: CrossModuleImpactItem[];
  actions: CopilotAction[];
  timestamp: string;
  dismissed?: boolean;
}

export type HabitCategory =
  | 'Time-Based Routine'
  | 'Sequential Chain (Habit Loop)'
  | 'Preference Memory';

export interface LearnedHabit {
  id: string;
  name: string;
  category: HabitCategory;
  confidence: number;
  occurrences: number;
  lastTriggered: string;
  patternDescription: string;
  promptRule: string;
  personaIds: string[];
  linkedModules: ErpModuleName[];
  defaultActions: CopilotAction[];
}

export interface UserActionTelemetry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  module: ErpModuleName;
  actionLabel: string;
  rippleSummary: string;
}

export interface CopilotChatMessage {
  id: string;
  role: 'user' | 'model';
  timestamp: string;
  modelUsed?: string;
  text: string;
  observation?: string;
  tier?: UrgencyTier;
  tierLabel?: string;
  outcomeValue?: OutcomeValue;
  crossModuleImpact?: CrossModuleImpactItem[];
  suggestedActions?: CopilotAction[];
}

export interface RippleSimulationScenario {
  id: string;
  category: 'HRM Event' | 'Operations / Property Event' | 'Inventory / Asset Event' | 'Finance Event';
  title: string;
  triggerDescription: string;
  tier: UrgencyTier;
  tierLabel: string;
  outcomeValue: OutcomeValue;
  observation: string;
  crossModuleImpact: CrossModuleImpactItem[];
  actions: CopilotAction[];
}
