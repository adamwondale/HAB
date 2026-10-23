import React from 'react';

interface HabLogoProps {
  className?: string;
  variant?: 'icon' | 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 'w-5 h-5', text: 'text-xs', sub: 'text-[9px]' },
  sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[10px]' },
  md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-xs' },
  lg: { icon: 'w-12 h-12', text: 'text-lg', sub: 'text-xs' },
  xl: { icon: 'w-16 h-16', text: 'text-xl', sub: 'text-sm' }
};

export const HabMonogramIcon: React.FC<{ className?: string; forceBlack?: boolean }> = ({ 
  className = 'w-8 h-8',
  forceBlack = false
}) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`shrink-0 ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HAB Business PLC Logo"
    >
      {/* Yellow Inner Insets of H */}
      <path 
        d="M 54 20 L 92 20 L 92 70 C 92 88, 54 88, 54 70 Z" 
        fill="#FFDE00" 
      />
      <path 
        d="M 54 130 C 54 112, 92 112, 92 130 L 92 180 L 54 180 L 54 158 L 38 158 L 38 146 L 54 146 Z" 
        fill="#FFDE00" 
      />

      {/* Main HB Monogram Shape */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="
          M 20 20 L 54 20 L 54 70 C 54 88, 92 88, 92 70 L 92 20 L 146 20 C 168 20, 180 32, 180 58 C 180 76, 170 88, 154 96 C 172 104, 184 118, 184 142 C 184 168, 168 180, 146 180 L 20 180 L 20 20 Z
          
          M 54 130 C 54 112, 92 112, 92 130 L 92 180 L 54 180 L 54 158 L 38 158 L 38 146 L 54 146 L 54 130 Z
          
          M 120 44 L 140 44 C 150 44, 156 50, 156 58 C 156 66, 150 74, 140 74 L 120 74 Z
          
          M 120 124 L 142 124 C 154 124, 160 130, 160 142 C 160 154, 154 160, 142 160 L 120 160 Z
        " 
        className={forceBlack ? "fill-black" : "fill-slate-950 dark:fill-white transition-colors"}
      />
    </svg>
  );
};

export const HabLogo: React.FC<HabLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true
}) => {
  const currentSize = SIZE_MAP[size] || SIZE_MAP.md;

  if (variant === 'icon') {
    return <HabMonogramIcon className={`${currentSize.icon} ${className}`} />;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        <HabMonogramIcon className={currentSize.icon} forceBlack />
        <div>
          <div className="font-black text-black tracking-tight leading-tight">
            ሀብ ቢዝነስ ኃላ/የተ/የግል/ማህበር
          </div>
          <div className="text-sm font-black text-black tracking-wider uppercase mt-0.5">
            HAB BUSINESS PLC
          </div>
          {showSubtitle && (
            <div className="text-[10px] text-slate-700 font-semibold mt-0.5">
              Security & Cleaning Outsourcing ERP
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center shrink-0">
        <HabMonogramIcon className={currentSize.icon} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight ${currentSize.text}`}>
            HAB Business PLC
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800 shrink-0">
            HRM
          </span>
        </div>
        {showSubtitle && (
          <div className={`text-slate-500 dark:text-slate-400 font-medium truncate leading-tight mt-0.5 ${currentSize.sub}`}>
            ሀብ ቢዝነስ ኃ/የተ/የግል/ማህበር
          </div>
        )}
      </div>
    </div>
  );
};
