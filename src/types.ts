export type PairType = 'forex' | 'otc' | 'crypto' | 'commodity' | 'stock';

export interface CurrencyPair {
  id: string;
  symbol: string;
  name: string;
  type: PairType;
  isOTC: boolean;
  payoutRate: number; // e.g., 92 for 92%
  basePrice: number;
  decimals: number;
  volatility: number;
}

export type TimeframeId = '5s' | '15s' | '20s' | '30s' | '1m' | '5m';

export interface TimeframeConfig {
  id: TimeframeId;
  label: string;
  seconds: number;
  badge?: string;
}

export type SignalDirection = 'CALL' | 'PUT'; // CALL = UP, PUT = DOWN

export type SignalStatus = 'SCANNING' | 'ACTIVE' | 'CONCLUDED' | 'EXPIRED';

export interface TechnicalIndicators {
  rsi: number; // 0 - 100
  macd: { value: number; signal: number; histogram: number };
  stochastic: { k: number; d: number };
  emaCross: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  bollingerBands: 'UPPER_BREAK' | 'LOWER_BREAK' | 'MIDDLE';
  superTrend: 'BUY' | 'SELL';
  overallScore: number; // 0 - 100
}

export interface SignalData {
  id: string;
  pair: CurrencyPair;
  timeframe: TimeframeConfig;
  direction: SignalDirection;
  confidence: number; // e.g., 94%
  entryPrice: number;
  targetPrice: number;
  closePrice?: number;
  createdAt: number; // timestamp
  expiresAt: number; // timestamp
  status: SignalStatus;
  result?: 'WIN' | 'LOSS' | 'REFUND';
  payoutPercent: number;
  indicators: TechnicalIndicators;
  reasoning: string;
}

export interface SignalHistoryItem {
  id: string;
  pairSymbol: string;
  isOTC: boolean;
  timeframeLabel: string;
  direction: SignalDirection;
  entryPrice: number;
  closePrice: number;
  confidence: number;
  result: 'WIN' | 'LOSS' | 'REFUND';
  payoutAmount: number;
  timestamp: number;
}

export interface MarketTick {
  time: number;
  price: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}

export interface BullBearSentiment {
  bullPower: number; // e.g. 78
  bearPower: number; // e.g. 22
  trend: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  volatilityIndex: number;
}

export interface BotStats {
  totalSignals: number;
  wins: number;
  losses: number;
  winRate: number; // e.g. 89.5%
  todayProfitPoints: number;
  streak: number;
}
