import React, { useState } from 'react';
import { TimeframeConfig } from '../types';
import { TIMEFRAMES } from '../data/pairs';
import { Clock, ChevronDown, Check, Sparkles } from 'lucide-react';

interface TimeframeSelectorProps {
  selectedTimeframe: TimeframeConfig;
  onSelectTimeframe: (timeframe: TimeframeConfig) => void;
  disabled?: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onSelectTimeframe,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl px-3 py-2 flex items-center justify-between shadow-lg backdrop-blur-md transition-all active:scale-[0.99] disabled:opacity-75"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="text-left truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Timeframe:</span>
              <span className="font-extrabold text-slate-100 text-sm tracking-tight">
                {selectedTimeframe.seconds >= 60
                  ? `${selectedTimeframe.seconds / 60}m`
                  : `${selectedTimeframe.seconds}s`} ({selectedTimeframe.badge || `${selectedTimeframe.seconds}s`})
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Icon */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="p-1 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Modal / Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div>
                <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Select Timeframe
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* List of Timeframe Options */}
            <div className="p-2.5 space-y-1.5 overflow-y-auto">
              {TIMEFRAMES.map((tf) => {
                const isSelected = selectedTimeframe.id === tf.id;
                return (
                  <button
                    key={tf.id}
                    onClick={() => {
                      onSelectTimeframe(tf);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-md'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-xs text-emerald-400">
                        {tf.label}
                      </div>
                      <div className="font-extrabold text-xs text-slate-100 flex items-center gap-2">
                        <span>{tf.badge || `${tf.seconds}s`}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
