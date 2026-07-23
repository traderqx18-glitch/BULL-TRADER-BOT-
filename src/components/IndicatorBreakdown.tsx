import React from 'react';
import { TechnicalIndicators } from '../types';
import { Gauge, TrendingUp, TrendingDown, Layers, Zap, Sliders } from 'lucide-react';

interface IndicatorBreakdownProps {
  indicators: TechnicalIndicators;
}

export const IndicatorBreakdown: React.FC<IndicatorBreakdownProps> = ({ indicators }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
            Technical Indicator Matrix
          </h3>
        </div>
        <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
          Score: {indicators.overallScore}/100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        
        {/* RSI Meter */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-slate-400">RSI (14)</span>
            <span
              className={`font-mono font-bold ${
                indicators.rsi < 35
                  ? 'text-emerald-400'
                  : indicators.rsi > 65
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {indicators.rsi}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                indicators.rsi < 35
                  ? 'bg-emerald-400'
                  : indicators.rsi > 65
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${indicators.rsi}%` }}
            />
          </div>
          <div className="text-[9px] text-slate-500 mt-1">
            {indicators.rsi < 35 ? 'Oversold (Buy)' : indicators.rsi > 65 ? 'Overbought (Sell)' : 'Neutral Momentum'}
          </div>
        </div>

        {/* EMA 9 / 21 Crossover */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="text-[11px] font-bold text-slate-400 mb-1">EMA 9/21 Cross</div>
          <div className="flex items-center gap-1">
            <span
              className={`font-extrabold text-xs px-2 py-0.5 rounded-lg uppercase ${
                indicators.emaCross === 'BULLISH'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : indicators.emaCross === 'BEARISH'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {indicators.emaCross}
            </span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Trend Direction</div>
        </div>

        {/* SuperTrend Status */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="text-[11px] font-bold text-slate-400 mb-1">SuperTrend AI</div>
          <div className="flex items-center gap-1">
            <span
              className={`font-black text-xs px-2.5 py-0.5 rounded-lg uppercase flex items-center gap-1 ${
                indicators.superTrend === 'BUY'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-rose-500 text-slate-950'
              }`}
            >
              {indicators.superTrend === 'BUY' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {indicators.superTrend}
            </span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1">Confirmed Direction</div>
        </div>

        {/* MACD Histogram */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-slate-400">MACD Hist</span>
            <span
              className={`font-mono text-[10px] font-bold ${
                indicators.macd.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {indicators.macd.histogram > 0 ? `+${indicators.macd.histogram}` : indicators.macd.histogram}
            </span>
          </div>
          <div className="text-[9px] text-slate-500">Convergence</div>
        </div>

        {/* Stochastic Oscillator */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="text-[11px] font-bold text-slate-400 mb-1">Stochastic %K/%D</div>
          <div className="font-mono text-xs font-bold text-slate-200">
            {indicators.stochastic.k} / {indicators.stochastic.d}
          </div>
          <div className="text-[9px] text-slate-500">Oscillator Momentum</div>
        </div>

        {/* Bollinger Bands */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
          <div className="text-[11px] font-bold text-slate-400 mb-1">Bollinger Bands</div>
          <div className="text-[11px] font-extrabold text-amber-300 truncate">
            {indicators.bollingerBands.replace('_', ' ')}
          </div>
          <div className="text-[9px] text-slate-500">Volatility Envelope</div>
        </div>

      </div>
    </div>
  );
};
