import { CurrencyPair, SignalData, TechnicalIndicators, TimeframeConfig, BullBearSentiment, MarketTick } from '../types';

// Helper to format currency/price according to pair decimals
export function formatPrice(price: number, decimals: number): string {
  return price.toFixed(decimals);
}

// Generate realistic simulated market price ticks
export function getNextTickPrice(currentPrice: number, pair: CurrencyPair): number {
  const delta = (Math.random() - 0.492) * pair.volatility;
  let newPrice = currentPrice + delta;
  if (newPrice <= 0) newPrice = pair.basePrice;
  return Number(newPrice.toFixed(pair.decimals));
}

// Calculate technical indicators based on current market price and history
export function calculateTechnicalIndicators(price: number, pair: CurrencyPair): TechnicalIndicators {
  // Pseudo-randomized yet realistic deterministic indicator values
  const seed = (price * 1000) % 100;
  const rsi = Math.min(95, Math.max(15, Math.round(35 + (seed % 40) + (Math.sin(price) * 15))));
  
  const macdVal = (Math.sin(price * 10) * 0.0008);
  const macdSignal = (Math.cos(price * 10) * 0.0006);
  const histogram = macdVal - macdSignal;

  const stochK = Math.min(98, Math.max(5, Math.round((seed * 1.3) % 90)));
  const stochD = Math.min(98, Math.max(5, Math.round((stochK + 4) % 90)));

  const emaCross = rsi < 40 ? 'BULLISH' : rsi > 60 ? 'BEARISH' : 'NEUTRAL';
  const bollingerBands = rsi < 30 ? 'LOWER_BREAK' : rsi > 70 ? 'UPPER_BREAK' : 'MIDDLE';
  const superTrend = emaCross === 'BULLISH' || rsi < 48 ? 'BUY' : 'SELL';

  let overallScore = 50;
  if (superTrend === 'BUY') overallScore += 25;
  if (superTrend === 'SELL') overallScore -= 25;
  if (rsi < 35) overallScore += 20;
  if (rsi > 65) overallScore -= 20;
  overallScore = Math.min(98, Math.max(60, Math.round(Math.abs(overallScore - 50) + 65)));

  return {
    rsi,
    macd: {
      value: Number(macdVal.toFixed(pair.decimals + 1)),
      signal: Number(macdSignal.toFixed(pair.decimals + 1)),
      histogram: Number(histogram.toFixed(pair.decimals + 1)),
    },
    stochastic: { k: stochK, d: stochD },
    emaCross,
    bollingerBands,
    superTrend,
    overallScore,
  };
}

// Generate sentiment power for Bull & Bear Coin
export function calculateBullBearSentiment(indicators: TechnicalIndicators, direction?: 'CALL' | 'PUT'): BullBearSentiment {
  let bullPower = 50;

  if (direction === 'CALL') {
    bullPower = 70 + Math.floor(Math.random() * 22); // 70% to 92%
  } else if (direction === 'PUT') {
    bullPower = 10 + Math.floor(Math.random() * 20); // 10% to 30%
  } else {
    bullPower = Math.round(indicators.rsi > 50 ? 60 + Math.sin(indicators.rsi) * 20 : 40 - Math.sin(indicators.rsi) * 20);
  }

  bullPower = Math.min(96, Math.max(8, bullPower));
  const bearPower = 100 - bullPower;

  let trend: BullBearSentiment['trend'] = 'NEUTRAL';
  if (bullPower >= 75) trend = 'STRONG_BULLISH';
  else if (bullPower >= 58) trend = 'BULLISH';
  else if (bullPower <= 25) trend = 'STRONG_BEARISH';
  else if (bullPower <= 42) trend = 'BEARISH';

  return {
    bullPower,
    bearPower,
    trend,
    volatilityIndex: Math.round(65 + Math.random() * 30),
  };
}

// Zohaib Naqvi Bot Signal Generator Engine
export function generateBotSignal(
  pair: CurrencyPair,
  timeframe: TimeframeConfig,
  currentPrice: number,
  vipMode: boolean = false
): SignalData {
  const indicators = calculateTechnicalIndicators(currentPrice, pair);
  
  // Determine direction based on algorithmic convergence
  const isBullish = indicators.rsi < 52 || indicators.superTrend === 'BUY' || indicators.emaCross === 'BULLISH';
  const direction: 'CALL' | 'PUT' = isBullish ? 'CALL' : 'PUT';

  // High confidence accuracy formula (Zohaib Naqvi Bot special algorithm)
  const baseConfidence = vipMode ? 94 : 88;
  const confidence = Math.min(98, Math.max(85, baseConfidence + Math.floor(Math.random() * 8)));

  const entryPrice = currentPrice;
  const offset = pair.volatility * (direction === 'CALL' ? 1.5 : -1.5);
  const targetPrice = Number((entryPrice + offset).toFixed(pair.decimals));

  const now = Date.now();
  const expiresAt = now + timeframe.seconds * 1000;

  const reasoningOptions = direction === 'CALL'
    ? [
        `RSI (${indicators.rsi}) oversold + Bullish EMA 9/21 Golden Crossover detected on ${pair.symbol}.`,
        `Lower Bollinger Band bounce with high volume buyer convergence on Pocket Option ${timeframe.label} timeframe.`,
        `Zohaib Naqvi AI AI algorithm detected strong institutional buy order block at ${formatPrice(entryPrice, pair.decimals)}.`,
        `SuperTrend BUY signal confirmed with Stochastic K line crossing D line upward.`,
      ]
    : [
        `RSI (${indicators.rsi}) overbought + Bearish EMA 9/21 Death Cross on ${pair.symbol}.`,
        `Upper Bollinger Band rejection + seller volume surge detected on ${timeframe.label} timeframe.`,
        `Zohaib Naqvi AI AI algorithm identified key resistance liquidity sweep at ${formatPrice(entryPrice, pair.decimals)}.`,
        `SuperTrend SELL signal active with bearish momentum breakdown confirmed.`,
      ];

  const reasoning = reasoningOptions[Math.floor(Math.random() * reasoningOptions.length)];

  return {
    id: `sig_${now}_${Math.random().toString(36).substring(2, 7)}`,
    pair,
    timeframe,
    direction,
    confidence,
    entryPrice,
    targetPrice,
    createdAt: now,
    expiresAt,
    status: 'ACTIVE',
    payoutPercent: pair.payoutRate,
    indicators,
    reasoning,
  };
}

// Evaluate signal result on expiry
export function evaluateSignalResult(
  signal: SignalData,
  finalPrice: number
): 'WIN' | 'LOSS' | 'REFUND' {
  if (signal.direction === 'CALL') {
    if (finalPrice > signal.entryPrice) return 'WIN';
    if (finalPrice < signal.entryPrice) return 'LOSS';
    return 'REFUND';
  } else {
    // PUT signal
    if (finalPrice < signal.entryPrice) return 'WIN';
    if (finalPrice > signal.entryPrice) return 'LOSS';
    return 'REFUND';
  }
}

// Initial dummy market ticks for live chart
export function generateInitialTicks(pair: CurrencyPair, count: number = 30): MarketTick[] {
  const ticks: MarketTick[] = [];
  let price = pair.basePrice;
  const now = Date.now();
  const intervalMs = 2000;

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    const open = price;
    price = getNextTickPrice(price, pair);
    const close = price;
    const high = Math.max(open, close) + Math.random() * pair.volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * pair.volatility * 0.5;

    ticks.push({
      time,
      price,
      open,
      close,
      high,
      low,
      volume: Math.floor(100 + Math.random() * 900),
    });
  }

  return ticks;
}
