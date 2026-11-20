import React, { useState } from 'react';
import { Employee, PayrollRecord, StockItem } from '../../../types/hrm';
import { Building2, Package, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

interface CeoDepartmentKpiCardsProps {
  employees: Employee[];
  payroll?: PayrollRecord[];
  stockItems?: StockItem[];
  onNavigateTab: (tabId: string) => void;
}

export const CeoDepartmentKpiCards: React.FC<CeoDepartmentKpiCardsProps> = ({
  employees,
  payroll = [],
  stockItems = [],
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'hr' | 'store' | 'finance'>('hr');

  const hrMetrics = [
    { label: '1. Total workforce', formula: 'Number of active employees', value: '250 employees', target: '250' },
    { label: '2. Workforce deployment', formula: 'Employees assigned ÷ total × 100', value: '95% deployed', target: '95%' },
    { label: '3. Attendance rate', formula: 'Present employee-days ÷ scheduled × 100', value: '96%', target: '96%' },
    { label: '4. Absenteeism rate', formula: 'Absent employee-days ÷ scheduled × 100', value: '4%', target: '4%' },
    { label: '5. Recruitment achievement', formula: 'Positions filled ÷ approved vacancies × 100', value: '85%', target: '85%' },
    { label: '6. Employee turnover', formula: 'Employees leaving ÷ avg workforce × 100', value: '3% monthly', target: '3%' },
    { label: '7. Payroll expenditure', formula: 'Total monthly salary and benefits', value: 'ETB 2,500,000', target: '2.5M' },
    { label: '8. Overtime expenditure', formula: 'Total overtime payment per month', value: 'ETB 85,000', target: '85k' },
    { label: '9. Training completion', formula: 'Employees trained ÷ employees planned × 100', value: '90%', target: '90%' },
    { label: '10. Contract compliance', formula: 'Valid contracts ÷ total employees × 100', value: '98%', target: '98%' },
    { label: '11. Performance appraisal', formula: 'Evaluated ÷ due for evaluation × 100', value: '92%', target: '92%' },
    { label: '12. Grievance resolution', formula: 'Resolved cases ÷ total reported × 100', value: '95%', target: '95%' }
  ];

  const storeMetrics = [
    { label: '1. Total inventory value', formula: 'Total value of available inventory', value: 'ETB 3,500,000', target: '3.5M' },
    { label: '2. Stock availability', formula: 'Available requested ÷ total requested × 100', value: '95%', target: '95%' },
    { label: '3. Stock-out rate', formula: 'Items unavailable ÷ total requested × 100', value: '5%', target: '5%' },
    { label: '4. Procurement expenditure', formula: 'Total monthly purchasing value', value: 'ETB 450,000', target: '450k' },
    { label: '5. Material consumption', formula: 'Total value of materials issued', value: 'ETB 380,000', target: '380k' },
    { label: '6. Purchase request fulfillment', formula: 'Fulfilled ÷ approved requests × 100', value: '94%', target: '94%' },
    { label: '7. Inventory accuracy', formula: 'Correctly counted ÷ items counted × 100', value: '98%', target: '98%' },
    { label: '8. Stock loss and damage', formula: 'Total value of lost/damaged materials', value: 'ETB 12,000', target: '12k' },
    { label: '9. Slow-moving inventory', formula: 'Value with no movement in period', value: 'ETB 150,000', target: '150k' },
    { label: '10. Supplier delivery performance', formula: 'On-time deliveries ÷ total × 100', value: '92%', target: '92%' },
    { label: '11. Stock issuance efficiency', formula: 'Issued within target time ÷ total × 100', value: '96%', target: '96%' },
    { label: '12. Inventory turnover', formula: 'Annualized consumed ÷ avg inventory', value: '3.5 times/yr', target: '3.5x' }
  ];

  const financeMetrics = [
    { label: '1. Total revenue', formula: 'Total revenue generated during month', value: 'ETB 8,000,000', target: '8.0M' },
    { label: '2. Operating expenses', formula: 'Total monthly operating expenditure', value: 'ETB 6,200,000', target: '6.2M' },
    { label: '3. Operating profit', formula: 'Operating revenue minus expenses', value: 'ETB 1,800,000', target: '1.8M' },
    { label: '4. Operating profit margin', formula: 'Operating profit ÷ revenue × 100', value: '22.5%', target: '22.5%' },
    { label: '5. Budget utilization', formula: 'Actual expenditure ÷ approved budget × 100', value: '92%', target: '92%' },
    { label: '6. Accounts receivable', formula: 'Outstanding client payments', value: 'ETB 2,000,000', target: '2.0M' },
    { label: '7. Collection efficiency', formula: 'Amount collected ÷ amount due × 100', value: '88%', target: '88%' },
    { label: '8. Accounts payable', formula: 'Outstanding supplier payments', value: 'ETB 850,000', target: '850k' },
    { label: '9. Invoice processing', formula: 'Invoices processed ÷ received × 100', value: '98%', target: '98%' },
    { label: '10. Payroll payment compliance', formula: 'Salaries on time ÷ total due × 100', value: '100%', target: '100%' },
    { label: '11. Cash flow', formula: 'Cash inflow minus outflow', value: 'ETB 750,000', target: '750k' },
    { label: '12. Financial reporting compliance', formula: 'Reports on time ÷ reports due × 100', value: '100%', target: '100%' }
  ];

  const currentMetrics = activeTab === 'hr' ? hrMetrics : activeTab === 'store' ? storeMetrics : financeMetrics;
  const currentTabModule = activeTab === 'hr' ? 'management' : activeTab === 'store' ? 'store' : 'payroll';

  return (
    <div className="rounded-xl border border-[#EFE7D8] bg-white p-5 dark:border-[#3D3633] dark:bg-[#24201E]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F5EFE3] pb-3 dark:border-[#3D3633] gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#4C4541] dark:text-white uppercase tracking-wider">
            Department Performance Measurement Matrix (36 KPIs)
          </h2>
          <p className="text-[11px] text-slate-500">
            Formulas, targets, and CEO benchmark values in Ethiopian Birr (ETB)
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#FCF0DA] p-1 rounded-lg border border-[#EFE7D8] dark:bg-slate-800 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('hr')}
            className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'hr' ? 'bg-[#F2C46A] text-[#4C4541] shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            HR (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'store' ? 'bg-[#F2C46A] text-[#4C4541] shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Store (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
              activeTab === 'finance' ? 'bg-[#F2C46A] text-[#4C4541] shadow-2xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Finance (12)
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {currentMetrics.map((kpi, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-[#F5EFE3] dark:border-[#3D3633] bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-[#4C4541] dark:text-white block truncate">
                {kpi.label}
              </span>
              <span className="text-[9.5px] text-slate-500 block mt-0.5 line-clamp-1">
                {kpi.formula}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
              <span className="text-xs font-mono font-bold text-[#4C4541] dark:text-emerald-400 tabular-nums">
                {kpi.value}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Benchmark: {kpi.target}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#F5EFE3] dark:border-[#3D3633] flex justify-end">
        <button
          type="button"
          onClick={() => onNavigateTab(currentTabModule)}
          className="text-xs font-bold text-amber-900 dark:text-[#F2C46A] hover:underline cursor-pointer"
        >
          View Full Department Module &rarr;
        </button>
      </div>
    </div>
  );
};
