import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Employee, ServiceType } from '../types/hrm';
import { Division } from '../types/division';

interface WorkforceDistributionChartProps {
  employees: Employee[];
  divisions?: Division[];
}

interface DivisionSlice {
  name: string;
  displayName: string;
  count: number;
  percentage: number;
  color: string;
}

const COLOR_PALETTE = ['#1E293B', '#059669', '#D97706', '#64748B', '#F2C46A', '#AEAC78', '#8B5CF6', '#0284C7'];

const DIVISION_CONFIG: Array<{ key: string; label: string; color: string }> = [
  { key: 'Security', label: 'Security', color: '#1E293B' },
  { key: 'Cleaning', label: 'Cleaning', color: '#059669' },
  { key: 'Property Management', label: 'Property Mgmt', color: '#D97706' },
  { key: 'Head Office Staff', label: 'Head Office', color: '#64748B' }
];

interface TooltipPayloadItem {
  payload: DivisionSlice;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-950 dark:text-white">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </div>
        <div className="mt-1 font-mono text-slate-600 dark:text-slate-300">
          {data.count} {data.count === 1 ? 'staff' : 'staff'} ({data.percentage}%)
        </div>
      </div>
    );
  }
  return null;
};

export const WorkforceDistributionChart: React.FC<WorkforceDistributionChartProps> = ({ employees, divisions }) => {
  const total = employees.length;

  const activeConfigs = divisions && divisions.length > 0
    ? divisions.map((d, idx) => ({
        key: d.name,
        label: d.name,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
      }))
    : DIVISION_CONFIG;

  const distribution: DivisionSlice[] = activeConfigs.map(({ key, label, color }) => {
    const count = employees.filter((e) => e.serviceType === key).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name: key,
      displayName: label,
      count,
      percentage,
      color
    };
  });

  const chartData = distribution.filter((d) => d.count > 0);

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Workforce Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">By operational division</p>
        </div>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {total} Total
        </span>
      </div>

      <div className="relative my-2 flex h-44 items-center justify-center">
        {total === 0 ? (
          <div className="text-xs text-slate-400">No active employees recorded</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {total}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Staff
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        {distribution.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate text-slate-600 dark:text-slate-300">{item.displayName}</span>
            </div>
            <span className="ml-1 shrink-0 font-mono font-semibold text-slate-900 dark:text-white">
              {item.count} <span className="text-[10px] font-normal text-slate-400">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
