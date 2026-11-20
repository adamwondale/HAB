import React, { useState } from 'react';
import { Wrench, MapPin, Users, ClipboardList, Package, AlertTriangle, Clock, ChevronRight, ShieldAlert } from 'lucide-react';
import { ClientSite, Employee, AttendanceRecord, StockItem } from '../../types/hrm';

interface TechnicalManagerDashboardProps {
  sites: ClientSite[];
  employees: Employee[];
  attendance?: AttendanceRecord[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

interface WorkRequest {
  id: string;
  code: string;
  title: string;
  siteName: string;
  serviceType: string;
  assignedTeam: string;
  status: 'In Progress' | 'Dispatched' | 'Scheduled' | 'Completed';
}

const INITIAL_REQUESTS: WorkRequest[] = [
  { id: 'wr-1', code: 'WR-801', title: 'Water booster pump failure', siteName: 'Bole Medhanialem Tower', serviceType: 'Plumbing', assignedTeam: 'Team Delta (2 Techs)', status: 'In Progress' },
  { id: 'wr-2', code: 'WR-802', title: 'Main generator AVR inspection', siteName: 'Kazanchis Business Center', serviceType: 'Electrical', assignedTeam: 'Eng. Solomon & Dawit', status: 'Dispatched' },
  { id: 'wr-3', code: 'WR-803', title: 'Perimeter access sensor recalibration', siteName: 'CMC Residential Complex', serviceType: 'Security Systems', assignedTeam: 'Tech. Abebe T.', status: 'Scheduled' },
  { id: 'wr-4', code: 'WR-804', title: 'Chiller fan belt replacement', siteName: 'Megenagna Hub', serviceType: 'HVAC', assignedTeam: 'Yared M. & Team', status: 'Completed' }
];

const INVENTORY_TRACKERS = [
  { id: 'sit-1', siteName: 'Bole Medhanialem', itemRequested: 'Motorola Handheld Radios (x4)', requestingEmployee: 'Sup. Yared K.', lowStockStatus: 'Critical', issuedType: 'Temporary Custody', returned: '3 / 4', damaged: 1 },
  { id: 'sit-2', siteName: 'Kazanchis Center', itemRequested: 'Industrial Floor Scrubbers', requestingEmployee: 'Lead Aster G.', lowStockStatus: 'Low', issuedType: 'Permanent Issue', returned: '2 / 2', damaged: 0 },
  { id: 'sit-3', siteName: 'CMC Complex', itemRequested: 'Heavy Duty Guard Batons', requestingEmployee: 'Sgt. Mulugeta', lowStockStatus: 'Adequate', issuedType: 'Consumable', returned: '12 / 12', damaged: 0 },
  { id: 'sit-4', siteName: 'Sarbet Substation', itemRequested: 'High-Voltage Insulated Boots', requestingEmployee: 'Eng. Bekele', lowStockStatus: 'Critical', issuedType: 'Temporary Custody', returned: '0 / 2', damaged: 0 }
];

export const TechnicalManagerDashboard: React.FC<TechnicalManagerDashboardProps> = ({
  sites,
  stockItems = [],
  onNavigateTab
}) => {
  const activeSites = sites.filter((s) => s.status === 'Active');
  const totalDeployed = sites.reduce((sum, s) => sum + (s.securityStaffDeployed || 0) + (s.cleaningStaffDeployed || 0), 0);
  const [alertTab, setAlertTab] = useState<'all' | 'urgent' | 'pending'>('all');
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>(INITIAL_REQUESTS);

  const cycleStatus = (id: string) => {
    const statuses: WorkRequest['status'][] = ['Scheduled', 'Dispatched', 'In Progress', 'Completed'];
    setWorkRequests(prev => prev.map(w => w.id === id ? { ...w, status: statuses[(statuses.indexOf(w.status) + 1) % statuses.length] } : w));
  };

  const urgentAlerts = [
    { id: 'ua-1', label: 'Bole Medhanialem: Water Booster Pump Breakdown', meta: 'Pressure dropped to 0.4 bar; maintenance crew dispatched', time: '12m ago' },
    { id: 'ua-2', label: 'Kazanchis Center: Generator AVR Voltage Surge Alert', meta: 'Emergency standby power transfer tripped during grid outage', time: '35m ago' }
  ];

  const pendingAlerts = [
    { id: 'pa-1', label: 'Store Requisition #SR-402 (12 Radios & Torches)', meta: 'Pending Store Keeper physical handover for Bole site', time: '1h ago' },
    { id: 'pa-2', label: 'Quarterly Preventive Servicing due in 2 days', meta: 'HVAC filtration and chiller maintenance across 3 branch hubs', time: '3h ago' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#F2C46A]" />
            <span>Field Technical Dispatch & Engineering Cockpit</span>
          </h2>
          <p className="text-xs text-slate-500">Work order tracking, site breakdown triage, and engineering resource allocations</p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8] px-2.5 py-1 rounded-full w-fit">
          Engineering & Maintenance
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#FCF0DA]/60 dark:bg-slate-800/60 p-3 rounded-xl border border-[#EFE7D8]">
          <div className="flex items-center justify-between text-xs font-bold text-[#4C4541]"><span>Active Sites</span><MapPin className="w-4 h-4 text-[#F2C46A]" /></div>
          <div className="text-xl font-black font-mono tabular-nums text-[#4C4541] dark:text-slate-100 mt-1">{activeSites.length} <span className="text-xs font-normal text-slate-500">/ {sites.length}</span></div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">100% contracts operational</span>
        </div>
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800"><span>Deployed Staff</span><Users className="w-4 h-4 text-emerald-600" /></div>
          <div className="text-xl font-black font-mono tabular-nums text-emerald-800 dark:text-emerald-200 mt-1">{totalDeployed || 238} <span className="text-xs font-normal">Personnel</span></div>
          <span className="text-[10px] text-emerald-700 block mt-1">Field guards & technicians</span>
        </div>
        <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900"><span>Total Work Orders</span><ClipboardList className="w-4 h-4 text-amber-600" /></div>
          <div className="text-xl font-black font-mono tabular-nums text-amber-900 dark:text-amber-200 mt-1">{workRequests.length} <span className="text-xs font-normal">Active</span></div>
          <span className="text-[10px] text-amber-700 block mt-1">2 Urgent · 1 Dispatched · 1 Sched.</span>
        </div>
        <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900"><span>Store Requests</span><Package className="w-4 h-4 text-blue-600" /></div>
          <div className="text-xl font-black font-mono tabular-nums text-blue-900 dark:text-blue-200 mt-1">{stockItems.length > 0 ? 9 : 9} <span className="text-xs font-normal">Requisitions</span></div>
          <span className="text-[10px] text-blue-700 block mt-1">3 Critical requisitions pending</span>
        </div>
      </div>

      {/* Dual-tier Technical Alert Rail (Urgent vs Pending) */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-[#F2C46A]" /><span className="text-xs font-bold text-[#4C4541] dark:text-slate-200 uppercase tracking-wide">Technical Alert Center</span></div>
          <div className="flex gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
            {(['all', 'urgent', 'pending'] as const).map(tab => (
              <button key={tab} type="button" onClick={() => setAlertTab(tab)} className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer ${alertTab === tab ? 'bg-[#F2C46A] text-[#4C4541] font-bold' : 'text-slate-600'}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {(alertTab === 'all' || alertTab === 'urgent') && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Urgent Technical Alerts</span>
              {urgentAlerts.map(a => (
                <div key={a.id} className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 flex justify-between items-start">
                  <div><p className="font-bold text-[11px]">{a.label}</p><p className="text-[10px] text-rose-700">{a.meta}</p></div>
                  <span className="text-[10px] font-mono text-rose-600 shrink-0 ml-1">{a.time}</span>
                </div>
              ))}
            </div>
          )}
          {(alertTab === 'all' || alertTab === 'pending') && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending & Scheduled Work</span>
              {pendingAlerts.map(a => (
                <div key={a.id} className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex justify-between items-start">
                  <div><p className="font-bold text-[11px]">{a.label}</p><p className="text-[10px] text-amber-700">{a.meta}</p></div>
                  <span className="text-[10px] font-mono text-amber-600 shrink-0 ml-1">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Work Request Dispatch Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs">
        <div className="bg-[#FCF0DA] text-[#4C4541] font-bold px-3 py-1.5 border-b border-[#EFE7D8] flex justify-between items-center text-[11px] uppercase tracking-wider">
          <span>Work Request Dispatch Table</span><span className="text-[10px] lowercase font-normal text-slate-500">click status to update in-place</span>
        </div>
        <table className="w-full text-left min-w-[620px]">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 text-[10px] uppercase">
            <tr>
              <th className="py-2 px-3">Work Request</th>
              <th className="py-2 px-3">Service Type</th>
              <th className="py-2 px-3">Assigned Teams</th>
              <th className="py-2 px-3">Site</th>
              <th className="py-2 px-3 text-right">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {workRequests.map(wr => (
              <tr key={wr.id} className="hover:bg-slate-50/80">
                <td className="py-2 px-3"><span className="font-mono text-slate-400 mr-1">{wr.code}</span><span className="font-semibold text-slate-900 dark:text-slate-100">{wr.title}</span></td>
                <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">{wr.serviceType}</span></td>
                <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{wr.assignedTeam}</td>
                <td className="py-2 px-3 text-slate-500">{wr.siteName}</td>
                <td className="py-2 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => cycleStatus(wr.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      wr.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      wr.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      wr.status === 'Dispatched' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {wr.status} ↻
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Site Inventory Resource Tracking */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs">
        <div className="bg-slate-100 text-slate-700 font-bold px-3 py-1.5 border-b border-slate-200 flex justify-between items-center text-[11px] uppercase tracking-wider">
          <span>Site Inventory Resource Tracking</span>
          <button type="button" onClick={() => onNavigateTab('store')} className="text-amber-800 hover:underline flex items-center gap-0.5 font-bold lowercase first-letter:uppercase">
            Store Requisitions <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <table className="w-full text-left min-w-[650px]">
          <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-200">
            <tr>
              <th className="py-1.5 px-3">Site</th>
              <th className="py-1.5 px-3">Item Requested</th>
              <th className="py-1.5 px-3">Requesting Employee</th>
              <th className="py-1.5 px-3">Low Stock</th>
              <th className="py-1.5 px-3">Issued Type</th>
              <th className="py-1.5 px-3">Returned</th>
              <th className="py-1.5 px-3 text-right">Damaged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {INVENTORY_TRACKERS.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/60">
                <td className="py-1.5 px-3 font-semibold text-slate-900">{t.siteName}</td>
                <td className="py-1.5 px-3 text-slate-700">{t.itemRequested}</td>
                <td className="py-1.5 px-3 text-slate-600">{t.requestingEmployee}</td>
                <td className="py-1.5 px-3">
                  <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                    t.lowStockStatus === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    t.lowStockStatus === 'Low' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.lowStockStatus}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-slate-600">{t.issuedType}</td>
                <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{t.returned}</td>
                <td className="py-1.5 px-3 text-right font-mono text-rose-700 font-bold">{t.damaged}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
