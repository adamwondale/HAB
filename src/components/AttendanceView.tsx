import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, ClientSite, ServiceType } from '../types/hrm';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  sites: ClientSite[];
  onUpdateAttendanceStatus: (recordId: string, newStatus: AttendanceStatus, overtimeHours?: number) => void;
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  sites,
  onUpdateAttendanceStatus
}) => {
  const { t } = useTranslation();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<'All' | ServiceType>('All');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = attendanceRecords.filter((r) => {
    if (selectedSiteId !== 'All' && r.siteId !== selectedSiteId) return false;
    if (selectedService !== 'All' && r.serviceType !== selectedService) return false;
    if (selectedShiftFilter !== 'All' && r.shift !== selectedShiftFilter) return false;
    if (selectedDate && r.date !== selectedDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeCode.toLowerCase().includes(q) ||
        r.siteName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const presentCount = filteredRecords.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Overtime').length;
  const lateCount = filteredRecords.filter((r) => r.status === 'Late').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'Absent').length;
  const totalOvertime = filteredRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
  const attendanceRate = filteredRecords.length > 0 ? Math.round((presentCount / filteredRecords.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            {t('attendance.dailyShiftOps')}
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('attendance.shiftAttendanceTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('attendance.shiftAttendanceSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600 font-medium"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('attendance.turnoutRate')}</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">{attendanceRate}%</div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">{presentCount} {t('attendance.staffOnDuty')}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('attendance.lateArrivals')}</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums mt-0.5">{lateCount}</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('attendance.recordedForReview')}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('attendance.unexcusedAbsences')}</div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">{absentCount}</div>
          <span className="text-[11px] text-rose-700 dark:text-rose-400">{t('attendance.coverageFlagged')}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t('attendance.loggedOvertime')}</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-400 tabular-nums mt-0.5">{totalOvertime} hrs</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('attendance.syncedToPayroll')}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            aria-label="Filter attendance by site"
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">{t('attendance.allSites')}</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            aria-label="Filter attendance by division"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">{t('attendance.allDivisions')}</option>
            <option value="Security">{t('common.security')}</option>
            <option value="Cleaning">{t('common.cleaning')}</option>
            <option value="Property Management">{t('common.propertyManagement')}</option>
            <option value="Head Office Staff">{t('common.headOfficeStaff')}</option>
          </select>

          <select
            aria-label="Filter attendance by scheduled shift"
            value={selectedShiftFilter}
            onChange={(e) => setSelectedShiftFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-600"
          >
            <option value="All">{t('attendance.allShifts')}</option>
            <option value="24h Duty (24hr ON / 48hr REST)">Security: 24h Duty (24hr ON / 48hr REST)</option>
            <option value="Morning Shift (06:00 - 14:00)">Cleaning: Morning Shift (06:00 - 14:00)</option>
            <option value="Afternoon Shift (14:00 - 22:00)">Cleaning: Afternoon Shift (14:00 - 22:00)</option>
            <option value="Regular Office Hours (08:00 - 17:00)">Regular Office Hours (08:00 - 17:00)</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t('attendance.searchStaff')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 placeholder-slate-400 focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      {/* Attendance Sheet */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs min-w-[820px]">
          <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-4 px-5">{t('attendance.employee')}</th>
              <th className="py-4 px-5">{t('attendance.division')}</th>
              <th className="py-4 px-5">{t('attendance.clientSite')}</th>
              <th className="py-4 px-5">{t('attendance.scheduledShift')}</th>
              <th className="py-4 px-5">{t('attendance.checkIn')}</th>
              <th className="py-4 px-5">{t('attendance.overtime')}</th>
              <th className="py-4 px-5">{t('attendance.status')}</th>
              <th className="py-4 px-5 text-right">{t('attendance.quickMark')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="odd:bg-white odd:dark:bg-slate-900 even:bg-slate-50/80 even:dark:bg-slate-800/40 hover:bg-slate-100/70 hover:dark:bg-slate-800/70 transition-colors">
                <td className="py-4 px-5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{r.employeeCode}</div>
                </td>
                <td className="py-4 px-5">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                    r.serviceType === 'Security'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                      : r.serviceType === 'Cleaning'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                  }`}>
                    {r.serviceType}
                  </span>
                </td>
                <td className="py-4 px-5 text-slate-700 dark:text-slate-300 max-w-xs truncate">{r.siteName}</td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{r.shift}</div>
                  <div className="text-[10px] text-slate-400">
                    {r.serviceType === 'Security' ? t('attendance.securityDutyRule') : t('attendance.cleaningDutyRule')}
                  </div>
                </td>
                <td className="py-4 px-5 text-slate-500 font-mono tabular-nums">{r.checkInTime || '--'}</td>
                <td className="py-4 px-5">
                  {r.overtimeHours > 0 ? (
                    <span className="font-mono text-blue-700 dark:text-blue-400 font-medium text-[11px]">+{r.overtimeHours} hrs</span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>
                <td className="py-4 px-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                    r.status === 'Present'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : r.status === 'Late'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : r.status === 'Absent'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {r.status === 'Present' ? t('attendance.present') : r.status === 'Late' ? t('attendance.late') : r.status === 'Absent' ? t('attendance.absent') : r.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateAttendanceStatus(r.id, 'Present')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        r.status === 'Present' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {t('attendance.present')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateAttendanceStatus(r.id, 'Late')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        r.status === 'Late' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {t('attendance.late')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateAttendanceStatus(r.id, 'Absent')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        r.status === 'Absent' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {t('attendance.absent')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
