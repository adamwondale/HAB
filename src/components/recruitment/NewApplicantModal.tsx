import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Candidate, ServiceType } from '../../types/hrm';

interface NewApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (newCandidate: Candidate) => void;
  existingCount: number;
}

export const NewApplicantModal: React.FC<NewApplicantModalProps> = ({
  isOpen,
  onClose,
  onAddCandidate,
  existingCount
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [targetService, setTargetService] = useState<ServiceType>('Security');
  const [targetRole, setTargetRole] = useState('Security Guard');
  const [experienceYears, setExperienceYears] = useState(2);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      candidateCode: `REC-2026-0${existingCount + 45}`,
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
      notes: notes || 'Centralized intake applicant registered'
    };

    onAddCandidate(newCand);
    onClose();
    setFullName('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Central Intake Registration</h2>
              <p className="text-[11px] text-slate-500">Add applicant to talent pool</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Applicant Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Solomon Girma"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Division *</label>
              <select
                value={targetService}
                onChange={(e) => {
                  const st = e.target.value as ServiceType;
                  setTargetService(st);
                  if (st === 'Security') setTargetRole('Security Guard');
                  else if (st === 'Cleaning') setTargetRole('Commercial Cleaner');
                  else if (st === 'Property Management') setTargetRole('Facility Maintenance Tech');
                  else setTargetRole('HR & Administrative Officer');
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
              >
                <option value="Security">Security Division</option>
                <option value="Cleaning">Cleaning Division</option>
                <option value="Property Management">Property Management</option>
                <option value="Head Office Staff">Head Office Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Experience (Years)</label>
              <input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Screening Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 3 years experience, military background, vetted."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded p-2 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] text-xs font-bold rounded-lg shadow-xs"
          >
            Register Applicant
          </button>
        </div>
      </form>
    </div>
  );
};
