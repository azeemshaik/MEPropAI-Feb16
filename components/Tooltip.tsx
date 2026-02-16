import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="group relative w-full">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-normal rounded-lg bg-slate-900/95 backdrop-blur px-3 py-2 text-xs font-medium text-slate-200 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 border border-white/10 w-max max-w-[240px] text-center z-[60] transform scale-95 group-hover:scale-100 origin-bottom">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[6px] border-transparent border-t-slate-900/95"></div>
      </div>
    </div>
  );
};

export default Tooltip;