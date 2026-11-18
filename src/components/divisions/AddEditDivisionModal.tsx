import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Building2, Save } from 'lucide-react';
import { Division } from '../../types/division';

interface AddEditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (division: Division) => void;
  editingDivision?: Division | null;
  existingCodes: string[];
}

export const AddEditDivisionModal: React.FC<AddEditDivisionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDivision,
  existingCodes
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [description, setDescription] = useState('');
  const [headOfDivision, setHeadOfDivision] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [targetHeadcount, setTargetHeadcount] = useState(25);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDivision) {
      setCode(editingDivision.code);
      setName(editingDivision.name);
      setAmharicName(editingDivision.amharicName || '');
      setDescription(editingDivision.description || '');
      setHeadOfDivision(editingDivision.headOfDivision || '');
      setHeadEmail(editingDivision.headEmail || '');
      setHeadPhone(editingDivision.headPhone || '');
      setStatus(editingDivision.status);
      setTargetHeadcount(editingDivision.targetHeadcount || 25);
    } else {
      setCode('');
      setName('');
      setAmharicName('');
      setDescription('');
      setHeadOfDivision('');
      setHeadEmail('');
      setHeadPhone('');
      setStatus('Active');
      setTargetHeadcount(25);
    }
    setError('');
  }, [editingDivision, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanCode || !cleanName) {
      setError('Division Code and Name are required.');
      return;
    }

    if (!editingDivision && existingCodes.includes(cleanCode)) {
      setError(`Division code "${cleanCode}" already exists.`);
      return;
    }

    onSave({
      id: editingDivision ? editingDivision.id : `div-${cleanCode.toLowerCase()}-${Date.now()}`,
      code: cleanCode,
      name: cleanName,
      amharicName: amharicName.trim() || undefined,
      description: description.trim(),
      headOfDivision: headOfDivision.trim() || undefined,
      headEmail: headEmail.trim() || undefined,
      headPhone: headPhone.trim() || undefined,
      status,
      targetHeadcount: Number(targetHeadcount) || 20,
      createdAt: editingDivision ? editingDivision.createdAt : new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#FCF0DA] dark:bg-[#2C2724]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#4C4541] dark:text-[#F2C46A]" />
            <h3 className="font-bold text-sm text-[#4C4541] dark:text-slate-100">
              {editingDivision ? t('hr.editDivision') : t('hr.addDivision')}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-500 hover:bg-black/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && <div className="p-2.5 rounded bg-rose-50 text-rose-700 font-semibold">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. PROP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg uppercase font-mono font-bold dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg font-semibold dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="Active">{t('common.active')}</option>
                <option value="Inactive">{t('common.inactive')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t('hr.divisionName')} *</label>
            <input
              type="text"
              required
              placeholder="e.g. Property Management"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-semibold dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Amharic Name</label>
            <input
              type="text"
              placeholder="e.g. የንብረት እና ተቋማት አስተዳደር"
              value={amharicName}
              onChange={(e) => setAmharicName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of operations, staff coverage, client mandates..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t('hr.headOfDivision')}</label>
              <input
                type="text"
                placeholder="Manager name"
                value={headOfDivision}
                onChange={(e) => setHeadOfDivision(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t('hr.targetHeadcount')}</label>
              <input
                type="number"
                value={targetHeadcount}
                onChange={(e) => setTargetHeadcount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#F2C46A] text-[#4C4541] hover:bg-[#e4b55b] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
