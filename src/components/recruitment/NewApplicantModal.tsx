import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, UserPlus, AlertCircle } from 'lucide-react';
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
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [faydaNumber, setFaydaNumber] = useState('');
  const [targetService, setTargetService] = useState<ServiceType>('Security');
  const [targetRole, setTargetRole] = useState('Security Guard');
  const [experienceYears, setExperienceYears] = useState(2);
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (vals = { fullName, phone, targetRole, experienceYears }) => {
    const errs: Record<string, string> = {};
    const nameWords = vals.fullName.trim().split(/\s+/).filter(Boolean);
    const phoneClean = vals.phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+251[79]\d{8}|0[79]\d{8})$/;

    if (!vals.fullName.trim() || nameWords.length < 2) errs.fullName = 'Enter at least first and father name.';
    if (!phoneClean || !phoneRegex.test(phoneClean)) errs.phone = 'Use valid Ethiopian mobile (+251 9/7... or 09/07...).';
    if (!vals.targetRole.trim()) errs.targetRole = 'Target role title is required.';
    if (vals.experienceYears < 0 || vals.experienceYears > 45) errs.experienceYears = '0 to 45 years.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, targetRole: true, experienceYears: true });

    if (!validate()) return;

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      candidateCode: `REC-2026-0${existingCount + 45}`,
      fullName: fullName.trim(),
      gender: 'Male',
      phone: phone.trim(),
      targetService,
      targetRole: targetRole.trim(),
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'Applied',
      experienceYears,
      faydaNumber: faydaNumber.trim() || undefined,
      kebeleId: faydaNumber.trim() || undefined,
      hasMilitaryOrPoliceExp: targetService === 'Security',
      hasHospitalCommercialCleaningExp: targetService === 'Cleaning',
      kebeleCardProvided: true,
      guarantorProvided: false,
      medicalFit: false,
      notes: notes.trim() || 'Centralized intake applicant registered'
    };

    onAddCandidate(newCand);
    onClose();
    setFullName('');
    setNotes('');
    setTouched({});
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full bg-slate-50 dark:bg-slate-800 border rounded p-2 text-slate-800 dark:text-white focus:outline-none transition-colors ${
      touched[field] && errors[field]
        ? 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20'
        : 'border-slate-200 dark:border-slate-700 focus:border-amber-600'
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('recruitment.centralIntakeReg')}</h2>
              <p className="text-[11px] text-slate-500">{t('recruitment.addApplicantToPool')}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('recruitment.fullName')} *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => { setFullName(e.target.value); if (touched.fullName) validate({ ... { fullName: e.target.value, phone, targetRole, experienceYears } }); }}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Solomon Girma"
                className={inputClass('fullName')}
              />
              {touched.fullName && errors.fullName && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />{errors.fullName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Fayda / Kebele ID</label>
              <input
                type="text"
                value={faydaNumber}
                onChange={e => setFaydaNumber(e.target.value)}
                placeholder="ET-FAYDA-9481... or Kebele ID"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-white focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('recruitment.division')} *</label>
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
                <option value="Security">{t('common.security')}</option>
                <option value="Cleaning">{t('common.cleaning')}</option>
                <option value="Property Management">{t('common.propertyManagement')}</option>
                <option value="Head Office Staff">{t('common.headOfficeStaff')}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('common.phone')} *</label>
              <input
                type="text"
                value={phone}
                onChange={e => { setPhone(e.target.value); if (touched.phone) validate({ ... { fullName, phone: e.target.value, targetRole, experienceYears } }); }}
                onBlur={() => handleBlur('phone')}
                placeholder="+251 9..."
                className={inputClass('phone')}
              />
              {touched.phone && errors.phone && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />{errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('recruitment.targetRole')} *</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => { setTargetRole(e.target.value); if (touched.targetRole) validate({ ... { fullName, phone, targetRole: e.target.value, experienceYears } }); }}
                onBlur={() => handleBlur('targetRole')}
                className={inputClass('targetRole')}
              />
              {touched.targetRole && errors.targetRole && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />{errors.targetRole}
                </p>
              )}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('recruitment.experienceYears')} *</label>
              <input
                type="number"
                min={0}
                max={45}
                value={experienceYears}
                onChange={e => { const v = Number(e.target.value); setExperienceYears(v); if (touched.experienceYears) validate({ ... { fullName, phone, targetRole, experienceYears: v } }); }}
                onBlur={() => handleBlur('experienceYears')}
                className={inputClass('experienceYears')}
              />
              {touched.experienceYears && errors.experienceYears && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-2.5 h-2.5" />{errors.experienceYears}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">{t('recruitment.screeningNotes')}</label>
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
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] text-xs font-bold rounded-lg shadow-xs"
          >
            {t('recruitment.registerApplicant')}
          </button>
        </div>
      </form>
    </div>
  );
};
