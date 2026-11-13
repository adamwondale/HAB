import React, { useState } from 'react';
import { Search, Phone, ArrowRight, FileText } from 'lucide-react';
import { Candidate, ServiceType } from '../../types/hrm';

interface CandidateIntakeGridProps {
  candidates: Candidate[];
  onAdvanceStage: (candidateId: string, nextStage: Candidate['stage']) => void;
  onSendToOnboarding: (candidate: Candidate) => void;
  onPreviewDossier: (candidate: Candidate) => void;
}

export const CandidateIntakeGrid: React.FC<CandidateIntakeGridProps> = ({
  candidates,
  onAdvanceStage,
  onSendToOnboarding,
  onPreviewDossier
}) => {
  const [selectedService, setSelectedService] = useState<'All' | ServiceType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const stages: Candidate['stage'][] = ['Applied', 'Screened', 'Interview', 'Background Check', 'Offer Issued'];

  const filtered = candidates.filter(c => {
    if (selectedService !== 'All' && c.targetService !== selectedService) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.fullName.toLowerCase().includes(q) || c.candidateCode.toLowerCase().includes(q) || c.targetRole.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Centralized Intake Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 text-xs">
          {(['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'] as const).map(div => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedService(div)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedService === div ? 'bg-[#FCF0DA] text-[#4C4541] font-bold border border-[#F2C46A]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {div === 'All' ? `All (${candidates.length})` : div}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, role, code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus:border-[#F2C46A] focus:outline-none"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cand => (
          <div key={cand.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-700 dark:text-slate-300">
                  {cand.candidateCode}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCF0DA] text-[#4C4541] border border-[#F2C46A]/50">
                  {cand.targetService}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-950 dark:text-white">{cand.fullName}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{cand.phone}</span>
                </div>
              </div>

              <div className="text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Target Role:</span><span className="font-semibold">{cand.targetRole}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Experience:</span><span>{cand.experienceYears} Years</span></div>
                {cand.interviewScore && <div className="flex justify-between"><span className="text-slate-500">Interview:</span><span className="font-bold text-emerald-700">{cand.interviewScore}/100</span></div>}
              </div>

              {/* Clickable CV & Dossier Link */}
              <button
                type="button"
                onClick={() => onPreviewDossier(cand)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#4C4541] dark:text-[#F2C46A] font-semibold text-[11px] rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Preview CV & Credentials</span>
              </button>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Current Stage</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{cand.stage}</span>
              </div>

              {cand.stage === 'Offer Issued' ? (
                <button
                  type="button"
                  onClick={() => onSendToOnboarding(cand)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>To Onboarding</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const curIdx = stages.indexOf(cand.stage);
                    if (curIdx < stages.length - 1) onAdvanceStage(cand.id, stages[curIdx + 1]);
                  }}
                  className="px-3 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Advance</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
