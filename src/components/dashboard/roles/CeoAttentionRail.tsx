import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface AttentionItem {
  label: string;
  count: number;
  tab: string;
  action: string;
  urgency: 'high' | 'medium' | 'normal';
}

const ATTENTION_ITEMS: AttentionItem[] = [
  { label: 'Contract renewal time', count: 3, tab: 'divisions', action: 'Review', urgency: 'high' },
  { label: 'Onboarding employees', count: 2, tab: 'onboarding', action: 'Track', urgency: 'normal' },
  { label: 'Leave request', count: 4, tab: 'leave', action: 'Approve', urgency: 'medium' },
  { label: 'Department needs requirement', count: 1, tab: 'management', action: 'Inspect', urgency: 'high' },
  { label: 'Status of sites / property', count: 2, tab: 'deployment', action: 'Check', urgency: 'normal' }
];

interface CeoAttentionRailProps {
  onNavigateTab: (tabId: string) => void;
}

export const CeoAttentionRail: React.FC<CeoAttentionRailProps> = ({ onNavigateTab }) => {
  return (
    <div className="rounded-xl border border-[#EFE7D8] bg-white p-5 dark:border-[#3D3633] dark:bg-[#24201E]">
      <div className="flex items-center justify-between border-b border-[#F5EFE3] pb-3 dark:border-[#3D3633]">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-semibold text-[#4C4541] dark:text-white">
            Need Attention
          </h2>
        </div>
        <span className="text-[10px] text-[#8C847E] dark:text-[#68615C]">
          Touchable &mdash; provides details
        </span>
      </div>
      <div className="mt-3 divide-y divide-[#F5EFE3] dark:divide-[#3D3633]">
        {ATTENTION_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => onNavigateTab(item.tab)}
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-[#F7F4EE] dark:hover:bg-[#2C2724] transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.urgency === 'high'
                    ? 'bg-rose-500'
                    : item.urgency === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <div>
                <div className="text-xs font-semibold text-[#4C4541] dark:text-white">{item.label}</div>
                <div className="text-[10px] text-[#68615C] dark:text-[#8C847E]">{item.count} items pending</div>
              </div>
            </div>
            <button
              type="button"
              className="text-[10px] font-bold text-[#4C4541] dark:text-[#F2C46A] hover:underline flex items-center gap-0.5"
            >
              {item.action} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
