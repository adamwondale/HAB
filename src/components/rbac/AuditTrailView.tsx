import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { getStoredAuditLogs } from '../../utils/auditLogger';
import { downloadCsv } from '../../utils/csvExport';

export const AuditTrailView: React.FC = () => {
  const { t } = useTranslation();
  const [logs] = useState(() => getStoredAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = logs.filter((entry) => {
    if (moduleFilter !== 'All' && entry.targetModule !== moduleFilter) return false;
    if (statusFilter !== 'All' && entry.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.actorName.toLowerCase().includes(q) ||
        entry.actorRole.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.details.toLowerCase().includes(q) ||
        (entry.targetId && entry.targetId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const filename = `HAB_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Module', 'Target ID', 'Previous Value', 'New Value', 'Status', 'Details'];
    const rows = filtered.map((l) => [
      l.timestamp,
      l.actorName,
      l.actorRole,
      l.action,
      l.targetModule,
      l.targetId || 'N/A',
      l.previousValue || 'N/A',
      l.newValue || 'N/A',
      l.status,
      l.details
    ]);
    downloadCsv(filename, headers, rows);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            {t('masterSetup.auditLogs')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('masterSetup.auditLogsSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{t('common.exportCsv')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Divisions', 'Payroll', 'Store', 'Employees', 'RBAC'].map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                moduleFilter === mod
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="All">{t('masterSetup.allActions')}</option>
            <option value="SUCCESS">Success Only</option>
            <option value="WARNING">Warnings</option>
            <option value="SECURITY_ALERT">Security Alerts</option>
          </select>
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('masterSetup.searchLogs')}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table: Calm Neutral Slate Header */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
            <tr>
              <th className="py-2.5 px-3">{t('masterSetup.timestamp')}</th>
              <th className="py-2.5 px-3">{t('masterSetup.actor')}</th>
              <th className="py-2.5 px-3">{t('masterSetup.action')}</th>
              <th className="py-2.5 px-3">{t('recruitment.division')}</th>
              <th className="py-2.5 px-3">Previous → New Value</th>
              <th className="py-2.5 px-3">{t('common.details')}</th>
              <th className="py-2.5 px-3 text-center">{t('masterSetup.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                  {t('common.noRecordsFound')}
                </td>
              </tr>
            ) : (
              filtered.map((log) => {
                const dateStr = log.timestamp.replace('T', ' ').slice(0, 19);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{dateStr}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{log.targetModule}</td>
                    <td className="py-2 px-3 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                      {log.previousValue && (
                        <span className="line-through text-slate-400 mr-1">{log.previousValue}</span>
                      )}
                      {log.newValue ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{log.newValue}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : log.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {log.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                        {log.status === 'WARNING' && <AlertTriangle className="w-3 h-3" />}
                        {log.status === 'SECURITY_ALERT' && <ShieldAlert className="w-3 h-3" />}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
