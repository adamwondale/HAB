import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export type ScorecardDepartment = 'hr' | 'store' | 'finance' | 'operations';

export interface ScorecardMetric {
  id: number;
  name: string;
  formula: string;
  target: string;
  current: string;
  variance: string;
  status: 'good' | 'warning' | 'critical';
}

const METRICS_DATA: Record<ScorecardDepartment, { title: string; benchmark: string; metrics: ScorecardMetric[] }> = {
  hr: {
    title: 'HR & Workforce Performance Scorecard',
    benchmark: 'Target: 250 Workforce | 96% Attendance',
    metrics: [
      { id: 1, name: 'Total workforce', formula: 'Active employee count', target: '250 employees', current: '250', variance: '0.0%', status: 'good' },
      { id: 2, name: 'Workforce deployment', formula: 'Assigned / Total employees', target: '95% deployed', current: '95.2%', variance: '+0.2%', status: 'good' },
      { id: 3, name: 'Attendance rate', formula: 'Present / Scheduled employee-days', target: '96%', current: '96.4%', variance: '+0.4%', status: 'good' },
      { id: 4, name: 'Absenteeism rate', formula: 'Absent / Scheduled employee-days', target: '4%', current: '3.6%', variance: '-0.4%', status: 'good' },
      { id: 5, name: 'Recruitment achievement', formula: 'Positions filled / Approved vacancies', target: '85%', current: '82.5%', variance: '-2.5%', status: 'warning' },
      { id: 6, name: 'Employee turnover', formula: 'Leaving / Average workforce', target: '3% monthly', current: '2.8%', variance: '-0.2%', status: 'good' },
      { id: 7, name: 'Payroll expenditure', formula: 'Monthly salary and benefits', target: 'ETB 2,500,000', current: 'ETB 2,480,000', variance: '-0.8%', status: 'good' },
      { id: 8, name: 'Overtime expenditure', formula: 'Total overtime payment', target: 'ETB 85,000', current: 'ETB 92,000', variance: '+8.2%', status: 'warning' },
      { id: 9, name: 'Training completion', formula: 'Trained / Planned employees', target: '90%', current: '91.0%', variance: '+1.0%', status: 'good' },
      { id: 10, name: 'Contract compliance', formula: 'Valid contracts / Total employees', target: '98%', current: '98.4%', variance: '+0.4%', status: 'good' },
      { id: 11, name: 'Performance appraisal', formula: 'Evaluated / Due for evaluation', target: '92%', current: '89.0%', variance: '-3.0%', status: 'warning' },
      { id: 12, name: 'Grievance resolution', formula: 'Resolved / Reported cases', target: '95%', current: '96.0%', variance: '+1.0%', status: 'good' }
    ]
  },
  store: {
    title: 'Store & Material Logistics Scorecard',
    benchmark: 'Target: ETB 3,500,000 Stock Value | 95% Availability',
    metrics: [
      { id: 1, name: 'Total inventory value', formula: 'Total value of available inventory', target: 'ETB 3,500,000', current: 'ETB 3,420,000', variance: '-2.3%', status: 'good' },
      { id: 2, name: 'Stock availability', formula: 'Available requested / Total requested', target: '95%', current: '94.2%', variance: '-0.8%', status: 'good' },
      { id: 3, name: 'Stock-out rate', formula: 'Unavailable / Total requested', target: '5%', current: '5.8%', variance: '+0.8%', status: 'warning' },
      { id: 4, name: 'Procurement expenditure', formula: 'Monthly purchasing value', target: 'ETB 450,000', current: 'ETB 440,000', variance: '-2.2%', status: 'good' },
      { id: 5, name: 'Material consumption', formula: 'Value of materials issued', target: 'ETB 380,000', current: 'ETB 375,000', variance: '-1.3%', status: 'good' },
      { id: 6, name: 'Purchase request fulfillment', formula: 'Fulfilled / Approved requests', target: '94%', current: '95.0%', variance: '+1.0%', status: 'good' },
      { id: 7, name: 'Inventory accuracy', formula: 'Correctly counted / Items counted', target: '98%', current: '97.5%', variance: '-0.5%', status: 'good' },
      { id: 8, name: 'Stock loss and damage', formula: 'Lost / Damaged materials', target: 'ETB 12,000', current: 'ETB 14,500', variance: '+20.8%', status: 'warning' },
      { id: 9, name: 'Slow-moving inventory', formula: 'No movement within defined period', target: 'ETB 150,000', current: 'ETB 162,000', variance: '+8.0%', status: 'warning' },
      { id: 10, name: 'Supplier delivery performance', formula: 'On-time / Total deliveries', target: '92%', current: '93.5%', variance: '+1.5%', status: 'good' },
      { id: 11, name: 'Stock issuance efficiency', formula: 'Issued in target time / Total requests', target: '96%', current: '96.8%', variance: '+0.8%', status: 'good' },
      { id: 12, name: 'Inventory turnover', formula: 'Annualized materials cost / Avg inventory', target: '3.5 times/yr', current: '3.4 times/yr', variance: '-2.8%', status: 'good' }
    ]
  },
  finance: {
    title: 'Finance & Fiscal Performance Scorecard',
    benchmark: 'Target: ETB 8,000,000 Revenue | 22.5% Margin',
    metrics: [
      { id: 1, name: 'Total revenue', formula: 'Monthly revenue generated', target: 'ETB 8,000,000', current: 'ETB 8,150,000', variance: '+1.9%', status: 'good' },
      { id: 2, name: 'Operating expenses', formula: 'Monthly operating expenditure', target: 'ETB 6,200,000', current: 'ETB 6,180,000', variance: '-0.3%', status: 'good' },
      { id: 3, name: 'Operating profit', formula: 'Revenue minus operating expenses', target: 'ETB 1,800,000', current: 'ETB 1,970,000', variance: '+9.4%', status: 'good' },
      { id: 4, name: 'Operating profit margin', formula: 'Operating profit / Revenue', target: '22.5%', current: '24.2%', variance: '+1.7%', status: 'good' },
      { id: 5, name: 'Budget utilization', formula: 'Actual expenditure / Approved budget', target: '92%', current: '91.5%', variance: '-0.5%', status: 'good' },
      { id: 6, name: 'Accounts receivable', formula: 'Outstanding client payments', target: 'ETB 2,000,000', current: 'ETB 2,180,000', variance: '+9.0%', status: 'warning' },
      { id: 7, name: 'Collection efficiency', formula: 'Amount collected / Amount due', target: '88%', current: '89.5%', variance: '+1.5%', status: 'good' },
      { id: 8, name: 'Accounts payable', formula: 'Outstanding supplier payments', target: 'ETB 850,000', current: 'ETB 820,000', variance: '-3.5%', status: 'good' },
      { id: 9, name: 'Invoice processing', formula: 'Processed / Received invoices', target: '98%', current: '98.6%', variance: '+0.6%', status: 'good' },
      { id: 10, name: 'Payroll payment compliance', formula: 'Paid on time / Total salaries due', target: '100%', current: '100%', variance: '0.0%', status: 'good' },
      { id: 11, name: 'Cash flow', formula: 'Cash inflow minus cash outflow', target: 'ETB 750,000', current: 'ETB 790,000', variance: '+5.3%', status: 'good' },
      { id: 12, name: 'Financial reporting compliance', formula: 'Submitted on time / Due reports', target: '100%', current: '100%', variance: '0.0%', status: 'good' }
    ]
  },
  operations: {
    title: 'Operations & Site Dispatch Scorecard',
    benchmark: 'Target: 15 Client Sites | 95% Deployment',
    metrics: [
      { id: 1, name: 'Active client sites', formula: 'Operational contract posts', target: '15 sites', current: '14 sites', variance: '-1 site', status: 'warning' },
      { id: 2, name: 'Guard & crew deployment', formula: 'Assigned / Total deployment', target: '95%', current: '95.2%', variance: '+0.2%', status: 'good' },
      { id: 3, name: 'Shift coverage rate', formula: 'Staffed shifts / Scheduled shifts', target: '98%', current: '97.8%', variance: '-0.2%', status: 'good' },
      { id: 4, name: 'Incident response time', formula: 'Average emergency response', target: '< 15 min', current: '12.4 min', variance: '-17.3%', status: 'good' },
      { id: 5, name: 'Incident resolution rate', formula: 'Resolved / Reported incidents', target: '95%', current: '94.0%', variance: '-1.0%', status: 'good' },
      { id: 6, name: 'Site inspection rate', formula: 'Inspected / Scheduled posts', target: '90%', current: '92.0%', variance: '+2.0%', status: 'good' },
      { id: 7, name: 'Uniform & gear compliance', formula: 'Compliant staff / Deployed staff', target: '98%', current: '98.5%', variance: '+0.5%', status: 'good' },
      { id: 8, name: 'Client satisfaction score', formula: 'Periodic operational review', target: '88%', current: '89.2%', variance: '+1.2%', status: 'good' },
      { id: 9, name: 'Checkpoint patrol uptime', formula: 'Logged scans / Required scans', target: '95%', current: '96.1%', variance: '+1.1%', status: 'good' },
      { id: 10, name: 'Emergency drills conducted', formula: 'Drills executed / Planned quarterly', target: '100%', current: '100%', variance: '0.0%', status: 'good' },
      { id: 11, name: 'Dispatch radio uptime', formula: 'Field comms availability', target: '99%', current: '99.4%', variance: '+0.4%', status: 'good' },
      { id: 12, name: 'Operational overtime ratio', formula: 'Overtime / Standard duty hours', target: '< 8%', current: '7.2%', variance: '-0.8%', status: 'good' }
    ]
  }
};

