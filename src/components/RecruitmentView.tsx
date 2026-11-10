import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Candidate, ServiceType } from '../types/hrm';

interface RecruitmentViewProps {
  candidates: Candidate[];
  onUpdateCandidateStage: (candidateId: string, nextStage: Candidate['stage']) => void;
  onSendToOnboarding: (candidate: Candidate) => void;
  onAddCandidate: (newCandidate: Candidate) => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({
  candidates,
  onUpdateCandidateStage,
  onSendToOnboarding,
  onAddCandidate
}) => {
  const [selectedService, setSelectedService] = useState<'All' | ServiceType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [targetService, setTargetService] = useState<ServiceType>('Security');
  const [targetRole, setTargetRole] = useState('Security Guard');
  const [experienceYears, setExperienceYears] = useState(2);
  const [notes, setNotes] = useState('');

  const filteredCandidates = candidates.filter(c => {
    if (selectedService !== 'All' && c.targetService !== selectedService) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.candidateCode.toLowerCase().includes(q) ||
        c.targetRole.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      candidateCode: `REC-2026-0${candidates.length + 45}`,
      fullName,
      gender: 'Male',
      phone,
      targetService,
      targetRole,
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'Applied',
      experienceYears,
      hasMilitaryOrPoliceExp: targetService === 'Security',
      hasHospitalCommercialCleaningExp: targetService === 'Cleaning',
      kebeleCardProvided: true,
      guarantorProvided: false,
      medicalFit: false,
      notes: notes || 'Registered in recruitment intake'
    };

    onAddCandidate(newCand);
    setIsAddModalOpen(false);
    setFullName('');
  };

  const stages: Candidate['stage'][] = ['Applied', 'Screened', 'Interview', 'Background Check', 'Offer Issued'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Recruitment & Sourcing
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Applicant Intake Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Screening candidates for Security and Cleaning service lines before onboarding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Applicant</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
          {(['All', 'Security', 'Cleaning', 'Property Management', 'Head Office Staff'] as const).map((div) => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedService(div)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedService === div ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
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
            placeholder="Search candidate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((cand) => (
          <div key={cand.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 font-semibold tracking-wide">
                  {cand.candidateCode}
                </span>

                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                  cand.targetService === 'Security'
                    ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
                    : cand.targetService === 'Cleaning'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                    : cand.targetService === 'Property Management'
                    ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900'
                    : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                }`}>
                  {cand.targetService}
                </span>
              </div>

              <div>
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">{cand.fullName}</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cand.phone}</span>
                </div>
              </div>

              <div className="text-xs space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Target Role</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">{cand.targetRole}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Experience</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{cand.experienceYears} Years in Field</span>
                </div>
                {cand.interviewScore && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">Interview Rating</span>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {cand.interviewScore} / 100
                    </span>
                  </div>
                )}
              </div>

              {cand.notes && (
                <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-slate-800/40 p-2.5 rounded-lg border-l-2 border-amber-500 border-y border-r border-slate-200/60 dark:border-slate-700/60">
                  "{cand.notes}"
                </div>
              )}
            </div>

            {/* Stage Progress & Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Current Stage</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cand.stage}</span>
              </div>

              {cand.stage === 'Offer Issued' ? (
                <button
                  type="button"
                  onClick={() => onSendToOnboarding(cand)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>To Onboarding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = stages.indexOf(cand.stage);
                    if (currentIndex < stages.length - 1) {
                      onUpdateCandidateStage(cand.id, stages[currentIndex + 1]);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>Advance</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Applicant Registration */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateApplicant} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Register Candidate</h2>
                <p className="text-xs text-slate-500">Recruitment intake application</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Solomon Girma"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Division *</label>
                  <select
                    value={targetService}
                    onChange={(e) => {
                      const st = e.target.value as ServiceType;
                      setTargetService(st);
                      if (st === 'Security') setTargetRole('Security Guard');
                      else if (st === 'Cleaning') setTargetRole('Commercial Cleaner');
                      else if (st === 'Property Management') setTargetRole('Facility Maintenance Technician');
                      else setTargetRole('HR & Administrative Officer');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                  >
                    <option value="Security">Security Division</option>
                    <option value="Cleaning">Cleaning Division</option>
                    <option value="Property Management">Property Management</option>
                    <option value="Head Office Staff">Head Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Screening Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 3 years commercial experience."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Save Applicant
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
