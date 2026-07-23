import React, { useState } from 'react';
import { CurrencyPair, TimeframeConfig, TechnicalIndicators } from '../types';
import { Sparkles, Bot, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import botAvatarImg from '../assets/images/zohaib_bot_avatar_1784840026900.jpg';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: CurrencyPair;
  timeframe: TimeframeConfig;
  currentPrice: number;
  indicators: TechnicalIndicators;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  pair,
  timeframe,
  currentPrice,
  indicators,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunAiAnalysis = async () => {
    setLoading(true);
    // Simulate AI deep research scan by Zohaib Naqvi Bot
    setTimeout(() => {
      const direction = indicators.rsi < 50 ? 'CALL (BULLISH)' : 'PUT (BEARISH)';
      const report = `Zohaib Naqvi AI Bot Deep Scan Report for ${pair.symbol}:
      
• Primary Trend: ${indicators.emaCross} momentum detected on Pocket Option ${timeframe.label} timeframe.
• RSI Indicator: Currently at ${indicators.rsi}, indicating ${
        indicators.rsi < 35 ? 'extreme oversold conditions (High probability rebound)' : 'strong seller exhaustion'
      }.
• Order Flow Analysis: Algorithmic liquidity sweep identified near ${currentPrice}. Institutional buyer confidence rated at ${
        indicators.overallScore
      }%.
• Strategic Recommendation: Highly recommended ${direction} signal with tight ${timeframe.label} expiry window.`;
      
      setAiReport(report);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={botAvatarImg}
              alt="Zohaib Naqvi Bot"
              className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-1.5 text-slate-100">
                Zohaib Naqvi AI Intelligence
              </h3>
              <p className="text-xs text-slate-400">Deep Neural Market Scanner for Pocket Option</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 my-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Selected Asset:</span>
              <span className="font-bold text-emerald-400 ml-1.5">{pair.symbol}</span>
            </div>
            <div>
              <span className="text-slate-400">Timeframe:</span>
              <span className="font-bold text-amber-300 ml-1.5">{timeframe.label}</span>
            </div>
          </div>

          {!aiReport ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Click below to trigger Zohaib Naqvi Bot's deep AI neural network scan for real-time order blocks, RSI divergence, and momentum probability.
              </p>
              <button
                onClick={handleRunAiAnalysis}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning Market Neural Network...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    Run AI Deep Analysis
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2 whitespace-pre-line text-slate-200 leading-relaxed font-sans">
              {aiReport}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            Close Insight
          </button>
        </div>

      </div>
    </div>
  );
};
