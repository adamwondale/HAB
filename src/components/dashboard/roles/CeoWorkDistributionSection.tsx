import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export interface WorkDistributionItem {
  name: string;
  value: number;
  color: string;
}

const WORK_DISTRIBUTION: WorkDistributionItem[] = [
  { name: 'Security', value: 360, color: '#4C4541' },
  { name: 'Cleaning', value: 168, color: '#AEAC78' },
  { name: 'Property Management', value: 60, color: '#F2C46A' },
  { name: 'Head Office Staff', value: 12, color: '#FCF0DA' }
];

interface CeoWorkDistributionSectionProps {
  onNavigateTab: (tabId: string) => void;
}

export const CeoWorkDistributionSection: React.FC<CeoWorkDistributionSectionProps> = ({
  onNavigateTab
}) => {
  return (
    <div className="rounded-xl border border-[#EFE7D8] bg-white p-5 dark:border-[#3D3633] dark:bg-[#24201E] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[#F5EFE3] pb-3 dark:border-[#3D3633]">
        <h2 className="text-sm font-semibold text-[#4C4541] dark:text-white">
          Work Distribution
        </h2>
        <span className="text-[10px] text-[#8C847E] dark:text-[#68615C]">
          Clickable segments &mdash; drill down
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <PieChart width={280} height={220}>
          <Pie
            data={WORK_DISTRIBUTION}
            dataKey="value"
            nameKey="name"
            cx={140}
            cy={110}
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            fill="#8884d8"
          >
            {WORK_DISTRIBUTION.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {WORK_DISTRIBUTION.map((d) => (
          <div
            key={d.name}
            onClick={() => onNavigateTab('divisions')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F5EFE3] bg-[#F7F4EE] hover:bg-[#F5E6CA] cursor-pointer transition-colors dark:border-[#3D3633] dark:bg-[#2C2724] dark:hover:bg-[#3D3633]"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs font-medium text-[#4C4541] dark:text-[#F7F4EE] truncate">{d.name}</span>
            <span className="ml-auto text-[10px] font-mono font-bold text-[#4C4541] dark:text-white tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
