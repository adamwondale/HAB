import React, { useState } from 'react';
import { TrendingUp, Search, Save, CheckCircle2 } from 'lucide-react';
import { Employee } from '../../types/hrm';
import { INITIAL_EMPLOYEES } from '../../data/mockData';

export interface PerformanceEvaluation {
  employeeId: string;
  punctuality: number;
  taskExecution: number;
  teamwork: number;
  slaCompliance: number;
  notes: string;
  incrementRecommended: boolean;
  evaluatedDate: string;
}

interface PerformanceEvaluationViewProps {
  employees?: Employee[];
  onSaveEvaluation?: (evaluation: PerformanceEvaluation) => void;
}

export const PerformanceEvaluationView: React.FC<PerformanceEvaluationViewProps> = ({
  employees = INITIAL_EMPLOYEES,
  onSaveEvaluation
}) => {
  const [selectedId, setSelectedId] = useState<string>(employees[0]?.id || 'emp-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [punctuality, setPunctuality] = useState<number>(24);
  const [taskExecution, setTaskExecution] = useState<number>(23);
  const [teamwork, setTeamwork] = useState<number>(24);
  const [slaCompliance, setSlaCompliance] = useState<number>(23);
  const [notes, setNotes] = useState('Demonstrates exceptional site leadership and punctuality.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedEmp = employees.find(e => e.id === selectedId) || employees[0];
  const overallKpi = punctuality + taskExecution + teamwork + slaCompliance;

  const getRatingTier = (score: number) => {
    if (score >= 90) return { label: 'Excellent', tone: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 75) return { label: 'Good', tone: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 60) return { label: 'Satisfactory', tone: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Needs Improvement', tone: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const rating = getRatingTier(overallKpi);
  const isIncrementEligible = overallKpi >= 85;

  const filtered = employees.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.employeeCode.toLowerCase().includes(q);
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;
    const record: PerformanceEvaluation = {
      employeeId: selectedEmp.id,
      punctuality,
      taskExecution,
      teamwork,
      slaCompliance,
      notes,
      incrementRecommended: isIncrementEligible,
      evaluatedDate: new Date().toISOString().split('T')[0]
    };
    if (onSaveEvaluation) onSaveEvaluation(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCF0DA] text-[#4C4541] border border-[#F2C46A]/50 dark:bg-slate-800 dark:text-[#F2C46A]">
              HR Competency Scoring
            </span>
            <span className="text-xs text-slate-500">4-Pillar Evaluation Engine</span>
          </div>
          <h1 className="text-lg font-bold text-slate-950 dark:text-white mt-0.5">
            Performance Evaluation & KPI Scoring
          </h1>
          <p className="text-xs text-slate-500">Evaluate competencies and qualify annual salary increments.</p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Workforce Avg</span><span className="font-mono font-bold text-slate-900 dark:text-white">92.4%</span></div>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Increment Pool</span><span className="font-bold text-emerald-700 dark:text-emerald-400">+10% Eligible</span></div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Selector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search staff roster..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs rounded-lg pl-7 pr-2.5 py-1 focus:border-[#F2C46A] focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[420px]">
            {filtered.map(emp => (
              <div
                key={emp.id}
                onClick={() => setSelectedId(emp.id)}
                className={`p-2.5 transition-colors cursor-pointer flex items-center justify-between text-xs ${
                  emp.id === selectedId ? 'bg-[#FCF0DA]/60 dark:bg-slate-800 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded bg-[#F2C46A] text-[#4C4541] font-bold text-xs flex items-center justify-center shrink-0">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div className="truncate">
                    <div className="text-slate-900 dark:text-white font-bold truncate">{emp.firstName} {emp.lastName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{emp.employeeCode} · {emp.serviceType}</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  94%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Scoring Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">Competency Scoring: {selectedEmp.firstName} {selectedEmp.lastName}</h2>
              <p className="text-[10px] text-slate-500 font-mono">{selectedEmp.employeeCode} · {selectedEmp.role} · Base ETB {selectedEmp.salary.baseSalary.toLocaleString()}</p>
            </div>
            <div className={`px-2 py-0.5 rounded border text-xs font-bold ${rating.tone}`}>
              {overallKpi}% · {rating.label}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between font-semibold"><span>1. Punctuality</span><span className="font-mono text-amber-800 dark:text-[#F2C46A]">{punctuality} / 25 pts</span></div>
              <input type="range" min={0} max={25} value={punctuality} onChange={e => setPunctuality(Number(e.target.value))} className="w-full accent-amber-600" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between font-semibold"><span>2. Task Execution</span><span className="font-mono text-amber-800 dark:text-[#F2C46A]">{taskExecution} / 25 pts</span></div>
              <input type="range" min={0} max={25} value={taskExecution} onChange={e => setTaskExecution(Number(e.target.value))} className="w-full accent-amber-600" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between font-semibold"><span>3. Teamwork</span><span className="font-mono text-amber-800 dark:text-[#F2C46A]">{teamwork} / 25 pts</span></div>
              <input type="range" min={0} max={25} value={teamwork} onChange={e => setTeamwork(Number(e.target.value))} className="w-full accent-amber-600" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between font-semibold"><span>4. SLA Compliance</span><span className="font-mono text-amber-800 dark:text-[#F2C46A]">{slaCompliance} / 25 pts</span></div>
              <input type="range" min={0} max={25} value={slaCompliance} onChange={e => setSlaCompliance(Number(e.target.value))} className="w-full accent-amber-600" />
            </div>
          </div>

          <div className="p-2.5 bg-[#FCF0DA]/60 dark:bg-slate-800/90 border border-[#F2C46A]/60 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-800 dark:text-[#F2C46A]" />
              <div>
                <span className="font-bold text-[#4C4541] dark:text-[#F2C46A]">Salary Increment Recommendation</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                  {isIncrementEligible ? 'Eligible for +10% annual merit increment (Score >= 85%)' : 'Below 85% threshold; increment deferred.'}
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isIncrementEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
              {isIncrementEligible ? 'Recommended' : 'Deferred'}
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Review Notes & Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:border-[#F2C46A] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Appraisal Saved!</span>
              </span>
            ) : <span />}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Appraisal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
