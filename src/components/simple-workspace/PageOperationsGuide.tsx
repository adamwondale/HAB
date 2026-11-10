import React from 'react';
import { HelpCircle, ChevronUp, ChevronDown, CheckCircle2, User, MousePointerClick } from 'lucide-react';

export interface OperationGuideContent {
  summary: string;
  whoUsesIt: string;
  workflow: string[];
  buttons: {
    label: string;
    description: string;
  }[];
}

interface PageOperationsGuideProps {
  guide: OperationGuideContent;
  isOpen: boolean;
  onToggle: () => void;
}

export const PageOperationsGuide: React.FC<PageOperationsGuideProps> = ({
  guide,
  isOpen,
  onToggle
}) => {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/60 transition-all dark:border-sky-900/60 dark:bg-sky-950/20">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-sky-900 hover:bg-sky-100/50 dark:text-sky-200 dark:hover:bg-sky-900/30 rounded-xl"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span>Operations & Button Guide: How to use this page</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-sky-700 dark:text-sky-400">
          {isOpen ? 'Hide guide' : 'Show guide'}
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-sky-200/80 p-4 space-y-4 text-xs dark:border-sky-900/60">
          {/* Persona & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-sky-200/60 dark:border-sky-900/40">
            <div>
              <p className="font-bold text-sky-950 dark:text-white uppercase tracking-wider text-[10px]">What this page does</p>
              <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">{guide.summary}</p>
            </div>
            <div>
              <p className="font-bold text-sky-950 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1">
                <User className="h-3 w-3 text-sky-600" /> Who operates this
              </p>
              <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">{guide.whoUsesIt}</p>
            </div>
          </div>

          {/* Buttons & Actions */}
          <div>
            <p className="font-bold text-sky-950 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1 mb-2">
              <MousePointerClick className="h-3 w-3 text-sky-600" /> Clickable Buttons on this page & what they do
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {guide.buttons.map((btn) => (
                <div key={btn.label} className="rounded-lg border border-sky-200/70 bg-white p-2.5 shadow-2xs dark:border-sky-900/40 dark:bg-slate-900">
                  <span className="inline-block rounded bg-sky-100 px-2 py-0.5 font-mono text-[11px] font-bold text-sky-900 dark:bg-sky-950 dark:text-sky-200">
                    {btn.label}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{btn.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Sequence */}
          <div>
            <p className="font-bold text-sky-950 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1 mb-1.5">
              <CheckCircle2 className="h-3 w-3 text-sky-600" /> Standard step-by-step operation
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
              {guide.workflow.map((step, idx) => (
                <li key={idx} className="leading-snug">
                  <strong className="text-slate-900 dark:text-white font-medium">Step {idx + 1}:</strong> {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
