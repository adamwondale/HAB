import React from 'react';
import { X, FileText, CheckCircle2, AlertCircle, Phone, Award, Shield } from 'lucide-react';
import { Candidate } from '../../types/hrm';

interface ApplicantDossierModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantDossierModal: React.FC<ApplicantDossierModalProps> = ({
  candidate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/60 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F2C46A] text-[#4C4541] font-bold text-sm flex items-center justify-center shrink-0 border border-[#4C4541]/10">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950 dark:text-white">{candidate.fullName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {candidate.candidateCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{candidate.targetService} · {candidate.targetRole}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[420px]">
          {/* Key Vetting Checkpoints */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px]">
              Credential & Guarantor Vetting Status
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                {candidate.kebeleCardProvided ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span>Kebele Residence ID: <strong>{candidate.kebeleCardProvided ? 'Verified' : 'Pending'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                {candidate.guarantorProvided ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span>Notarized Guarantor: <strong>{candidate.guarantorProvided ? 'Verified' : 'Pending Intake'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                {candidate.medicalFit ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                <span>Occupational Medical: <strong>{candidate.medicalFit ? 'Certified Fit' : 'Awaiting Test'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Experience: <strong>{candidate.experienceYears} Years</strong></span>
              </div>
            </div>
          </div>

          {/* Candidate Dossier Overview */}
          <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px]">
              Curriculum Vitae (CV) & Dossier Summary
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
              <div><span className="text-slate-400 block text-[10px]">Direct Contact Phone:</span><span className="font-mono font-medium text-slate-900 dark:text-white">{candidate.phone}</span></div>
              <div><span className="text-slate-400 block text-[10px]">Application Date:</span><span className="font-mono font-medium text-slate-900 dark:text-white">{candidate.appliedDate}</span></div>
              <div><span className="text-slate-400 block text-[10px]">Military / Police Background:</span><span className="font-medium">{candidate.hasMilitaryOrPoliceExp ? 'Yes (Verified Discharge Cert)' : 'None'}</span></div>
              <div><span className="text-slate-400 block text-[10px]">Commercial Sanitation Cert:</span><span className="font-medium">{candidate.hasHospitalCommercialCleaningExp ? 'Yes (Certified)' : 'Standard'}</span></div>
            </div>

            {candidate.interviewScore && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Interview Evaluation Rating:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {candidate.interviewScore} / 100 Points
                </span>
              </div>
            )}

            {candidate.notes && (
              <div className="p-2 rounded bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                <span className="font-semibold block text-amber-900 dark:text-amber-300 mb-0.5">Recruiter Notes:</span>
                "{candidate.notes}"
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg shadow-xs"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
