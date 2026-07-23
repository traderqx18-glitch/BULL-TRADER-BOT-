import React from 'react';
import { SignalData, SignalStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface SignalCardProps {
  signal: SignalData | null;
  remainingSeconds: number;
  status: SignalStatus;
  autoNextSignal: boolean;
  onToggleAutoNext: () => void;
  onRequestNextSignal: () => void;
  lastResult?: { result: 'WIN' | 'LOSS' | 'REFUND'; profit: number } | null;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  remainingSeconds,
  status,
  autoNextSignal,
  onRequestNextSignal,
  lastResult,
}) => {
  // Idle / Scanning state
  if (!signal || status === 'SCANNING') {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="py-2">
          <h3 className="font-extrabold text-slate-100 text-sm sm:text-base">
            {status === 'SCANNING' ? 'Scanning Quotex Market...' : 'Bull Trader LLC Bot Ready'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">
            {status === 'SCANNING'
              ? 'Calculating RSI, Bollinger & Momentum...'
              : 'Click below to generate high-accuracy trading signal.'}
          </p>

          <button
            onClick={onRequestNextSignal}
            disabled={status === 'SCANNING'}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            {status === 'SCANNING' ? 'Scanning...' : 'Get Signal'}
          </button>
        </div>
      </div>
    );
  }

  const isCall = signal.direction === 'CALL';
  const totalSeconds = signal.timeframe.seconds;
  const progressPercent = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100));

  return (
    <div
      className={`relative rounded-2xl p-3.5 border shadow-xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isCall
          ? 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-500/10'
          : 'bg-slate-900/95 border-rose-500/40 shadow-rose-500/10'
      }`}
    >
      {/* Top Bar: Pair Name & Timeframe */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <span>{signal.pair.symbol}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-mono">{signal.timeframe.badge || `${signal.timeframe.seconds}s`}</span>
        </div>

        <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
          Accuracy {signal.confidence}%
        </div>
      </div>

      {/* Main Signal Display */}
      <div className="flex items-center justify-between gap-2 my-2.5">
        
        {/* Direction Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
              isCall
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-rose-500 text-slate-950 shadow-rose-500/30'
            }`}
          >
            {isCall ? (
              <ArrowUpRight className="w-6 h-6 stroke-[3]" />
            ) : (
              <ArrowDownRight className="w-6 h-6 stroke-[3]" />
            )}
          </div>

          <div>
            <div className="text-lg font-black tracking-tight uppercase">
              {isCall ? (
                <span className="text-emerald-400">CALL / UP 🐂</span>
              ) : (
                <span className="text-rose-400">PUT / DOWN 🐻</span>
              )}
            </div>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={`transition-all duration-1000 ${
                isCall ? 'stroke-emerald-400' : 'stroke-rose-400'
              }`}
              strokeWidth="10"
              strokeDasharray={251}
              strokeDashoffset={251 - (251 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-slate-100">
            {remainingSeconds}s
          </div>
        </div>

      </div>

      {/* Next Signal Action Button */}
      <div className="pt-1 space-y-1.5">
        {(!autoNextSignal || remainingSeconds <= 0) && (
          <button
            onClick={onRequestNextSignal}
            disabled={status === 'SCANNING' || remainingSeconds > 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            {remainingSeconds > 0 ? `Trade Active (${remainingSeconds}s)` : 'Get Next Signal'}
          </button>
        )}
      </div>

      {/* Finished Result Notification */}
      {lastResult && (
        <div className="mt-2 p-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 flex items-center justify-center gap-1.5 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>The trade is finished.</span>
        </div>
      )}

    </div>
  );
};
