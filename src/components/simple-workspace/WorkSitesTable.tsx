import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { ClientSite, Employee } from '../../types/hrm';

interface WorkSitesTableProps {
  filteredSites: ClientSite[];
  draggedEmployee: Employee | null;
  hoveredSiteId: string | null;
  onHoverSite: (siteId: string | null) => void;
  onAssign: (empId: string, siteId: string, postName: string) => void;
}

export const WorkSitesTable: React.FC<WorkSitesTableProps> = ({
  filteredSites,
  draggedEmployee,
  hoveredSiteId,
  onHoverSite,
  onAssign
}) => {
  const { t } = useTranslation();

  if (filteredSites.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('deployment.noSitesMatch')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/60">
              <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('deployment.workSiteAndCode')}</th>
              <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('deployment.district')}</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{t('deployment.required')}</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{t('deployment.deployed')}</th>
              <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t('deployment.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSites.map((site) => {
              const isHovered = hoveredSiteId === site.id && draggedEmployee !== null;
              const isActive = site.status === 'Active';
              const req = site.securityStaffRequired + site.cleaningStaffRequired;
              const dep = site.securityStaffDeployed + site.cleaningStaffDeployed;

              return (
                <tr
                  key={site.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (hoveredSiteId !== site.id) onHoverSite(site.id);
                  }}
                  onDragLeave={() => {
                    if (hoveredSiteId === site.id) onHoverSite(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!isActive || !draggedEmployee) return;
                    onAssign(draggedEmployee.id, site.id, site.posts[0] || 'General Post');
                  }}
                  className={`relative transition-colors ${
                    isHovered
                      ? isActive
                        ? 'bg-slate-100/90 ring-2 ring-slate-400 dark:bg-slate-800/80 dark:ring-slate-500'
                        : 'bg-rose-50/80 ring-2 ring-rose-400 dark:bg-rose-950/40'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-950 dark:text-white">{site.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {site.siteCode} · {site.clientOrganization}
                      </span>
                    </div>

                    {isHovered && (
                      <div className="absolute left-4 z-30 mt-1 max-w-md rounded-lg border border-slate-300 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        {isActive ? (
                          <div>
                            <p className="text-[11px] font-semibold text-slate-900 dark:text-white">
                              {t('deployment.dropOntoPost')} {draggedEmployee?.firstName}:
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {(site.posts.length > 0 ? site.posts : ['Main Gate', 'Facility Post']).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onDrop={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (draggedEmployee) onAssign(draggedEmployee.id, site.id, p);
                                  }}
                                  onClick={() => {
                                    if (draggedEmployee) onAssign(draggedEmployee.id, site.id, p);
                                  }}
                                  className="rounded border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                  + {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                            <AlertCircle className="h-3.5 w-3.5" /> {t('deployment.siteInactiveNotice')}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                    {site.district || t('deployment.unassigned')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    {req}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {dep}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {isActive ? t('deployment.active') : t('deployment.inactive')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
