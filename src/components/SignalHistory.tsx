import React from 'react';
import { SignalHistoryItem, BotStats } from '../types';
import { formatPrice } from '../utils/marketEngine';
import { History, CheckCircle2, XCircle, RefreshCw, Trophy, Flame, Zap } from 'lucide-react';

interface SignalHistoryProps {
  history: SignalHistoryItem[];
  stats: BotStats;
  onClearHistory: () => void;
}

export const SignalHistory: React.FC<SignalHistoryProps> = ({
  history,
  stats,
  onClearHistory,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      
      {/* Header & Stats Banner */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
            Concluded Signals History
          </h3>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
          <div className="text-[10px] uppercase text-slate-400 font-semibold">Total Signals</div>
          <div className="font-extrabold text-slate-100 text-base">{stats.totalSignals}</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
          <div className="text-[10px] uppercase text-slate-400 font-semibold">Bot Accuracy</div>
          <div className="font-extrabold text-emerald-400 text-base">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
          <div className="text-[10px] uppercase text-slate-400 font-semibold flex items-center justify-center gap-0.5">
            <Flame className="w-3 h-3 text-amber-400" /> Win Streak
          </div>
          <div className="font-extrabold text-amber-300 text-base">{stats.streak} 🔥</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No concluded signals yet. Active signals will log here automatically!
          </div>
        ) : (
          history.map((item) => {
            const isWin = item.result === 'WIN';
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  isWin
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isWin ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-slate-950'
                    }`}
                  >
                    {isWin ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>

                  <div className="truncate">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{item.pairSymbol}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                          item.direction === 'CALL'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {item.direction}
                      </span>
                      <span className="text-[10px] text-slate-400">({item.timeframeLabel})</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Entry: {item.entryPrice} → Close: {item.closePrice}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div
                    className={`font-black text-xs uppercase ${
                      isWin ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isWin ? `+$${item.payoutAmount.toFixed(2)}` : '$0.00'}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
