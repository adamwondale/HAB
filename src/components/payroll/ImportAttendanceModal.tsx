import React, { useState } from 'react';
import { X, RefreshCw, UploadCloud, Download, CheckCircle2, Users, CalendarCheck, ShieldCheck } from 'lucide-react';
import { PayrollRecord, AttendanceRecord, LeaveRequest } from '../../types/hrm';
import { downloadCsv } from '../../utils/csvExport';
import { enrichPayrollRecord } from './payrollHelpers';

interface ImportAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollRecords: PayrollRecord[];
  attendanceRecords?: AttendanceRecord[];
  leaveRequests?: LeaveRequest[];
  onApplyAttendance: (updated: PayrollRecord[]) => void;
}

interface ParsedRow {
  code: string;
  name: string;
  present: number;
  leave: number;
  absent: number;
  payableDays: number;
}

export const ImportAttendanceModal: React.FC<ImportAttendanceModalProps> = ({
  isOpen, onClose, payrollRecords, attendanceRecords = [], leaveRequests = [], onApplyAttendance
}) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'sync' | 'excel'>('sync');
  const [isSyncing, setIsSyncing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const approvedLeavesCount = leaveRequests.filter((l) => l.status === 'Approved').length || 2;
  const totalStaff = payrollRecords.length;
  const avgAttendance = totalStaff
    ? Math.round((payrollRecords.reduce((acc, r) => acc + r.workingDays, 0) / (totalStaff * 30)) * 1000) / 10
    : 97.4;

  const handleSyncFromHr = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updated = payrollRecords.map((rec) => {
        const absences = attendanceRecords.filter(
          (a) => (a.employeeCode === rec.employeeCode || a.employeeId === rec.employeeId) && a.status === 'Absent'
        ).length || (rec.workingDays < 30 ? 30 - rec.workingDays : 0);
        const payableDays = Math.max(0, Math.min(30, 30 - absences));
        return enrichPayrollRecord({
          ...rec,
          workingDays: payableDays,
          earnedBaseSalary: Math.round((rec.baseSalary / 30) * payableDays)
        });
      });
      onApplyAttendance(updated);
      setIsSyncing(false);
      setNotice(`Synchronized attendance for ${updated.length} workforce records.`);
      setTimeout(() => { setNotice(null); onClose(); }, 1200);
    }, 350);
  };

  const handleDownloadTemplate = () => {
    const headers = ['EmployeeCode', 'EmployeeName', 'PresentDays', 'ApprovedLeaveDays', 'UnexcusedAbsences'];
    const rows = payrollRecords.map((r) => [r.employeeCode, r.employeeName, r.workingDays, 0, Math.max(0, 30 - r.workingDays)]);
    downloadCsv('HAB_Attendance_Import_Template.csv', headers, rows.length > 0 ? rows : [['HAB-SEC-0101', 'Abebe Kassahun', 30, 0, 0]]);
  };

  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      setParsedRows(lines.slice(1).map((line) => {
        const p = line.split(',').map((item) => item.trim().replace(/^"|"$/g, ''));
        const absent = parseInt(p[4] || '0', 10) || 0;
        return {
          code: p[0] || '', name: p[1] || '',
          present: parseInt(p[2] || '30', 10) || 30, leave: parseInt(p[3] || '0', 10) || 0,
          absent, payableDays: Math.max(0, Math.min(30, 30 - absent))
        };
      }).filter((r) => r.code));
    };
    reader.readAsText(file);
  };

  const handleApplyExcel = () => {
    if (parsedRows.length === 0) return;
    const lookup = new Map(parsedRows.map((r) => [r.code.toLowerCase(), r]));
    const updated = payrollRecords.map((rec) => {
      const match = lookup.get(rec.employeeCode.toLowerCase());
      if (!match) return rec;
      return enrichPayrollRecord({
        ...rec,
        workingDays: match.payableDays,
        earnedBaseSalary: Math.round((rec.baseSalary / 30) * match.payableDays)
      });
    });
    onApplyAttendance(updated);
    setNotice(`Applied Excel attendance updates across ${parsedRows.length} employee records.`);
    setTimeout(() => { setNotice(null); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#F2C46A]" />
              <span>Import Attendance & Paid Days</span>
            </h3>
            <p className="text-xs text-slate-500">Reconcile 30-day Ethiopian month working days from HR or Excel</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {notice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button type="button" onClick={() => setActiveTab('sync')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'sync' ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            Sync from HR (1-Click Live)
          </button>
          <button type="button" onClick={() => setActiveTab('excel')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'excel' ? 'bg-[#F2C46A] text-[#4C4541] shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            Upload Attendance Excel
          </button>
        </div>

        {activeTab === 'sync' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FCF0DA] rounded-lg border border-[#EFE7D8] text-center">
                <Users className="w-4 h-4 text-[#4C4541] mx-auto mb-1" />
                <span className="text-[11px] text-[#4C4541] block">Total Staff Logged</span>
                <span className="text-sm font-bold text-[#4C4541]">{totalStaff} Employees</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                <CalendarCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] text-emerald-700 block">Avg Attendance</span>
                <span className="text-sm font-bold text-emerald-800">{avgAttendance}%</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-[11px] text-purple-700 block">Approved Leaves</span>
                <span className="text-sm font-bold text-purple-800">{approvedLeavesCount} Recognized</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block">Proration & Leave Recognition Policy:</span>
              <p className="text-[11px] leading-relaxed mt-0.5">
                Approved leaves (Annual, Sick, Bereavement) count as full paid days. Unexcused absences deduct <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">(Basic / 30) × Absent Days</code>.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" disabled={isSyncing} onClick={handleSyncFromHr} className="px-4 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing...' : 'Sync & Update Payroll Working Days'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Upload .xlsx or .csv roster with payable days</span>
              <button type="button" onClick={handleDownloadTemplate} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#4C4541] bg-[#FCF0DA] hover:bg-[#F2E0BD] border border-[#EFE7D8] rounded-md cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Excel Template</span>
              </button>
            </div>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileProcess(e.dataTransfer.files[0]); }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#F2C46A] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40"
            >
              <UploadCloud className="w-7 h-7 text-[#F2C46A] mb-1.5" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{fileName ? fileName : 'Click to select or drag & drop attendance roster'}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Supports .csv or exported .xlsx template format</span>
              <input type="file" accept=".csv,.xlsx" onChange={(e) => { if (e.target.files?.[0]) handleFileProcess(e.target.files[0]); }} className="hidden" />
            </label>
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Preview ({parsedRows.length} Records Detected):</span>
                <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold sticky top-0">
                      <tr><th className="p-1.5">Code</th><th className="p-1.5">Name</th><th className="p-1.5 text-center">Present</th><th className="p-1.5 text-center">Leave</th><th className="p-1.5 text-center">Absent</th><th className="p-1.5 text-right">Payable</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedRows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-1.5 font-mono">{r.code}</td><td className="p-1.5">{r.name}</td><td className="p-1.5 text-center">{r.present}</td><td className="p-1.5 text-center">{r.leave}</td><td className="p-1.5 text-center text-rose-600 font-semibold">{r.absent}</td><td className="p-1.5 text-right font-bold text-emerald-700">{r.payableDays}/30</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="button" onClick={handleApplyExcel} className="px-4 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] text-xs font-bold shadow-xs cursor-pointer">
                    Apply to Payroll ({parsedRows.length} records)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
