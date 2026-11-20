import React from 'react';
import { Printer } from 'lucide-react';
import { ClearanceRecord } from '../../types/hrm';

interface ClearanceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ClearanceRecord;
}

export const ClearanceCertificateModal: React.FC<ClearanceCertificateModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold no-print"
        >
          ✕
        </button>

        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="text-xl font-black tracking-wider text-slate-900 uppercase">HAB Business PLC</div>
          <div className="text-xs font-semibold text-slate-600">Corporate Cleaning & Security Operations Management</div>
          <div className="text-[11px] text-slate-500">
            Churchill Avenue, Financial District, P.O. Box 24901, Addis Ababa, Ethiopia · Tel: +251 115 500 000
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-4">
            Official HR Clearance Certificate
          </h2>
          <p className="text-xs font-mono text-slate-600">
            Ref: {record.hrClearanceSignoff.certificateNumber || 'HAB-CLR-2026-CERT'}
          </p>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <p>
            This certifies that the employee identified below has completed all formal clearance procedures, surrendered all company-issued properties, uniforms, gear, and credentials, and has settled all accounts with HAB Business PLC.
          </p>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Employee Name:</span>
              <span className="font-bold text-slate-900">{record.employeeName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Employee Code:</span>
              <span className="font-bold font-mono text-slate-900">{record.employeeCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Service Division:</span>
              <span className="font-bold text-slate-900">{record.serviceType} Services</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Designation:</span>
              <span className="font-bold text-slate-900">{record.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Assigned Site:</span>
              <span className="font-bold text-slate-900">{record.siteName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Exit Date:</span>
              <span className="font-bold text-slate-900">{record.targetExitDate}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-300 text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                {record.siteSupervisorSignoff.signedBy?.split(' ')[0] || 'A. Kassahun'}
              </div>
              <div className="text-[10px] text-slate-600 mt-1 font-semibold">Site Supervisor</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic">
                {record.financeSignoff.signedBy?.split(' ')[0] || 'A. Demissie'}
              </div>
              <div className="text-[10px] text-slate-600 mt-1 font-semibold">Finance & Payroll</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-xs font-serif italic text-amber-800">
                Solomon Teshome
              </div>
              <div className="text-[10px] text-slate-900 mt-1 font-bold">HR Director (Final)</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
