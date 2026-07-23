import React, { useState, useEffect, useRef } from 'react';
import {
  CurrencyPair,
  TimeframeConfig,
  SignalData,
  SignalStatus,
  BotStats,
} from './types';
import { ALL_PAIRS, TIMEFRAMES } from './data/pairs';
import {
  generateBotSignal,
  evaluateSignalResult,
  calculateTechnicalIndicators,
  calculateBullBearSentiment,
  getNextTickPrice,
} from './utils/marketEngine';
import { soundFx } from './utils/audio';

import { Header } from './components/Header';
import { PairSelector } from './components/PairSelector';
import { TimeframeSelector } from './components/TimeframeSelector';
import { BullBearCoin } from './components/BullBearCoin';
import { SignalCard } from './components/SignalCard';
import { TelegramModal } from './components/TelegramModal';
import { MobileContainer } from './components/MobileContainer';

export default function App() {
  // Telegram Modal State (opens on entry as requested)
  const [isTelegramOpen, setIsTelegramOpen] = useState<boolean>(true);

  // Core State
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(ALL_PAIRS[0]); // AUD/CAD OTC
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeConfig>(TIMEFRAMES[2]); // 20s default
  const [currentPrice, setCurrentPrice] = useState<number>(ALL_PAIRS[0].basePrice);

  const [activeSignal, setActiveSignal] = useState<SignalData | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [status, setStatus] = useState<SignalStatus>('IDLE');
  const [autoNextSignal, setAutoNextSignal] = useState<boolean>(false);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const [lastResult, setLastResult] = useState<{ result: 'WIN' | 'LOSS' | 'REFUND'; profit: number } | null>(null);
  
  // Ref to always hold current price without causing timer re-renders
  const currentPriceRef = useRef<number>(currentPrice);
  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  // Non-negative stats enforcement
  const [stats, setStats] = useState<BotStats>({
    totalSignals: 0,
    wins: 0,
    losses: 0,
    winRate: 92.0,
    todayProfitPoints: 380.0,
    streak: 3,
  });

  const tickRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Reset price on pair change
  useEffect(() => {
    setCurrentPrice(selectedPair.basePrice);
    setLastResult(null);
  }, [selectedPair]);

  // Handle timeframe change
  const handleTimeframeChange = (tf: TimeframeConfig) => {
    setSelectedTimeframe(tf);
  };

  // Generate Signal function with loading scanning state
  const handleRequestSignal = () => {
    if (status === 'SCANNING' || remainingSeconds > 0) return;
    
    soundFx.playCoinFlip();
    setStatus('SCANNING');
    setLastResult(null);

    // Simulated market scan loading delay
    setTimeout(() => {
      const newSig = generateBotSignal(selectedPair, selectedTimeframe, currentPriceRef.current, true);
      setActiveSignal(newSig);
      setRemainingSeconds(selectedTimeframe.seconds);
      setStatus('ACTIVE');

      soundFx.playSignalAlert(newSig.direction);
    }, 700);
  };

  // 1. Live Market Tick Interval Generator
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setCurrentPrice((prev) => getNextTickPrice(prev, selectedPair));
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [selectedPair]);

  // Handle Signal Conclusion & Results Calculation
  const handleSignalConclusion = () => {
    if (!activeSignal) return;

    const res = evaluateSignalResult(activeSignal, currentPriceRef.current);
    const payout = res === 'WIN' ? (100 * activeSignal.payoutPercent) / 100 : 0;

    if (res === 'WIN') {
      soundFx.playWinSound();
    } else {
      soundFx.playLossSound();
    }

    setLastResult({ result: res, profit: payout });
    setStatus('CONCLUDED');

    // Update Bot Stats with non-negative logic
    setStats((prev) => {
      const isWin = res === 'WIN';
      const newWins = Math.max(0, isWin ? prev.wins + 1 : prev.wins);
      const newLosses = Math.max(0, !isWin && res !== 'REFUND' ? prev.losses + 1 : prev.losses);
      const total = newWins + newLosses;
      const newWinRate = total > 0 ? Math.max(0, (newWins / total) * 100) : 92.0;
      const newStreak = isWin ? prev.streak + 1 : 0;

      return {
        ...prev,
        totalSignals: Math.max(0, prev.totalSignals + 1),
        wins: newWins,
        losses: newLosses,
        winRate: Number(newWinRate.toFixed(1)),
        streak: newStreak,
      };
    });

    // Auto next signal if toggled
    if (autoNextSignal) {
      setTimeout(() => {
        handleRequestSignal();
      }, 1500);
    }
  };

  // 2. Countdown Timer & Signal Conclusion Enforcement (Clean 1000ms tick)
  useEffect(() => {
    if (status !== 'ACTIVE' || !activeSignal) return;

    timerRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSignalConclusion();
          return 0;
        }

        if (prev <= 4) {
          soundFx.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, activeSignal]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  const technicals = calculateTechnicalIndicators(currentPrice, selectedPair);
  const sentiment = calculateBullBearSentiment(technicals, activeSignal?.direction);

  const isTradeRunning = remainingSeconds > 0 || status === 'SCANNING';

  return (
    <MobileContainer
      isMobileFrame={isMobileFrame}
      onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
    >
      <div className="h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden select-none">
        
        {/* Header */}
        <Header
          stats={stats}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenTelegramModal={() => setIsTelegramOpen(true)}
        />

        {/* Main Single-Screen Content Container (No scrolling needed) */}
        <main className="max-w-md mx-auto w-full px-3 py-2 flex-1 flex flex-col justify-center space-y-2.5 overflow-hidden">
          
          {/* 1. Currency Pair Selector Modal */}
          <PairSelector
            selectedPair={selectedPair}
            onSelectPair={(p) => setSelectedPair(p)}
            disabled={isTradeRunning}
          />

          {/* 2. Timeframe Selector Modal */}
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={handleTimeframeChange}
            disabled={isTradeRunning}
          />

          {/* 3. Bull & Bear Coin Symbol Indicator */}
          <BullBearCoin
            sentiment={sentiment}
            activeDirection={activeSignal?.direction}
            isTradeRunning={isTradeRunning}
            onFlipCoin={handleRequestSignal}
          />

          {/* 4. Primary Get Signal & Output Card */}
          <SignalCard
            signal={activeSignal}
            remainingSeconds={remainingSeconds}
            status={status}
            autoNextSignal={autoNextSignal}
            onToggleAutoNext={() => setAutoNextSignal(!autoNextSignal)}
            onRequestNextSignal={handleRequestSignal}
            lastResult={lastResult}
          />

        </main>

        {/* Minimal Compact Footer */}
        <footer className="py-2 px-3 text-center text-[10px] text-slate-500 border-t border-slate-900 bg-slate-950/90 flex-shrink-0">
          <p className="font-bold text-slate-400">
            Bull Trader LLC Bot • Quotex OTC Signal Precision
          </p>
        </footer>

        {/* Mandatory Telegram Join Prompt Modal */}
        <TelegramModal
          isOpen={isTelegramOpen}
          onClose={() => setIsTelegramOpen(false)}
        />

      </div>
    </MobileContainer>
  );
}
