import React, { useState } from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { Employee, ServiceType } from '../../types/hrm';

export type GeneratedDocType = 'work_letter' | 'clearance';

interface DocumentGeneratorModalProps {
  employee: Employee | any | null;
  isOpen: boolean;
  onClose: () => void;
  initialType?: GeneratedDocType;
}

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({
  employee,
  isOpen,
  onClose,
  initialType = 'work_letter'
}) => {
  const [docType, setDocType] = useState<GeneratedDocType>(initialType);

  if (!isOpen || !employee) return null;

  const fullName = employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  const code = employee.employeeCode || 'HAB-EMP-001';
  const role = employee.role || employee.targetRole || 'Security Officer';
  const serviceType: ServiceType = employee.serviceType || employee.targetService || 'Security';
  const hireDate = employee.hireDate || '2025-04-10';
  const baseSalary = employee.salary?.baseSalary || 5800;
  const siteName = employee.currentSiteName || 'Commercial Bank of Ethiopia Tower (HQ)';
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/60 dark:bg-slate-800/80 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4C4541] dark:text-[#F2C46A] uppercase tracking-wider">Document:</span>
            <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDocType('work_letter')}
                className={`px-3 py-1 rounded-md transition-colors ${docType === 'work_letter' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Work Letter
              </button>
              <button
                type="button"
                onClick={() => setDocType('clearance')}
                className={`px-3 py-1 rounded-md transition-colors ${docType === 'clearance' ? 'bg-[#F2C46A] text-[#4C4541] font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Exit Clearance
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-100 dark:bg-slate-950/60 print:p-0 print:bg-white">
          <div className="max-w-2xl mx-auto bg-white text-slate-900 p-7 rounded-lg shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-4 text-xs">
            {/* Letterhead */}
            <div className="border-b-2 border-[#4C4541] pb-3 mb-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#F2C46A] text-[#4C4541] font-black text-xs flex items-center justify-center border border-[#4C4541]">
                    HAB
                  </div>
                  <div>
                    <h1 className="text-sm font-extrabold tracking-tight text-[#4C4541]">HAB BUSINESS PLC</h1>
                    <p className="text-[9px] text-slate-600 font-semibold">ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mt-0.5">Corporate HQ: Bole Subcity, Addis Ababa, Ethiopia · +251 11 662 4500</p>
              </div>
              <div className="text-right font-mono text-[9px] text-slate-600 space-y-0.5">
                <div>Ref: HAB/HR/{docType === 'work_letter' ? 'WL' : 'CLR'}/2026-{code.replace('HAB-', '')}</div>
                <div>Date: {todayStr}</div>
              </div>
            </div>

            {/* Document Body */}
            {docType === 'work_letter' ? (
              <div className="space-y-3.5 leading-relaxed">
                <div className="text-center my-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#4C4541] border-b border-[#F2C46A] inline-block pb-0.5">
                    Certificate of Employment & Work Letter
                  </h2>
                  <div className="text-[10px] font-semibold text-slate-600 mt-0.5">TO WHOM IT MAY CONCERN</div>
                </div>

                <p>
                  This is to certify that <strong>{fullName}</strong> (Staff ID: <code className="font-mono font-bold">{code}</code>) is an active employee of <strong>HAB Business PLC</strong>, engaged as a <strong>{role}</strong> within our <strong>{serviceType} Division</strong> since <strong>{hireDate}</strong>.
                </p>

                <p>
                  Currently deployed at <strong>{siteName}</strong> under standard Ethiopian Labour Proclamation 1156/2019 provisions.
                </p>

                <div className="p-2.5 bg-[#FCF0DA]/40 border border-[#F2C46A]/60 rounded-md text-[11px]">
                  <span className="font-semibold block text-[#4C4541]">Remuneration Verification:</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>Contracted Basic Salary: <span className="font-mono font-bold">ETB {baseSalary.toLocaleString()}.00</span></div>
                    <div>Standing: <span className="font-bold text-emerald-800">Confirmed Active</span></div>
                  </div>
                </div>

                <p>Issued upon employee request for official administrative verification without financial liability to HAB PLC.</p>

                {/* Sign-off & Stamp */}
                <div className="pt-6 grid grid-cols-2 gap-6 items-end">
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 w-40 h-6"></div>
                    <div className="font-bold text-slate-900">Ato Solomon Girma</div>
                    <div className="text-[9px] text-slate-500">HR & Talent Director</div>
                  </div>

                  <div className="border-2 border-dashed border-[#F2C46A] rounded-lg p-2.5 text-center bg-[#FCF0DA]/30">
                    <span className="text-[9px] font-bold text-[#4C4541] uppercase tracking-wider block">Company Stamp</span>
                    <span className="text-[8px] text-slate-500 font-mono mt-0.5 block">HAB BUSINESS PLC · HR & LEGAL SEAL</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center my-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#4C4541] border-b border-[#F2C46A] inline-block pb-0.5">
                    Official Exit & Asset Clearance
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded border border-slate-200 text-[10px]">
                  <div><span className="text-slate-500 block">Employee:</span><strong>{fullName}</strong> ({code})</div>
                  <div><span className="text-slate-500 block">Position:</span>{role} · {serviceType}</div>
                  <div><span className="text-slate-500 block">Station:</span>{siteName}</div>
                </div>

                <div className="space-y-2">
                  <div className="border border-slate-200 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">1. Site & Operations Clearance</span>
                      <span className="text-[10px] text-slate-500">Duty logbook handover and post relieving confirmed</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Cleared</span>
                  </div>

                  <div className="border border-slate-200 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">2. Property & Store Asset Clearance</span>
                      <span className="text-[10px] text-slate-500">Uniform sets, duty boots, VHF radio/equipment returned in full</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Cleared</span>
                  </div>

                  <div className="border border-slate-200 rounded p-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">3. Finance & Payroll Settlement</span>
                      <span className="text-[10px] text-slate-500">Zero outstanding salary advances; severance balance verified</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Cleared</span>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-3 gap-3 text-center text-[9px]">
                  <div className="border-t border-slate-300 pt-1">
                    <span className="font-bold block">Site Supervisor</span>
                    <span className="text-slate-500">Approved</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1">
                    <span className="font-bold block">Storekeeper</span>
                    <span className="text-slate-500">Returned</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1">
                    <span className="font-bold block">HR Manager</span>
                    <span className="text-slate-500">Released</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
