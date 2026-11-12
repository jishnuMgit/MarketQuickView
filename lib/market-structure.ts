import type { Candle } from "@/types/market";

export type Swing = { index: number; price: number; kind: "high" | "low" };
export type StructureResult = {
  swings: Swing[];
  trend: "Bullish" | "Bearish" | "Ranging" | "Insufficient data";
  lastEvent: string;
  lastEventPrice?: number;
  atr: number | null;
  averageRange: number | null;
};

export function detectStructure(candles: Candle[], strength = 3): StructureResult {
  if (candles.length < strength * 2 + 5) {
    return { swings: [], trend: "Insufficient data", lastEvent: "Waiting for candles", atr: null, averageRange: null };
  }

  const swings: Swing[] = [];
  for (let i = strength; i < candles.length - strength; i++) {
    const c = candles[i];
    const left = candles.slice(i - strength, i);
    const right = candles.slice(i + 1, i + strength + 1);
    if (left.every(x => c.high > x.high) && right.every(x => c.high >= x.high)) {
      swings.push({ index: i, price: c.high, kind: "high" });
    }
    if (left.every(x => c.low < x.low) && right.every(x => c.low <= x.low)) {
      swings.push({ index: i, price: c.low, kind: "low" });
    }
  }

  const highs = swings.filter(s => s.kind === "high").slice(-2);
  const lows = swings.filter(s => s.kind === "low").slice(-2);
  let trend: StructureResult["trend"] = "Ranging";
  if (highs.length === 2 && lows.length === 2) {
    if (highs[1].price > highs[0].price && lows[1].price > lows[0].price) trend = "Bullish";
    else if (highs[1].price < highs[0].price && lows[1].price < lows[0].price) trend = "Bearish";
  }

  const last = candles[candles.length - 1];
  const priorHigh = highs.at(-1);
  const priorLow = lows.at(-1);
  let lastEvent = "No confirmed break";
  let lastEventPrice: number | undefined;
  if (priorHigh && last.close > priorHigh.price) {
    lastEvent = trend === "Bearish" ? "Bullish CHoCH" : "Bullish BOS";
    lastEventPrice = priorHigh.price;
  } else if (priorLow && last.close < priorLow.price) {
    lastEvent = trend === "Bullish" ? "Bearish CHoCH" : "Bearish BOS";
    lastEventPrice = priorLow.price;
  }

  const trueRanges = candles.slice(1).map((c, i) =>
    Math.max(c.high - c.low, Math.abs(c.high - candles[i].close), Math.abs(c.low - candles[i].close))
  );
  const atrWindow = trueRanges.slice(-14);
  const atr = atrWindow.length ? atrWindow.reduce((a, b) => a + b, 0) / atrWindow.length : null;
  const dailyWindow = candles.slice(-96);
  const averageRange = dailyWindow.length
    ? dailyWindow.reduce((sum, c) => sum + c.high - c.low, 0) / dailyWindow.length
    : null;

  return { swings, trend, lastEvent, lastEventPrice, atr, averageRange };
}

export function findFairValueGaps(candles: Candle[]) {
  const gaps: { from: number; to: number; top: number; bottom: number; direction: "Bullish" | "Bearish" }[] = [];
  for (let i = 2; i < candles.length; i++) {
    const first = candles[i - 2];
    const third = candles[i];
    if (third.low > first.high) gaps.push({ from: first.time, to: third.time, top: third.low, bottom: first.high, direction: "Bullish" });
    if (third.high < first.low) gaps.push({ from: first.time, to: third.time, top: first.low, bottom: third.high, direction: "Bearish" });
  }
  return gaps.slice(-8);
}
