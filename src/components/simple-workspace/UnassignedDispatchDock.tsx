import React, { useState } from 'react';
import { GripVertical, UserCheck, Shield, Sparkles, MapPin, ChevronRight, X } from 'lucide-react';
import { ClientSite, Employee } from '../../types/hrm';

interface UnassignedDispatchDockProps {
  unassignedEmployees: Employee[];
  sites: ClientSite[];
  draggedEmployee: Employee | null;
  onDragStart: (emp: Employee) => void;
  onDragEnd: () => void;
  onAssign: (employeeId: string, siteId: string, postName: string) => void;
}

export const UnassignedDispatchDock: React.FC<UnassignedDispatchDockProps> = ({
  unassignedEmployees,
  sites,
  draggedEmployee,
  onDragStart,
  onDragEnd,
  onAssign
}) => {
  // Show strictly 4 unassigned employees
  const displayQueue = unassignedEmployees.slice(0, 4);
  const [mobileAssignEmpId, setMobileAssignEmpId] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<string>('');

  const activeSites = sites.filter((s) => s.status === 'Active');
  const targetSite = activeSites.find((s) => s.id === selectedSiteId) || activeSites[0];

  const handleMobileSubmit = (empId: string) => {
    if (!targetSite) return;
    const post = selectedPost || targetSite.posts[0] || 'General Post';
    onAssign(empId, targetSite.id, post);
    setMobileAssignEmpId(null);
    setSelectedSiteId('');
    setSelectedPost('');
  };

  return (
    <section aria-labelledby="dispatch-dock-title" className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 id="dispatch-dock-title" className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              Unassigned Staff (Top 4 Waiting)
            </h2>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Drag an employee card onto an active work site to assign them instantly.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
          {unassignedEmployees.length} total unassigned
        </span>
      </div>

      {displayQueue.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-amber-300 bg-white/60 p-4 text-center dark:border-amber-800 dark:bg-slate-900/60">
          <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
            All active employees are currently assigned to work sites!
          </p>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {displayQueue.map((emp, index) => {
            const isBeingDragged = draggedEmployee?.id === emp.id;
            const isSecurity = emp.serviceType === 'Security';
            const isMobileOpen = mobileAssignEmpId === emp.id;

            return (
              <div
                key={emp.id}
                draggable
                onDragStart={() => onDragStart(emp)}
                onDragEnd={onDragEnd}
                className={`relative flex flex-col justify-between rounded-lg border bg-white p-3 shadow-xs transition-all cursor-grab active:cursor-grabbing dark:bg-slate-900 ${
                  isBeingDragged
                    ? 'border-amber-500 ring-2 ring-amber-400 opacity-60'
                    : 'border-slate-200 hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:hover:border-amber-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <GripVertical className="h-3 w-3 text-slate-400" />
                      #{index + 1} · {emp.employeeCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isSecurity
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {isSecurity ? <Shield className="h-2.5 w-2.5" /> : <Sparkles className="h-2.5 w-2.5" />}
                      {emp.serviceType}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-xs font-bold text-slate-950 dark:text-white">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {emp.role} · {emp.subcity || 'Addis Ababa'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                    Drag to deploy <ChevronRight className="h-3 w-3" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileAssignEmpId(isMobileOpen ? null : emp.id)}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {isMobileOpen ? 'Close' : 'Assign'}
                  </button>
                </div>

                {/* Mobile / Direct 1-tap assign popover */}
                {isMobileOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-slate-300 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Choose site</span>
                      <button type="button" onClick={() => setMobileAssignEmpId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <select
                      value={selectedSiteId || targetSite?.id}
                      onChange={(e) => {
                        setSelectedSiteId(e.target.value);
                        setSelectedPost('');
                      }}
                      className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {activeSites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.district || 'Addis'})
                        </option>
                      ))}
                    </select>

                    {targetSite?.posts?.length > 0 && (
                      <select
                        value={selectedPost || targetSite.posts[0]}
                        onChange={(e) => setSelectedPost(e.target.value)}
                        className="mt-2 w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {targetSite.posts.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMobileSubmit(emp.id)}
                      className="mt-2.5 w-full rounded bg-[#0E1525] py-1 text-xs font-semibold text-[#FFF9DB] hover:bg-[#19233C] dark:bg-[#EBE834] dark:text-[#0E1525]"
                    >
                      Confirm assignment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
