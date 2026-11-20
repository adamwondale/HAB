import React, { useState } from 'react';
import { ClearanceRecord, Employee, IssuedClearanceItem } from '../../types/hrm';

interface ClearanceInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onInitiate: (newClearance: ClearanceRecord) => void;
}

export const ClearanceInitiationModal: React.FC<ClearanceInitiationModalProps> = ({
  isOpen,
  onClose,
  employees,
  onInitiate
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [exitReason, setExitReason] = useState<ClearanceRecord['exitReason']>('Resignation');
  const [targetDate, setTargetDate] = useState('2026-10-15');

  if (!isOpen) return null;

  const handleStartInitiation = () => {
    if (!selectedEmployeeId) return;
    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    const isSecurity = emp.serviceType === 'Security';
    const initialItems: IssuedClearanceItem[] = isSecurity
      ? [
          { id: `sec-${Date.now()}-1`, name: 'HAB Security Uniform Shirts (2x Sets)', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 600 },
          { id: `sec-${Date.now()}-2`, name: 'Tactical Combat Boots', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 850 },
          { id: `sec-${Date.now()}-3`, name: 'Rubberized Security Baton / Truncheon', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 450 },
          { id: `sec-${Date.now()}-4`, name: 'Two-Way Walkie-Talkie Radio & Dock', category: 'Equipment', isReturned: false, condition: 'Missing', penaltyFee: 3200 },
          { id: `sec-${Date.now()}-5`, name: 'Corporate Smart ID Badge & Client Site Pass', category: 'Credentials', isReturned: false, condition: 'Missing', penaltyFee: 150 }
        ]
      : [
          { id: `cln-${Date.now()}-1`, name: 'HAB Sanitization Overalls / Smocks (2x Sets)', category: 'Uniform', isReturned: false, condition: 'Missing', penaltyFee: 500 },
          { id: `cln-${Date.now()}-2`, name: 'Heavy-Duty Industrial Cleaning Gloves', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 180 },
          { id: `cln-${Date.now()}-3`, name: 'Chemical Splash Protective Face Visor', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 220 },
          { id: `cln-${Date.now()}-4`, name: 'Waterproof Non-Slip Rubber Gumboots', category: 'Safety Gear', isReturned: false, condition: 'Missing', penaltyFee: 650 },
          { id: `cln-${Date.now()}-5`, name: 'HAB Cleaning Staff ID Card & Floor Badge', category: 'Credentials', isReturned: false, condition: 'Missing', penaltyFee: 150 }
        ];

    const newClearance: ClearanceRecord = {
      id: `clr-${Date.now()}`,
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      serviceType: emp.serviceType,
      role: emp.role,
      siteId: emp.currentSiteId || 'site-1',
      siteName: emp.currentSiteName || 'Commercial Bank of Ethiopia Tower (HQ)',
      exitReason,
      initiationDate: new Date().toISOString().split('T')[0],
      targetExitDate: targetDate,
      status: 'In Progress',
      stage: 'store_pending',
      storeStatus: 'waiting',
      storeItemsReturned: false,
      financeStatus: 'waiting',
      issuedItems: initialItems,
      siteSupervisorSignoff: { completed: false },
      storeAssetSignoff: { completed: false },
      financeSignoff: { completed: false, salaryAdvanceDeduction: 0, unreturnedGearCost: 0, finalSeveranceSettlement: 0 },
      hrClearanceSignoff: { completed: false, certificateIssued: false }
    };

    onInitiate(newClearance);
    onClose();
    setSelectedEmployeeId('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Initiate Employee Exit Clearance</h2>
            <p className="text-xs text-slate-500">Auto-generates item return checklist based on division</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-100">✕</button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            >
              <option value="">-- Choose employee --</option>
              {employees.filter(e => e.status !== 'Exited').map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Exit *</label>
            <select
              value={exitReason}
              onChange={(e) => setExitReason(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            >
              <option value="Resignation">Voluntary Resignation</option>
              <option value="End of Contract">Contract Expiration</option>
              <option value="Mutual Separation">Mutual Separation</option>
              <option value="Termination">Administrative Termination</option>
              <option value="Disciplinary">Disciplinary Action</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Exit Date *</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
          <button
            type="button"
            disabled={!selectedEmployeeId}
            onClick={handleStartInitiation}
            className="px-4 py-2 bg-[#F2C46A] hover:bg-[#e0b459] text-[#4C4541] disabled:opacity-50 text-xs font-bold rounded-lg shadow-xs"
          >
            Create Clearance Case
          </button>
        </div>
      </div>
    </div>
  );
};
