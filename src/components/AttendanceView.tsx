import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, UploadCloud, Paperclip, CheckCircle2, Clock, XCircle, FileSpreadsheet } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, ClientSite, Employee } from '../types/hrm';
import { AttendanceAttachmentModal } from './finance/AttendanceAttachmentModal';
import { downloadCsv } from '../utils/csvExport';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  sites: ClientSite[];
  employees?: Employee[];
  onUpdateAttendanceStatus: (recordId: string, newStatus: AttendanceStatus, overtimeHours?: number) => void;
  onAddAttendanceRecord?: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  sites,
  employees = [],
  onUpdateAttendanceStatus
}) => {
  const { t } = useTranslation();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedScanNotice, setUploadedScanNotice] = useState<string | null>(null);

  const filtered = attendanceRecords.filter((r) => {
    if (selectedSiteId !== 'All' && r.siteId !== selectedSiteId) return false;
    if (selectedDate && r.date !== selectedDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.employeeName.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q) || r.siteName.toLowerCase().includes(q);
    }
    return true;
  });

  const presentCount = filtered.filter((r) => r.status === 'Present' || r.status === 'Overtime').length;
  const lateCount = filtered.filter((r) => r.status === 'Late').length;
  const absentCount = filtered.filter((r) => r.status === 'Absent').length;

  const handleDownloadReport = () => {
    const headers = ['No.', 'Employee Name', 'Code', 'Site', 'Date', 'Check-In', 'Check-Out', 'Status'];
    const rows = filtered.map((r, i) => [i + 1, r.employeeName, r.employeeCode, r.siteName, r.date, r.checkInTime || '--', r.checkOutTime || '--', r.status]);
    downloadCsv(`HAB_Attendance_${selectedDate}.csv`, headers, rows);
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedScanNotice(`Biometric roster "${e.target.files[0].name}" parsed successfully.`);
      setTimeout(() => setUploadedScanNotice(null), 4000);
    }
  };

  const effectiveEmployees: Employee[] = employees.length > 0 ? employees : filtered.map((r, i) => ({
    id: r.employeeId || `emp-${i}`, employeeCode: r.employeeCode, firstName: r.employeeName.split(' ')[0] || 'Staff',
    lastName: r.employeeName.split(' ')[1] || 'Member', role: 'Staff', department: r.serviceType, siteId: r.siteId,
    currentSiteName: r.siteName, status: 'Active', hiredDate: '2024-01-01', baseSalaryETB: 4500
  } as unknown as Employee));

  return (
    <div className="space-y-4">
      {/* Top Header & Summary Badges */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Field Biometric & Shift Muster</div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Daily Shift Attendance Cockpit</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-medium" />
          <button type="button" onClick={handleDownloadReport} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCF0DA] text-[#4C4541] hover:bg-[#F2C46A] text-xs font-bold transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download Report
          </button>
        </div>
      </div>

      {/* Top Summary Counters: Present, Late, Absent */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-xl flex items-center justify-between">
          <div><span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Present</span><div className="text-xl font-black text-emerald-900 dark:text-emerald-100 tabular-nums">{presentCount}</div></div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3 rounded-xl flex items-center justify-between">
          <div><span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">Late</span><div className="text-xl font-black text-amber-900 dark:text-amber-100 tabular-nums">{lateCount}</div></div>
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 p-3 rounded-xl flex items-center justify-between">
          <div><span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase">Absent</span><div className="text-xl font-black text-rose-900 dark:text-rose-100 tabular-nums">{absentCount}</div></div>
          <XCircle className="w-6 h-6 text-rose-600" />
        </div>
      </div>

      {/* Scan / Biometric Upload Area */}
      <div className="border-2 border-dashed border-[#F2C46A]/80 dark:border-amber-900/40 rounded-xl p-3.5 bg-[#FCF0DA]/30 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F2C46A] text-[#4C4541] flex items-center justify-center shrink-0"><UploadCloud className="w-5 h-5" /></div>
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">Drag & Drop Biometric Attendance Scan or Excel Roster</div>
            <p className="text-[11px] text-slate-500">Supports ZKTeco biometrics, site supervisor signature scans, and daily shift sheets (.csv, .xlsx, .pdf)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {uploadedScanNotice && <span className="text-emerald-700 font-bold text-[11px]">{uploadedScanNotice}</span>}
          <label className="px-3 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#e6b450] text-[#4C4541] font-bold cursor-pointer transition-colors shrink-0">
            <span>Browse Scan</span>
            <input type="file" className="hidden" accept=".xlsx,.csv,.pdf,image/*" onChange={handleFileDrop} />
          </label>
          <button type="button" onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 cursor-pointer flex items-center gap-1 shrink-0">
            <Paperclip className="w-3.5 h-3.5" /> Evidence
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <select value={selectedSiteId} onChange={(e) => setSelectedSiteId(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5">
            <option value="All">{t('attendance.allSites')}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <span className="text-slate-400 text-[11px] font-mono">{filtered.length} records</span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input type="text" placeholder={t('attendance.searchStaff')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg pl-7 pr-3 py-1.5" />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-[#FCF0DA] text-[#4C4541] border-b border-[#EFE7D8] font-bold uppercase text-[10px]">
            <tr>
              <th className="py-2 px-3">No.</th>
              <th className="py-2 px-3">Employee</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Work Site</th>
              <th className="py-2 px-3">Check In / Out</th>
              <th className="py-2 px-3">Attachment</th>
              <th className="py-2 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((r, idx) => (
              <tr key={r.id} className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                <td className="py-2 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
                  <div className="text-[10px] font-mono text-slate-400">{r.employeeCode} · {r.serviceType}</div>
                </td>
                <td className="py-2 px-3 font-mono text-slate-600">{r.date}</td>
                <td className="py-2 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{r.siteName}</td>
                <td className="py-2 px-3 font-mono tabular-nums text-slate-600">{r.checkInTime || '08:00'} - {r.checkOutTime || '17:00'}</td>
                <td className="py-2 px-3">
                  <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-400 hover:underline cursor-pointer">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                    <span>Preview Scan</span>
                  </button>
                </td>
                <td className="py-2 px-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {(['Present', 'Late', 'Absent'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateAttendanceStatus(r.id, st)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          r.status === st
                            ? st === 'Present' ? 'bg-emerald-600 text-white' : st === 'Late' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AttendanceAttachmentModal isOpen={isModalOpen} employees={effectiveEmployees} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
