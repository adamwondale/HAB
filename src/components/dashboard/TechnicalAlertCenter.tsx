import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Clock } from 'lucide-react';

interface AlertItem {
  id: string;
  label: string;
  meta: string;
  time: string;
}

const URGENT_ALERTS: AlertItem[] = [
  { id: 'ua-1', label: 'Bole Medhanialem: Water Booster Pump Breakdown', meta: 'Pressure dropped to 0.4 bar; maintenance crew dispatched', time: '12m ago' },
  { id: 'ua-2', label: 'Kazanchis Center: Generator AVR Voltage Surge Alert', meta: 'Emergency standby power transfer tripped during grid outage', time: '35m ago' }
];

const PENDING_ALERTS: AlertItem[] = [
  { id: 'pa-1', label: 'Store Requisition #SR-402 (12 Radios & Torches)', meta: 'Pending Store Keeper physical handover for Bole site', time: '1h ago' },
  { id: 'pa-2', label: 'Quarterly Preventive Servicing due in 2 days', meta: 'HVAC filtration and chiller maintenance across 3 branch hubs', time: '3h ago' }
];

export const TechnicalAlertCenter: React.FC = () => {
  const [alertTab, setAlertTab] = useState<'all' | 'urgent' | 'pending'>('all');

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#F2C46A]" />
          <span className="text-xs font-bold text-[#4C4541] dark:text-slate-200 uppercase tracking-wide">
            Technical Alert Center
          </span>
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
          {(['all', 'urgent', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setAlertTab(tab)}
              className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer ${
                alertTab === tab ? 'bg-[#F2C46A] text-[#4C4541] font-bold' : 'text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {(alertTab === 'all' || alertTab === 'urgent') && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Urgent Technical Alerts
            </span>
            {URGENT_ALERTS.map((a) => (
              <div key={a.id} className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 flex justify-between items-start">
                <div>
                  <p className="font-bold text-[11px]">{a.label}</p>
                  <p className="text-[10px] text-rose-700">{a.meta}</p>
                </div>
                <span className="text-[10px] font-mono text-rose-600 shrink-0 ml-1">{a.time}</span>
              </div>
            ))}
          </div>
        )}
        {(alertTab === 'all' || alertTab === 'pending') && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending & Scheduled Work
            </span>
            {PENDING_ALERTS.map((a) => (
              <div key={a.id} className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex justify-between items-start">
                <div>
                  <p className="font-bold text-[11px]">{a.label}</p>
                  <p className="text-[10px] text-amber-700">{a.meta}</p>
                </div>
                <span className="text-[10px] font-mono text-amber-600 shrink-0 ml-1">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
