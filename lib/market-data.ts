import type { Candle, MarketPayload } from "@/types/market";

type TwelveDataValue = { datetime: string; open: string; high: string; low: string; close: string };
type TwelveDataResponse = { values?: TwelveDataValue[]; status?: string; message?: string; code?: number };

function toCandle(row: TwelveDataValue): Candle {
  return {
    time: Math.floor(new Date(`${row.datetime.replace(" ", "T")}Z`).getTime() / 1000),
    open: Number(row.open),
    high: Number(row.high),
    low: Number(row.low),
    close: Number(row.close),
  };
}

function aggregate(candles: Candle[], seconds: number): Candle[] {
  const buckets = new Map<number, Candle[]>();
  for (const candle of candles) {
    const bucket = Math.floor(candle.time / seconds) * seconds;
    const group = buckets.get(bucket) ?? [];
    group.push(candle);
    buckets.set(bucket, group);
  }
  return [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([time, group]) => ({
    time,
    open: group[0].open,
    high: Math.max(...group.map(c => c.high)),
    low: Math.min(...group.map(c => c.low)),
    close: group[group.length - 1].close,
  }));
}

function makeDemo(symbol: string): MarketPayload {
  const isJpy = symbol.includes("JPY");
  const base = isJpy ? 190 + Math.random() * 10 : 1 + Math.random() * 0.5;
  const pip = isJpy ? 0.01 : 0.0001;
  const now = Math.floor(Date.now() / 1000 / 900) * 900;
  let price = base;
  const candles15m: Candle[] = [];
  for (let i = 240; i >= 0; i--) {
    const open = price;
    const drift = (Math.random() - 0.47) * pip * 18;
    const close = open + drift;
    const high = Math.max(open, close) + Math.random() * pip * 7;
    const low = Math.min(open, close) - Math.random() * pip * 7;
    candles15m.push({ time: now - i * 900, open, high, low, close });
    price = close;
  }
  return {
    symbol,
    candles15m,
    candles1h: aggregate(candles15m, 3600),
    candles4h: aggregate(candles15m, 14400),
    updatedAt: new Date().toISOString(),
    source: "Demo generator",
    isDemo: true,
  };
}

export async function getMarketData(symbol: string): Promise<MarketPayload> {
  const key = process.env.TWELVE_DATA_API_KEY;
  if (!key) return makeDemo(symbol);

  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", "15min");
  url.searchParams.set("outputsize", "500");
  url.searchParams.set("timezone", "UTC");
  url.searchParams.set("order", "ASC");
  url.searchParams.set("apikey", key);

  const response = await fetch(url.toString(), { next: { revalidate: 0 }, cache: "no-store" });
  if (!response.ok) throw new Error(`Market data provider returned HTTP ${response.status}`);
  const json = (await response.json()) as TwelveDataResponse;
  if (!json.values?.length) throw new Error(json.message || "No candle data returned. Check your API key and symbol permissions.");

  const candles15m = json.values.map(toCandle).filter(c => Number.isFinite(c.time)).sort((a, b) => a.time - b.time);
  return {
    symbol,
    candles15m,
    candles1h: aggregate(candles15m, 3600),
    candles4h: aggregate(candles15m, 14400),
    updatedAt: new Date().toISOString(),
    source: "Twelve Data",
    isDemo: false,
  };
}
