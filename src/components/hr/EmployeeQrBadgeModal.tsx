import React from 'react';
import { X, Printer, ShieldCheck, Building2, MapPin, BadgeCheck } from 'lucide-react';
import { Employee } from '../../types/hrm';
import { QrCodeSvg } from '../common/QrCodeSvg';

interface EmployeeQrBadgeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeQrBadgeModal: React.FC<EmployeeQrBadgeModalProps> = ({
  employee,
  isOpen,
  onClose
}) => {
  if (!isOpen || !employee) return null;

  const faydaId =
    employee.faydaNumber ||
    `ET-FAYDA-${employee.employeeCode.replace(/[^0-9]/g, '').padEnd(4, '0')}-2026-8812`;

  const qrPayload = JSON.stringify({
    system: 'HAB-ERP-VERIFY',
    code: employee.employeeCode,
    fayda: faydaId,
    name: `${employee.firstName} ${employee.lastName}`,
    division: employee.serviceType,
    role: employee.role,
    site: employee.currentSiteName || 'Commercial Bank Headquarters'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA] dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-[#4C4541] dark:text-slate-100">
              Official Staff Identification Badge
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-80 rounded-2xl border-2 border-[#4C4541]/20 dark:border-amber-500/30 bg-white dark:bg-slate-950 shadow-xl overflow-hidden text-center relative print:shadow-none">
            {/* Lanyard Hole */}
            <div className="w-10 h-2 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2 mb-1" />

            {/* Badge Header Banner */}
            <div className="bg-[#4C4541] text-white py-3 px-4 relative">
              <div className="text-[10px] tracking-widest uppercase font-semibold text-[#F2C46A]">
                HAB Business PLC
              </div>
              <div className="text-xs font-bold tracking-wide">
                ኤች.ኤ.ቢ ቢዝነስ ኃ/የተ/የግ/ማህበር
              </div>
              <div className="text-[9px] text-[#FCF0DA]/80 mt-0.5">
                Staff Identity & Access Credential
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Photo & Identity Section */}
            <div className="p-4 flex flex-col items-center">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-[#F2C46A] to-[#AEAC78] p-1 shadow-md mb-2">
                <div className="w-full h-full rounded-lg bg-[#4C4541] text-white flex items-center justify-center font-bold text-xl">
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </div>
              </div>

              <h4 className="text-base font-bold text-[#4C4541] dark:text-slate-100">
                {employee.firstName} {employee.lastName}
              </h4>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {employee.role}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#F2C46A]/50">
                {employee.serviceType}
              </span>

              {/* QR Code Container */}
              <div className="mt-3 p-2 rounded-xl bg-white border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col items-center">
                <QrCodeSvg value={qrPayload} size={110} />
                <span className="text-[8px] font-mono font-bold text-slate-500 mt-1 tracking-wider">
                  SCAN TO VERIFY / ATTENDANCE
                </span>
              </div>

              {/* Metadata Details */}
              <div className="w-full mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Staff Code:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {employee.employeeCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Fayda ID:
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    {faydaId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Assigned Site:
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                    {employee.currentSiteName || 'Commercial Bank HQ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Security Hologram Strip */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 h-2 w-full" />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Official Ethiopian National ID Compliant
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#F2C46A] hover:bg-[#e6b758] text-[#4C4541] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
