import React, { useState } from 'react';
import { Employee, ClientSite, ShiftType, TransferPromotionRecord } from '../../types/hrm';

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  sites: ClientSite[];
  onSubmit: (record: TransferPromotionRecord) => void;
}

export const NewTransferModal: React.FC<NewTransferModalProps> = ({
  isOpen,
  onClose,
  employees,
  sites,
  onSubmit
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [transferType, setTransferType] = useState<TransferPromotionRecord['type']>('Site Transfer');
  const [toSiteId, setToSiteId] = useState(sites[0]?.id || '');
  const [toRole, setToRole] = useState('Senior Guard');
  const [toShift, setToShift] = useState<ShiftType>('Day (06:00 - 18:00)');
  const [salaryChange, setSalaryChange] = useState(1000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const selectedEmp = employees.find(e => e.id === employeeId);
  const targetSiteObj = sites.find(s => s.id === toSiteId) || sites[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !targetSiteObj) return;

    const sourceSite = selectedEmp.currentSiteName || 'Head Office / Unassigned';
    const targetSite = targetSiteObj.name;

    const newRecord: TransferPromotionRecord = {
      id: `tr-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeCode: selectedEmp.employeeCode,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      serviceType: selectedEmp.serviceType,
      type: transferType,
      fromSite: sourceSite,
      toSite: targetSite,
      currentSite: sourceSite,
      destinationSite: targetSite,
      fromRole: selectedEmp.role,
      toRole: transferType === 'Role Promotion' ? toRole : selectedEmp.role,
      fromShift: selectedEmp.currentShift || 'Day (06:00 - 18:00)',
      toShift,
      salaryChangeETB: transferType === 'Role Promotion' ? salaryChange : 0,
      effectiveDate,
      reason: reason || 'Operational reassignment for client post requirements.',
      approvedBy: '',
      status: 'pending'
    };

    onSubmit(newRecord);
    onClose();
    setEmployeeId('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Workforce Relocation</div>
            <h2 className="text-base font-bold text-slate-900">Propose Site Transfer or Promotion</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1 rounded bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            >
              <option value="">-- Choose employee --</option>
              {employees
                .filter(e => e.status === 'Active' || e.status === 'Probation')
                .map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.employeeCode}) · {e.currentSiteName || 'Unassigned'}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Transfer Action *</label>
              <select
                value={transferType}
                onChange={(e) => setTransferType(e.target.value as TransferPromotionRecord['type'])}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
              >
                <option value="Site Transfer">Site-to-Site Transfer</option>
                <option value="Role Promotion">Role Promotion / Rank</option>
                <option value="Shift Change">Shift Timing Rotation</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Effective Date *</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Destination Client Site *</label>
            <select
              value={toSiteId}
              onChange={(e) => setToSiteId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-600"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.subcity})</option>
              ))}
            </select>
          </div>

          {transferType === 'Role Promotion' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Title</label>
                <input
                  type="text"
                  value={toRole}
                  onChange={(e) => setToRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Salary Adjustment (ETB)</label>
                <input
                  type="number"
                  value={salaryChange}
                  onChange={(e) => setSalaryChange(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Justification / Reason</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Operational reassignment to reinforce security detail at client facility."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!employeeId}
            className="px-5 py-2 bg-[#F2C46A] hover:bg-amber-400 text-[#4C4541] font-bold text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};
