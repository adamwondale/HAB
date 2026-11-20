import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Building2, UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, Sparkles, Clock } from 'lucide-react';
import { ClientSite, Employee, AttendanceRecord, AttendanceStatus, LeaveRequest } from '../../types/hrm';

interface DailyAttendanceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: ClientSite[];
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests?: LeaveRequest[];
  onSaveDailySheet: (records: AttendanceRecord[]) => void;
}

export const DailyAttendanceSheetModal: React.FC<DailyAttendanceSheetModalProps> = ({
  isOpen,
  onClose,
  sites,
  employees,
  leaveRequests = [],
  onSaveDailySheet
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'All');
  const [sheetData, setSheetData] = useState<Record<string, { status: AttendanceStatus; lateMinutes?: number; notes?: string }>>({});
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [excelSuccessMsg, setExcelSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSite = sites.find(s => s.id === selectedSiteId);
  const siteEmployees = employees.filter(e => e.status !== 'Exited' && (selectedSiteId === 'All' || e.currentSiteId === selectedSiteId || (currentSite && e.currentSiteName === currentSite.name)));

  const getStatus = (empId: string): AttendanceStatus => {
    if (sheetData[empId]?.status) return sheetData[empId].status;
    return leaveRequests.some(l => l.employeeId === empId && l.status === 'Approved') ? 'Excused' : 'Present';
  };

  const setStatus = (empId: string, status: AttendanceStatus, lateMinutes = 0) => {
    setSheetData(prev => ({ ...prev, [empId]: { status, lateMinutes } }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; lateMinutes?: number }> = {};
    siteEmployees.forEach(e => {
      updated[e.id] = { status: leaveRequests.some(l => l.employeeId === e.id && l.status === 'Approved') ? 'Excused' : 'Present' };
    });
    setSheetData(updated);
  };

  const handleSimulateExcelUpload = () => {
    setIsExcelUploading(true);
    setTimeout(() => {
      setIsExcelUploading(false);
      handleMarkAllPresent();
      setExcelSuccessMsg(`Successfully imported daily biometric sheet: ${siteEmployees.length} entries matched.`);
      setTimeout(() => setExcelSuccessMsg(null), 3500);
    }, 600);
  };

  const handleSave = () => {
    const recordsToSave: AttendanceRecord[] = siteEmployees.map(emp => {
      const st = getStatus(emp.id);
      return {
        id: `att-${emp.id}-${selectedDate}`, date: selectedDate, employeeId: emp.id, employeeCode: emp.employeeCode,
        employeeName: `${emp.firstName} ${emp.lastName}`, serviceType: emp.serviceType, siteId: emp.currentSiteId || selectedSiteId,
        siteName: emp.currentSiteName || currentSite?.name || 'Assigned Site', shift: emp.currentShift || '24h Duty (24hr ON / 48hr REST)',
        status: st, checkInTime: st === 'Present' || st === 'Late' ? '06:00' : undefined, checkOutTime: st === 'Present' || st === 'Late' ? '18:00' : undefined,
        overtimeHours: 0, markedBy: 'Supervisor'
      };
    });
    onSaveDailySheet(recordsToSave);
    onClose();
  };

  const presentCount = siteEmployees.filter(e => getStatus(e.id) === 'Present').length;
  const lateCount = siteEmployees.filter(e => getStatus(e.id) === 'Late').length;
  const absentCount = siteEmployees.filter(e => getStatus(e.id) === 'Absent').length;
  const targetRequired = currentSite ? (currentSite.securityStaffRequired + currentSite.cleaningStaffRequired) : siteEmployees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[#FCF0DA]/40 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C46A] text-[#4C4541] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daily Attendance Entry & Sheet Reconciliation
              </h2>
              <p className="text-xs text-slate-500">
                Manual daily roster entry with smart suggestions and Excel spreadsheet upload
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Suggestions */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Work Site</label>
              <select value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium text-slate-800 dark:text-slate-200">
                <option value="All">All Sites ({employees.length} Staff)</option>
                {sites.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-mono text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 rounded-lg bg-[#FCF0DA] hover:bg-[#F2C46A]/40 text-[#4C4541] font-bold border border-[#F2C46A]/60 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Suggest: Mark All Scheduled Present</span>
            </button>
            <button
              type="button"
              onClick={handleSimulateExcelUpload}
              disabled={isExcelUploading}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>{isExcelUploading ? 'Importing...' : 'Upload Daily Excel'}</span>
            </button>
          </div>
        </div>

        {excelSuccessMsg && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{excelSuccessMsg}</span>
          </div>
        )}

        {/* Metric Badges */}
        <div className="px-5 pt-3 grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Roster Headcount</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{siteEmployees.length}</span>
            {targetRequired > 0 && <span className="text-[9px] text-slate-500 block">Quota: {targetRequired}</span>}
          </div>
          {[
            { label: 'Present', val: presentCount, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' },
            { label: 'Late', val: lateCount, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' },
            { label: 'Absent', val: absentCount, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300' }
          ].map(b => (
            <div key={b.label} className={`p-2 rounded-lg ${b.color}`}>
              <span className="text-[10px] uppercase font-bold block">{b.label}</span>
              <span className="font-mono font-bold text-lg">{b.val}</span>
            </div>
          ))}
        </div>

        {/* Sheet Table */}
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF0DA] text-[#4C4541] font-bold uppercase text-[10px] border-b border-slate-200 dark:bg-slate-800 dark:text-amber-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Personnel</th>
                  <th className="py-2.5 px-3">Post & Shift</th>
                  <th className="py-2.5 px-3 text-center">Attendance Status</th>
                  <th className="py-2.5 px-3 text-right">Lateness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {siteEmployees.map(emp => {
                  const currentSt = getStatus(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.employeeCode} · {emp.serviceType}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        <span>{emp.currentSiteName || 'Reserve Pool'}</span>
                        <span className="text-[10px] block text-slate-400">{emp.currentShift?.split('(')[0] || 'Standard'}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1">
                          {(['Present', 'Late', 'Absent', 'Excused'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStatus(emp.id, st)}
                              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                currentSt === st ? (st === 'Present' ? 'bg-emerald-600 text-white' : st === 'Late' ? 'bg-amber-500 text-white' : st === 'Absent' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white') : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {currentSt === 'Late' ? (
                          <span className="text-amber-600 font-bold">+15 min</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[#4C4541] hover:bg-slate-900 text-white dark:bg-[#F2C46A] dark:text-[#4C4541] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Commit Daily Sheet ({siteEmployees.length} Records)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
