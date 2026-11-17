import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { Candidate, ClientSite, OnboardingChecklist, ServiceType } from '../../types/hrm';

interface EnrollOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (newChecklist: OnboardingChecklist) => void;
  candidates?: Candidate[];
  sites: ClientSite[];
  existingCount: number;
}

const DEFAULT_MILESTONES = [
  { id: 't1', title: 'National ID & Kebele Residence Verification', category: 'Verification' as const, completed: true },
  { id: 't2', title: 'Police Character Clearance Certificate (Criminal Directorate)', category: 'Verification' as const, completed: true },
  { id: 't3', title: 'Notarized Guarantor Undertaking Agreement & ID copy', category: 'Verification' as const, completed: false },
  { id: 't4', title: 'Occupational Medical Fitness & Drug Screening Exam', category: 'Medical' as const, completed: false },
  { id: 't5', title: 'Biometric Enrollment & HAB RFID Smart Badge Issuance', category: 'Equipment' as const, completed: false },
  { id: 't6', title: 'Company Uniforms, Heavy-Duty Boots & Badge Issuance', category: 'Equipment' as const, completed: false },
  { id: 't7', title: 'Standard Employment Contract Execution (Proclamation 1156/2019)', category: 'Contract' as const, completed: false }
];

export const EnrollOnboardingModal: React.FC<EnrollOnboardingModalProps> = ({
  isOpen, onClose, onEnroll, candidates = [], sites, existingCount
}) => {
  const eligible = candidates.filter(c => c.stage !== 'Onboarded');
  const [mode, setMode] = useState<'pool' | 'direct'>(eligible.length > 0 ? 'pool' : 'direct');
  const [selectedCandidateId, setSelectedCandidateId] = useState(eligible[0]?.id || '');
  const [fullName, setFullName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Security');
  const [role, setRole] = useState('Security Guard');
  const [targetStartDate, setTargetStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialSiteAssigned, setInitialSiteAssigned] = useState(sites[0]?.name || 'Commercial Bank of Ethiopia Tower (HQ)');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === 'direct') {
      if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) errs.fullName = 'Enter at least first and father name.';
      if (!role.trim()) errs.role = 'Role is required.';
    } else if (mode === 'pool' && !selectedCandidateId) {
      errs.candidate = 'Please select a candidate from the pool.';
    }
    if (!targetStartDate) errs.targetStartDate = 'Start date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, role: true, targetStartDate: true, candidate: true });
    if (!validate()) return;

    let candName = fullName.trim(), candService = serviceType, candRole = role.trim(), candId = `cand-direct-${Date.now()}`;
    if (mode === 'pool') {
      const cand = candidates.find(c => c.id === selectedCandidateId);
      if (cand) { candName = cand.fullName; candService = cand.targetService; candRole = cand.targetRole; candId = cand.id; }
    }

    const prefix = candService === 'Security' ? 'HAB-SEC' : candService === 'Cleaning' ? 'HAB-CLN' : candService === 'Property Management' ? 'HAB-PRP' : 'HAB-HQ';
    const today = new Date().toISOString().split('T')[0];

    onEnroll({
      id: `onb-${Date.now()}`,
      candidateId: candId,
      employeeCode: `${prefix}-0${100 + existingCount + 1}`,
      fullName: candName,
      serviceType: candService,
      role: candRole,
      progressPercent: 28,
      tasks: DEFAULT_MILESTONES.map(m => ({ ...m, completedAt: m.completed ? today : undefined })),
      contractSigned: false,
      initialSiteAssigned,
      targetStartDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Enroll New Hire for Induction</h2>
              <p className="text-[11px] text-slate-500">Generate gear issuance & onboarding checklist</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs">
          <button type="button" onClick={() => setMode('pool')} className={`flex-1 py-1 font-semibold rounded-md ${mode === 'pool' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}>From Talent Pool ({eligible.length})</button>
          <button type="button" onClick={() => setMode('direct')} className={`flex-1 py-1 font-semibold rounded-md ${mode === 'direct' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}>Direct New Hire</button>
        </div>

        <div className="space-y-3 text-xs">
          {mode === 'pool' ? (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Candidate *</label>
              {eligible.length > 0 ? (
                <select value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:border-amber-600">
                  {eligible.map(c => <option key={c.id} value={c.id}>{c.fullName} · {c.targetService} ({c.targetRole})</option>)}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2"><Sparkles className="w-4 h-4 shrink-0" /><span>All candidates are onboarded. Switch to Direct New Hire.</span></div>
              )}
              {touched.candidate && errors.candidate && <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.candidate}</p>}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name *</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Haile Gebreselassie" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:border-amber-600" />
                {touched.fullName && errors.fullName && <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.fullName}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Division *</label>
                  <select value={serviceType} onChange={e => { const st = e.target.value as ServiceType; setServiceType(st); if (st === 'Security') setRole('Security Guard'); else if (st === 'Cleaning') setRole('Commercial Cleaner'); else if (st === 'Property Management') setRole('Facility Maintenance Tech'); else setRole('HR Officer'); }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded p-2">
                    <option value="Security">Security</option><option value="Cleaning">Cleaning</option><option value="Property Management">Property Management</option><option value="Head Office Staff">Head Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Role Title *</label>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded p-2" />
                  {touched.role && errors.role && <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.role}</p>}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Start Date *</label>
              <input type="date" value={targetStartDate} onChange={e => setTargetStartDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded p-2" />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Client Site</label>
              <select value={initialSiteAssigned} onChange={e => setInitialSiteAssigned(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-white rounded p-2">
                {sites.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] text-xs font-bold rounded-lg shadow-xs">Generate Checklist</button>
        </div>
      </form>
    </div>
  );
};
