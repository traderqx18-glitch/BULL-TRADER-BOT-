import React, { useState, useEffect } from 'react';
import { BullBearSentiment, SignalDirection } from '../types';
import { RefreshCw, Lock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BullBearCoinProps {
  sentiment: BullBearSentiment;
  activeDirection?: SignalDirection;
  isTradeRunning: boolean;
  onFlipCoin: () => void;
}

export const BullBearCoin: React.FC<BullBearCoinProps> = ({
  sentiment,
  activeDirection,
  isTradeRunning,
  onFlipCoin,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  // Trigger flip animation on signal change or when trade completes
  useEffect(() => {
    setIsFlipping(true);
    const t = setTimeout(() => setIsFlipping(false), 600);
    return () => clearTimeout(t);
  }, [activeDirection]);

  const handleCoinClick = () => {
    // Rule: Before time is up, if user clicks during trade, it should NOT flip!
    if (isTradeRunning) return;

    soundFx.playCoinFlip();
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      onFlipCoin();
    }, 600);
  };

  const isBull = activeDirection ? activeDirection === 'CALL' : sentiment.bullPower >= 50;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Glow Accent */}
      <div
        className={`absolute inset-0 opacity-15 blur-2xl pointer-events-none transition-colors duration-500 ${
          isBull ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div className="flex items-center justify-between w-full mb-1 px-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Market Sentiment Coin
        </span>
        <button
          onClick={handleCoinClick}
          disabled={isTradeRunning}
          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all ${
            isTradeRunning
              ? 'bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white active:scale-95'
          }`}
        >
          {isTradeRunning ? (
            <>
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Trade Running...</span>
            </>
          ) : (
            <>
              <RefreshCw className={`w-3 h-3 ${isFlipping ? 'animate-spin' : ''}`} />
              <span>Flip Coin</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Coin Visual & Power Indicator in One Compact Line */}
      <div className="flex items-center gap-4 py-1">
        
        {/* Interactive Coin */}
        <div
          onClick={handleCoinClick}
          className={`relative group flex-shrink-0 ${
            isTradeRunning ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
          }`}
          title={isTradeRunning ? 'Coin locked while trade is running' : 'Click to flip coin'}
        >
          <div
            className={`w-16 h-16 rounded-full p-1 transition-transform duration-700 shadow-xl relative ${
              isFlipping ? 'rotate-[720deg] scale-90' : isTradeRunning ? '' : 'hover:scale-105'
            } ${
              isBull
                ? 'bg-gradient-to-tr from-emerald-600 via-amber-400 to-emerald-400 shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-rose-600 via-amber-400 to-rose-400 shadow-rose-500/20'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center p-1 text-center shadow-inner relative overflow-hidden">
              {isBull ? (
                <>
                  <div className="text-xl filter drop-shadow">🐂</div>
                  <div className="text-[9px] font-black tracking-wider uppercase text-emerald-400 leading-none">
                    BULL
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl filter drop-shadow">🐻</div>
                  <div className="text-[9px] font-black tracking-wider uppercase text-rose-400 leading-none">
                    BEAR
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compact Sentiment Power Bar */}
        <div className="flex-1 space-y-1.5 min-w-[150px]">
          <div className="flex items-center justify-between text-[11px] font-extrabold">
            <span className="text-emerald-400">BULL {sentiment.bullPower}%</span>
            <span className="text-rose-400">BEAR {sentiment.bearPower}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full p-0.5 border border-slate-800 flex overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
              style={{ width: `${sentiment.bullPower}%` }}
            />
            <div
              className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
              style={{ width: `${sentiment.bearPower}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between font-medium">
            <span>Trend: <strong className={isBull ? 'text-emerald-400' : 'text-rose-400'}>{isBull ? 'BULLISH UP' : 'BEARISH DOWN'}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
