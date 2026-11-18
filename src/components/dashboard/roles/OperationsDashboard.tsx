import React from 'react';
import { MapPin, Users, Shield, Clock, AlertTriangle, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { ClientSite, Deployment, AttendanceRecord, Employee, StockItem } from '../../../types/hrm';
import { DashboardMetricCard } from '../shared/DashboardMetricCard';

interface OperationsDashboardProps {
  sites: ClientSite[];
  deployments: Deployment[];
  attendance: AttendanceRecord[];
  employees: Employee[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  sites = [],
  deployments = [],
  attendance = [],
  employees = [],
  onNavigateTab
}) => {
  const activeSites = sites.filter((s) => s.status === 'Active');
  const activeDeployments = deployments.filter((d) => d.status === 'Active');
  const presentToday = attendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentToday / attendance.length) * 100) : 100;

  const totalRequiredPersonnel = activeSites.reduce(
    (sum, s) => sum + (s.securityStaffRequired || 0) + (s.cleaningStaffRequired || 0),
    0
  );
  const totalMannedPersonnel = activeDeployments.length;
  const coveragePercent = totalRequiredPersonnel > 0
    ? Math.min(100, Math.round((totalMannedPersonnel / totalRequiredPersonnel) * 100))
    : 100;

  const operationalAlerts = [
    { label: 'Unmanned Site Posts', note: `${Math.max(0, totalRequiredPersonnel - totalMannedPersonnel)} guards/cleaners needed`, tab: 'deployment', action: 'Deploy Staff' },
    { label: 'Weekly Shift Rotations Due', note: 'Sunday night & day schedule balance', tab: 'deployment', action: 'Inspect Shifts' },
    { label: 'Field Uniform & Equipment Requests', note: 'Security gear & cleaning supplies', tab: 'store', action: 'Requisitions' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Operations KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Active Client Sites"
          value={activeSites.length.toLocaleString()}
          note={`${sites.length} total active & standby contracts`}
          actionLabel="View Sites"
          onAction={() => onNavigateTab('deployment')}
          icon={MapPin}
          tone="bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <DashboardMetricCard
          label="Manned Deployments"
          value={activeDeployments.length.toLocaleString()}
          note={`${coveragePercent}% of client contract requirements`}
          actionLabel="Deployments"
          onAction={() => onNavigateTab('deployment')}
          icon={Users}
          tone="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <DashboardMetricCard
          label="Daily Attendance Rate"
          value={`${attendanceRate}%`}
          note={`${presentToday} personnel on duty today`}
          actionLabel="Check Roster"
          onAction={() => onNavigateTab('attendance')}
          icon={Clock}
          tone="bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <DashboardMetricCard
          label="Site Equipment Allocation"
          value={`${activeSites.length * 4} Units`}
          note="Active gear deployed in field"
          actionLabel="View Gear"
          onAction={() => onNavigateTab('store')}
          icon={PackageCheck}
          tone="bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
        />
      </section>

      {/* Active Client Sites Coverage & Operations Queue */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Active Client Sites Register */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#F2C46A]" />
                <span>Client Site Deployment Coverage</span>
              </h2>
              <p className="text-xs text-slate-500">Live operational contract posts across Addis Ababa & regional branches.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('deployment')}
              className="text-xs font-bold text-[#4C4541] hover:underline dark:text-[#F2C46A] cursor-pointer"
            >
              All Sites →
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {activeSites.slice(0, 5).map((site) => {
              const siteStaff = activeDeployments.filter((d) => d.siteId === site.id);
              const required = (site.securityStaffRequired || 0) + (site.cleaningStaffRequired || 0) || 1;
              const isShort = siteStaff.length < required;
              return (
                <div key={site.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{site.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {site.subcity} · {site.servicesProvided.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-xs font-bold ${isShort ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {siteStaff.length} / {required} Staff
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {isShort ? 'Under-manned post' : 'Fully deployed'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operations Priority Queue */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Field Operations Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Supervisory actions and shift rosters.</p>
            </div>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {operationalAlerts.map((item) => (
              <div key={item.label} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab(item.tab)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#FCF0DA] text-[#4C4541] hover:bg-[#F2C46A] transition-colors cursor-pointer"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
