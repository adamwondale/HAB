import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClientSite, Employee } from '../../types/hrm';

interface WorkSiteAssignFormProps {
  unassignedEmployees: Employee[];
  sites: ClientSite[];
  filteredSites: ClientSite[];
  onAssign: (empId: string, siteId: string, postName: string) => void;
  onCancel: () => void;
}

export const WorkSiteAssignForm: React.FC<WorkSiteAssignFormProps> = ({
  unassignedEmployees,
  sites,
  filteredSites,
  onAssign,
  onCancel
}) => {
  const { t } = useTranslation();
  const [formEmpId, setFormEmpId] = useState<string>('');
  const [formSiteId, setFormSiteId] = useState<string>('');
  const [formPost, setFormPost] = useState<string>('');

  const activeSites = sites.filter((s) => s.status === 'Active');
  const activeFormSite = activeSites.find((s) => s.id === (formSiteId || filteredSites[0]?.id || activeSites[0]?.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = formEmpId || unassignedEmployees[0]?.id;
    const siteId = formSiteId || activeFormSite?.id;
    const post = formPost || activeFormSite?.posts[0] || 'General Post';
    if (empId && siteId) {
      onAssign(empId, siteId, post);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
          {t('deployment.assignToSiteTitle')}
        </h3>
        <span className="text-[11px] text-slate-500">{t('deployment.fastAssignment')}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('common.employee', { defaultValue: 'Employee' })}</label>
          <select
            value={formEmpId || unassignedEmployees[0]?.id || ''}
            onChange={(e) => setFormEmpId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {unassignedEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName} ({e.serviceType} · {e.employeeCode})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('deployment.workSitesTitle')}</label>
          <select
            value={formSiteId || activeFormSite?.id || ''}
            onChange={(e) => {
              setFormSiteId(e.target.value);
              setFormPost('');
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {activeSites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.district || 'Addis'})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('deployment.postArea')}</label>
          <select
            value={formPost || activeFormSite?.posts[0] || ''}
            onChange={(e) => setFormPost(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {(activeFormSite?.posts || ['Main Gate', 'Perimeter']).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
        >
          {t('deployment.saveAssignment')}
        </button>
      </div>
    </form>
  );
};
