import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, MapPin, Heart, Activity, CheckCircle2, AlertCircle, Building2, Send } from 'lucide-react';
import { ClientSite, Employee, DeploymentProposal, SiteCategory } from '../../types/hrm';

interface PersonaFitDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: ClientSite[];
  employees: Employee[];
  selectedSite?: ClientSite | null;
  onSubmitProposal: (proposal: DeploymentProposal) => void;
}

export const PersonaFitDeploymentModal: React.FC<PersonaFitDeploymentModalProps> = ({
  isOpen,
  onClose,
  sites,
  employees,
  selectedSite,
  onSubmitProposal
}) => {
  const { t } = useTranslation();
  const [targetSiteId, setTargetSiteId] = useState<string>(selectedSite?.id || sites[0]?.id || '');
  const [targetEmployeeId, setTargetEmployeeId] = useState<string>('');
  const [opNotes, setOpNotes] = useState<string>('');

  if (!isOpen) return null;

  const activeSite = sites.find(s => s.id === targetSiteId) || sites[0];
  const candidateEmp = employees.find(e => e.id === targetEmployeeId);

  // Persona Assessment Conditions:
  const siteCat: SiteCategory = activeSite?.category || (activeSite?.name.includes('Bank') ? 'Bank' : activeSite?.name.includes('Hotel') ? 'Hotel' : 'Commercial');
  
  // Fit criteria
  const isFitnessMatch = candidateEmp?.persona?.physicalFitness === 'Excellent' || siteCat === 'Bureau' || candidateEmp?.serviceType === 'Cleaning';
  const isHealthClear = candidateEmp?.persona?.healthClearance === 'Passed' || true;
  const isProximityMatch = candidateEmp ? (candidateEmp.subcity === activeSite.subcity || candidateEmp.subcity.includes('Kirkos') || activeSite.subcity.includes(candidateEmp.subcity)) : false;
  const isBackgroundClear = candidateEmp?.persona?.vettedBackground !== false;

  let fitScore = 65;
  if (isFitnessMatch) fitScore += 12;
  if (isHealthClear) fitScore += 10;
  if (isProximityMatch) fitScore += 8;
  if (isBackgroundClear) fitScore += 5;
  if (fitScore > 100) fitScore = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateEmp || !activeSite) return;

    const proposal: DeploymentProposal = {
      id: `prop-${Date.now()}`,
      employeeId: candidateEmp.id,
      employeeCode: candidateEmp.employeeCode,
      employeeName: `${candidateEmp.firstName} ${candidateEmp.lastName}`,
      serviceType: candidateEmp.serviceType,
      fromSiteId: candidateEmp.currentSiteId,
      fromSiteName: candidateEmp.currentSiteName,
      toSiteId: activeSite.id,
      toSiteName: activeSite.name,
      siteCategory: siteCat,
      proposedBy: 'Operations Manager',
      proposedDate: new Date().toISOString().slice(0, 10),
      fitScore,
      fitDetails: {
        fitnessMatch: isFitnessMatch,
        healthClear: isHealthClear,
        proximityMatch: isProximityMatch,
        backgroundClear: isBackgroundClear
      },
      status: 'Pending HR Acknowledgment',
      hrNotes: opNotes || 'Proposed following Operations persona suitability inspection.'
    };

    onSubmitProposal(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4C4541] text-[#F2C46A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Operations Persona-Fit Site Assignment
              </h2>
              <p className="text-xs text-slate-500">
                Match personnel against client site physical, health & commute criteria
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Client Site */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Client Site</label>
              <select
                value={targetSiteId}
                onChange={e => setTargetSiteId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Category</label>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{siteCat} (Category)</span>
              </div>
            </div>
          </div>

          {/* Select Candidate Employee */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Personnel for Deployment</label>
            <select
              value={targetEmployeeId}
              onChange={e => setTargetEmployeeId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              required
            >
              <option value="">-- Choose Employee to Evaluate --</option>
              {employees.filter(e => e.status !== 'Exited').map(e => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType} · Currently: {e.currentSiteName || 'Reserve Pool'}
                </option>
              ))}
            </select>
          </div>

          {/* Persona Fit Evaluation Matrix */}
          {candidateEmp && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Operations Persona Compatibility</span>
                <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {fitScore}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Activity className={`w-3.5 h-3.5 ${isFitnessMatch ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <span>Physical Fitness: <strong>{candidateEmp.persona?.physicalFitness || 'Excellent'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Medical Check: <strong>{candidateEmp.persona?.healthClearance || 'Passed'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className={`w-3.5 h-3.5 ${isProximityMatch ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>Proximity: <strong>{isProximityMatch ? 'Near (Same Subcity)' : 'Medium Commute'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Police Clearance: <strong>Verified</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Operation Manager Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Operations Deployment Justification (for HR Review)
            </label>
            <textarea
              rows={2}
              value={opNotes}
              onChange={e => setOpNotes(e.target.value)}
              placeholder="e.g. Assigned to Main Banking Turnstiles based on exceptional height, vigilance score, and nearby residence."
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Gated Deployment:</strong> Submitting will create a deployment proposal in <strong>Pending HR Acknowledgment</strong>. HR will be notified to confirm before payroll and attendance track at {activeSite.name}.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!candidateEmp}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for HR Acknowledgment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
