import React, { useState } from 'react';
import { CurrencyPair, MarketTick, SignalData } from '../types';
import { formatPrice } from '../utils/marketEngine';
import { Activity, BarChart2, TrendingUp, Maximize2 } from 'lucide-react';

interface LiveChartProps {
  ticks: MarketTick[];
  pair: CurrencyPair;
  signal: SignalData | null;
  currentPrice: number;
}

export const LiveChart: React.FC<LiveChartProps> = ({
  ticks,
  pair,
  signal,
  currentPrice,
}) => {
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');

  if (!ticks || ticks.length === 0) return null;

  // Calculate min and max for auto-scaling chart canvas
  const allPrices = ticks.flatMap((t) => [t.high, t.low, t.open, t.close]);
  if (signal) {
    allPrices.push(signal.entryPrice);
    allPrices.push(signal.targetPrice);
  }
  allPrices.push(currentPrice);

  const minPrice = Math.min(...allPrices) * 0.9997;
  const maxPrice = Math.max(...allPrices) * 1.0003;
  const priceRange = Math.max(0.00001, maxPrice - minPrice);

  const width = 600;
  const height = 220;

  // Convert price to SVG Y coordinate
  const getY = (price: number) => {
    return height - ((price - minPrice) / priceRange) * (height - 30) - 15;
  };

  // Convert index to SVG X coordinate
  const getX = (index: number) => {
    return (index / (ticks.length - 1)) * (width - 40) + 20;
  };

  // Build SVG path string for line mode
  const points = ticks.map((t, idx) => `${getX(idx)},${getY(t.close)}`).join(' ');

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 shadow-xl backdrop-blur-md">
      {/* Chart Top Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-extrabold text-slate-200">Live Pocket Option Chart</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold">
            {pair.symbol}
          </span>
        </div>

        {/* Toggle Line vs Candle */}
        <div className="flex rounded-xl bg-slate-800/90 p-0.5 border border-slate-700/60">
          <button
            onClick={() => setChartType('candle')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              chartType === 'candle'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candles
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              chartType === 'line'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Area Line
          </button>
        </div>
      </div>

      {/* Responsive SVG Canvas Container */}
      <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-inner">
        
        {/* Background Grid Lines */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={height * ratio}
              x2={width}
              y2={height * ratio}
              className="stroke-slate-900"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Entry Price Dashed Line if signal active */}
          {signal && (
            <g>
              <line
                x1="0"
                y1={getY(signal.entryPrice)}
                x2={width}
                y2={getY(signal.entryPrice)}
                className="stroke-amber-400"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <rect
                x={width - 85}
                y={getY(signal.entryPrice) - 10}
                width="80"
                height="20"
                rx="4"
                className="fill-amber-500"
              />
              <text
                x={width - 45}
                y={getY(signal.entryPrice) + 4}
                textAnchor="middle"
                className="fill-slate-950 font-bold font-mono text-[10px]"
              >
                ENTRY {formatPrice(signal.entryPrice, pair.decimals)}
              </text>
            </g>
          )}

          {/* Render Area / Line Mode */}
          {chartType === 'line' ? (
            <>
              <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill="url(#areaGrad)"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            /* Render Candlesticks */
            ticks.map((t, idx) => {
              const x = getX(idx);
              const isGreen = t.close >= t.open;
              const candleWidth = Math.max(3, Math.min(10, width / ticks.length - 2));

              const topY = getY(Math.max(t.open, t.close));
              const bottomY = getY(Math.min(t.open, t.close));
              const bodyHeight = Math.max(2, bottomY - topY);

              const highY = getY(t.high);
              const lowY = getY(t.low);

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    className={isGreen ? 'stroke-emerald-400' : 'stroke-rose-500'}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={topY}
                    width={candleWidth}
                    height={bodyHeight}
                    rx="1"
                    className={isGreen ? 'fill-emerald-500' : 'fill-rose-500'}
                  />
                </g>
              );
            })
          )}

          {/* Current Live Tick Pulse Indicator */}
          {ticks.length > 0 && (
            <g>
              <line
                x1="0"
                y1={getY(currentPrice)}
                x2={width}
                y2={getY(currentPrice)}
                className={
                  signal
                    ? (signal.direction === 'CALL' ? currentPrice > signal.entryPrice : currentPrice < signal.entryPrice)
                      ? 'stroke-emerald-400'
                      : 'stroke-rose-400'
                    : 'stroke-cyan-400'
                }
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={width - 25}
                cy={getY(currentPrice)}
                r="5"
                className="fill-emerald-400 animate-ping opacity-75"
              />
              <circle
                cx={width - 25}
                cy={getY(currentPrice)}
                r="4"
                className="fill-emerald-400"
              />
            </g>
          )}
        </svg>

        {/* Live Price Tag Box overlay right corner */}
        <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 rounded-lg px-2 py-1 text-right backdrop-blur-sm">
          <div className="text-[9px] uppercase font-bold text-slate-400">Live Tick</div>
          <div className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
            {formatPrice(currentPrice, pair.decimals)}
          </div>
        </div>

      </div>
    </div>
  );
};
