import React from 'react';
import { Layers, ArrowRight, PlayCircle } from 'lucide-react';
import { RippleSimulationScenario } from '../../types/copilot';
import { RIPPLE_SIMULATION_SCENARIOS } from '../../utils/copilotEngine';

interface CopilotSimulatorTabProps {
  onTriggerScenario: (scenario: RippleSimulationScenario) => void;
  onSimulateInChat: (scenario: RippleSimulationScenario) => void;
}

export const CopilotSimulatorTab: React.FC<CopilotSimulatorTabProps> = ({
  onTriggerScenario,
  onSimulateInChat
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#F2C46A]" />
          <span>Operational Ripple Simulator</span>
        </h4>
        <p className="text-[11px] text-slate-500">
          Simulate cross-departmental impact of operational changes across HR, Shift Rosters, Payroll, and Store stock
        </p>
      </div>

      {RIPPLE_SIMULATION_SCENARIOS.map((scenario) => (
        <div
          key={scenario.id}
          className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-100">{scenario.title}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {scenario.tierLabel}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{scenario.triggerDescription}</p>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onSimulateInChat(scenario)}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer"
            >
              Analyze in Chat
            </button>
            <button
              type="button"
              onClick={() => onTriggerScenario(scenario)}
              className="px-3 py-1 rounded bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-[11px] inline-flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Simulate Ripple</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
