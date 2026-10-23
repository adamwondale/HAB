import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Plus
} from 'lucide-react';
import { TransferPromotionRecord, Employee, ClientSite, ShiftType } from '../types/hrm';

interface TransferPromotionViewProps {
  transfers: TransferPromotionRecord[];
  employees: Employee[];
  sites: ClientSite[];
  onExecuteTransfer: (transferId: string) => void;
  onAddTransfer: (record: TransferPromotionRecord) => void;
}

export const TransferPromotionView: React.FC<TransferPromotionViewProps> = ({
  transfers,
  employees,
  sites,
  onExecuteTransfer,
  onAddTransfer
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [transferType, setTransferType] = useState<TransferPromotionRecord['type']>('Site Transfer');
  const [toSiteId, setToSiteId] = useState(sites[0]?.id || '');
  const [toRole, setToRole] = useState('Senior Guard');
  const [toShift, setToShift] = useState<ShiftType>('Day (06:00 - 18:00)');
  const [salaryChange, setSalaryChange] = useState(1000);
  const [reason, setReason] = useState('');

  const selectedEmp = employees.find(e => e.id === employeeId);
  const targetSiteObj = sites.find(s => s.id === toSiteId);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !targetSiteObj) return;

    const newRecord: TransferPromotionRecord = {
      id: `tr-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeCode: selectedEmp.employeeCode,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      serviceType: selectedEmp.serviceType,
      type: transferType,
      fromSite: selectedEmp.currentSiteName || 'Reserve Pool',
      toSite: targetSiteObj.name,
      fromRole: selectedEmp.role,
      toRole: transferType === 'Role Promotion' ? toRole : selectedEmp.role,
      fromShift: selectedEmp.currentShift || 'Day (06:00 - 18:00)',
      toShift,
      salaryChangeETB: transferType === 'Role Promotion' ? salaryChange : 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: reason || 'Operational reassignment for client post requirements.',
      approvedBy: 'Solomon Teshome (HR Director)',
      status: 'Approved'
    };

    onAddTransfer(newRecord);
    setIsAddModalOpen(false);
    setEmployeeId('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Career Movement
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Site Transfers & Role Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reassign workforce between client facilities in Addis Ababa and record role promotions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Transfers and Promotions Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Transfer & Promotion History ({transfers.length})
        </h2>

        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead className="bg-slate-100 text-slate-900 border-b-2 border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-5 font-bold text-slate-900">Employee</th>
                <th className="py-4 px-5 font-bold text-slate-900">Action Type</th>
                <th className="py-4 px-5 font-bold text-slate-900">Previous Assignment</th>
                <th className="py-4 px-5 font-bold text-slate-900">New Assignment</th>
                <th className="py-4 px-5 font-bold text-slate-900">Salary Adjustment</th>
                <th className="py-4 px-5 font-bold text-slate-900">Effective Date</th>
                <th className="py-4 px-5 font-bold text-slate-900 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {transfers.map((tr) => (
                <tr key={tr.id} className="odd:bg-white even:bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
                  <td className="py-4 px-5 font-normal">
                    <div className="font-medium text-slate-800">{tr.employeeName}</div>
                    <div className="text-[11px] font-mono text-slate-400 font-normal mt-0.5">{tr.employeeCode} · {tr.serviceType}</div>
                  </td>
                  <td className="py-4 px-5 font-normal">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${
                      tr.type === 'Role Promotion'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {tr.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-normal">
                    <div>{tr.fromSite}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{tr.fromRole}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-normal">
                    <div>{tr.toSite}</div>
                    <div className="text-[11px] text-amber-800 font-medium">{tr.toRole}</div>
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-500 font-normal">
                    {tr.salaryChangeETB > 0 ? (
                      <span className="text-emerald-700 font-medium">+ETB {tr.salaryChangeETB.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 font-normal">Unchanged</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-[11px] font-normal">
                    {tr.effectiveDate}
                  </td>
                  <td className="py-4 px-5 text-right font-normal">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Transfer or Promotion Proposal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateProposal} className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Propose Transfer or Promotion</h2>
                <p className="text-xs text-slate-500">Record site rotation or rank advancement</p>
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
                <label className="block text-slate-700 font-semibold mb-1">Select Employee *</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                >
                  <option value="">-- Choose employee --</option>
                  {employees
                    .filter(e => e.status === 'Active' || e.status === 'Probation')
                    .map(e => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.employeeCode}) · {e.serviceType}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Action Type *</label>
                <select
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                >
                  <option value="Site Transfer">Site-to-Site Transfer</option>
                  <option value="Role Promotion">Role Promotion / Rank Advancement</option>
                  <option value="Shift Change">Shift Timing Rotation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Client Site *</label>
                <select
                  value={toSiteId}
                  onChange={(e) => setToSiteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-2 focus:outline-none focus:border-amber-600"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Salary Increment (ETB)</label>
                    <input
                      type="number"
                      value={salaryChange}
                      onChange={(e) => setSalaryChange(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded p-1.5"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Operational requirement at client site."
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
                disabled={!employeeId}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Execute
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
