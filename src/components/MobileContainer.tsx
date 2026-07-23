import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileContainerProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  isMobileFrame,
  onToggleFrame,
}) => {
  if (!isMobileFrame) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-6 transition-all">
      {/* Mobile Frame Shell */}
      <div className="w-full max-w-md sm:max-w-[420px] bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-[38px] sm:rounded-[48px] shadow-2xl overflow-hidden relative my-auto flex flex-col max-h-[92vh] sm:max-h-[880px]">
        
        {/* Top Phone Notch / Dynamic Island */}
        <div className="bg-slate-900 pt-2 pb-1 px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800/60 z-40">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-950 rounded-full border border-slate-800 mx-auto" />
          <span className="flex items-center gap-1">5G 100%</span>
        </div>

        {/* Scrollable Frame Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="bg-slate-900 py-2.5 flex justify-center border-t border-slate-800/60 z-40">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>

      </div>
    </div>
  );
};
