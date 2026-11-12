export type Candle = {
  time: number; // Unix seconds, required by Lightweight Charts
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Pair = {
  value: string;
  label: string;
  base: string;
  quote: string;
  pip: number;
  dailyRange: string;
  volatility: string;
};

export type MarketPayload = {
  symbol: string;
  candles15m: Candle[];
  candles1h: Candle[];
  candles4h: Candle[];
  updatedAt: string;
  source: string;
  isDemo: boolean;
};
