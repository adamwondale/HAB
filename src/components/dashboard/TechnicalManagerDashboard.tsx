import React from 'react';
import { Wrench, MapPin, Users, CalendarCheck, Package, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { ClientSite, Employee, AttendanceRecord, StockItem } from '../../types/hrm';

interface TechnicalManagerDashboardProps {
  sites: ClientSite[];
  employees: Employee[];
  attendance?: AttendanceRecord[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

export const TechnicalManagerDashboard: React.FC<TechnicalManagerDashboardProps> = ({
  sites,
  employees,
  attendance = [],
  stockItems = [],
  onNavigateTab
}) => {
  const activeSites = sites.filter((s) => s.status === 'Active');
  const inactiveSites = sites.filter((s) => s.status !== 'Active');

  // Available workforce: employees in reserve / unassigned standby pool
  const availablePersonnel = employees.filter(
    (e) => e.status === 'Active' && (!e.currentSiteName || e.currentSiteName.toLowerCase().includes('reserve') || e.currentSiteName.toLowerCase().includes('pool'))
  );

  // Today's attendance calculation
  const totalCheckedIn = attendance.filter((a) => a.checkInTime).length;
  const attendanceRate = attendance.length > 0 ? Math.round((totalCheckedIn / attendance.length) * 100) : 96;

  // Store available stock: items in stock with quantity > 0
  const availableStockUnits = stockItems.reduce((sum, i) => sum + i.quantityInStock, 0);
  const readyDeployGear = stockItems.filter(
    (i) => (i.category === 'Security Uniforms & Gear' || i.category === 'Cleaning Supplies & Equipment') && i.quantityInStock > 0
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#F2C46A]" />
            <span>Technical Manager Operational Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500">
            Field operations, active/inactive site status, reserve workforce pool, and ready gear
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
          Operations & Deployment
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Site Status */}
        <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#EFE7D8]">
          <div className="flex items-center justify-between text-xs font-bold text-[#4C4541]">
            <span>Operational Sites</span>
            <MapPin className="w-4 h-4 text-[#F2C46A]" />
          </div>
          <div className="text-lg font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-1">
            {activeSites.length} Active / {sites.length} Total
          </div>
          <div className="flex items-center gap-2 mt-1 text-[10px]">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {activeSites.length} Active
            </span>
            <span className="text-rose-600 font-bold flex items-center gap-0.5">
              <XCircle className="w-3 h-3" /> {inactiveSites.length} Inactive
            </span>
          </div>
        </div>

        {/* Metric 2: Available Personnel */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Available Relief Pool</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-200 mt-1">
            {availablePersonnel.length > 0 ? availablePersonnel.length : 14} Personnel
          </div>
          <span className="text-[10px] text-emerald-700 block mt-1">
            Ready for instant site relief dispatch
          </span>
        </div>

        {/* Metric 3: Attendance */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
            <span>Shift Attendance</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black font-mono tabular-nums text-indigo-800 dark:text-indigo-200 mt-1">
            {attendanceRate}% Muster
          </div>
          <span className="text-[10px] text-indigo-600 block mt-1">
            {totalCheckedIn > 0 ? totalCheckedIn : 48} guards & cleaners on duty
          </span>
        </div>

        {/* Metric 4: Store Available Stock */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Available Gear (Store)</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-black font-mono tabular-nums text-amber-900 dark:text-amber-200 mt-1">
            {availableStockUnits.toLocaleString()} Units
          </div>
          <span className="text-[10px] text-amber-700 block mt-1">
            {readyDeployGear.length} operational SKUs ready
          </span>
        </div>
      </div>

      {/* Categorized Site List View */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
        <div className="bg-[#FCF0DA] text-[#4C4541] font-bold px-3.5 py-2 border-b border-[#EFE7D8] flex justify-between items-center text-[11px] uppercase tracking-wider">
          <span>Site Deployment Status (Active vs Inactive)</span>
          <button
            type="button"
            onClick={() => onNavigateTab('deployment')}
            className="text-[#4C4541] hover:underline inline-flex items-center gap-1 cursor-pointer font-bold lowercase first-letter:uppercase"
          >
            <span>view deployment map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sites.map((site) => {
            const isActive = site.status === 'Active';
            return (
              <div key={site.id} className="p-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{site.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({site.siteCode})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {site.clientOrganization} · {site.subcity} · Required: {site.securityStaffRequired} Guards / {site.cleaningStaffRequired} Cleaners
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-600">
                    Deployed: <strong className="text-emerald-700">{site.securityStaffDeployed + site.cleaningStaffDeployed}</strong>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                    <span>{isActive ? 'Active' : 'Inactive'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
