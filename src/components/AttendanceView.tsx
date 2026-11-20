import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, UploadCloud, Paperclip, FileSpreadsheet } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, ClientSite, Employee } from '../types/hrm';
import { AttendanceAttachmentModal } from './finance/AttendanceAttachmentModal';
import { DailyAttendanceSheetModal } from './attendance/DailyAttendanceSheetModal';
import { AttendanceUploadDropzone } from './attendance/AttendanceUploadDropzone';
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
  const [isDailySheetOpen, setIsDailySheetOpen] = useState(false);
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
    const headers = ['No.', t('attendance.employee'), 'Code', t('attendance.workSite'), t('attendance.date'), t('attendance.checkIn'), t('attendance.checkOut'), t('attendance.status')];
    const rows = filtered.map((r, i) => [i + 1, r.employeeName, r.employeeCode, r.siteName, r.date, r.checkInTime || '--', r.checkOutTime || '--', r.status]);
    downloadCsv(`HAB_Attendance_${selectedDate}.csv`, headers, rows);
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedScanNotice(`"${e.target.files[0].name}" loaded.`);
      setTimeout(() => setUploadedScanNotice(null), 4000);
    }
  };

  const effectiveEmployees: Employee[] = employees.length > 0 ? employees : filtered.map((r, i) => ({
    id: r.employeeId || `emp-${i}`, employeeCode: r.employeeCode, firstName: r.employeeName.split(' ')[0] || 'Staff',
    lastName: r.employeeName.split(' ')[1] || 'Member', role: 'Staff', department: r.serviceType, siteId: r.siteId,
    currentSiteName: r.siteName, status: 'Active', hiredDate: '2024-01-01', baseSalaryETB: 4500
  } as unknown as Employee));

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white">{t('attendance.dailyShiftTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('attendance.fieldBiometricSub')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 font-medium"
          />
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('attendance.downloadReport')}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDailySheetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#e0b257] text-[#4C4541] font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Daily Sheet & Excel Sync</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards: Typography-first, no saturated squares */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('attendance.present')}</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{presentCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('attendance.late')}</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{lateCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('attendance.absent')}</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-950 dark:text-white">{absentCount}</p>
        </div>
      </div>

      {/* Attachment of Attendance: Physical Scan Dropzone (Screen 7 Parity) */}
      <AttendanceUploadDropzone />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
          >
            <option value="All">{t('attendance.allSites')}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <span className="text-slate-500 text-[11px] font-mono">{filtered.length} {t('attendance.records')}</span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder={t('attendance.searchStaff')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg pl-7 pr-3 py-1.5 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Attendance Table: Eye-Friendly Calm Slate Header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">{t('attendance.employee')}</th>
              <th className="py-2.5 px-3">{t('attendance.date')}</th>
              <th className="py-2.5 px-3">{t('attendance.workSite')}</th>
              <th className="py-2.5 px-3">{t('attendance.checkIn')}</th>
              <th className="py-2.5 px-3">{t('attendance.evidence')}</th>
              <th className="py-2.5 px-3 text-right">{t('attendance.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((r, idx) => (
              <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                <td className="py-2 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
                  <div className="text-[10px] font-mono text-slate-400">{r.employeeCode} · {r.serviceType}</div>
                </td>
                <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">{r.date}</td>
                <td className="py-2 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{r.siteName}</td>
                <td className="py-2 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-400">{r.checkInTime || '08:00'} - {r.checkOutTime || '17:00'}</td>
                <td className="py-2 px-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('attendance.previewScan')}</span>
                  </button>
                </td>
                <td className="py-2 px-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {(['Present', 'Late', 'Absent'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateAttendanceStatus(r.id, st)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                          r.status === st
                            ? st === 'Present'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Late'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {st === 'Present' ? t('attendance.present') : st === 'Late' ? t('attendance.late') : t('attendance.absent')}
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
      <DailyAttendanceSheetModal
        isOpen={isDailySheetOpen}
        onClose={() => setIsDailySheetOpen(false)}
        sites={sites}
        employees={effectiveEmployees}
        attendanceRecords={attendanceRecords}
        onSaveDailySheet={(records) => {
          records.forEach(r => onUpdateAttendanceStatus(r.id, r.status));
        }}
      />
    </div>
  );
};