interface ExecutiveScorecardDrawerProps {
  isOpen: boolean;
  department: ScorecardDepartment;
  onClose: () => void;
  onSelectDepartment?: (dept: ScorecardDepartment) => void;
}

export const ExecutiveScorecardDrawer: React.FC<ExecutiveScorecardDrawerProps> = ({
  isOpen,
  department,
  onClose,
  onSelectDepartment
}) => {
  const [activeDept, setActiveDept] = useState<ScorecardDepartment>(department);

  React.useEffect(() => {
    setActiveDept(department);
  }, [department]);

  if (!isOpen) return null;

  const currentConfig = METRICS_DATA[activeDept] || METRICS_DATA.hr;
  const handleDeptChange = (dept: ScorecardDepartment) => {
    setActiveDept(dept);
    onSelectDepartment?.(dept);
  };

  const getStatusBadge = (status: ScorecardMetric['status'], variance: string) => {
    const tone =
      status === 'good'
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200'
        : status === 'warning'
        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200'
        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200';
    const Icon = status === 'good' ? CheckCircle2 : status === 'warning' ? AlertTriangle : AlertCircle;
    const label = status === 'good' ? 'Optimal' : status === 'warning' ? 'Attention' : 'Critical';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tone}`}>
        <Icon className="w-3 h-3" />
        <span>{variance} ({label})</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose}>
      <aside
        className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-slate-100">{currentConfig.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{currentConfig.benchmark}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
          {(['hr', 'store', 'finance', 'operations'] as ScorecardDepartment[]).map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => handleDeptChange(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                activeDept === dept
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {dept} (12 KPIs)
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Performance Parameter</th>
                  <th className="py-2.5 px-3">Calculation Formula</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Current</th>
                  <th className="py-2.5 px-3 text-right">Variance / Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {currentConfig.metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-400">{m.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{m.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{m.formula}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{m.target}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{m.current}</td>
                    <td className="py-2.5 px-3 text-right">{getStatusBadge(m.status, m.variance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Benchmark targets calibrated for active fiscal period.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 cursor-pointer transition-colors"
          >
            Close Scorecard
          </button>
        </div>
      </aside>
    </div>
  );
};
