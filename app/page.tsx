"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, RefreshCw, Wifi, WifiOff, Zap } from "lucide-react";
import PairSelector from "@/components/PairSelector";
import MarketChart from "@/components/MarketChart";
import { PAIRS } from "@/lib/pairs";
import { detectStructure, findFairValueGaps } from "@/lib/market-structure";
import type { MarketPayload, Pair } from "@/types/market";

function Stat({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return <div className="panel p-4">
    <div className="text-[10px] font-semibold tracking-[.15em] text-slate-500">{label}</div>
    <div className="mt-2 text-xl font-semibold text-slate-100">{value}</div>
    {sub && <div className={`mt-1 text-xs ${positive === undefined ? "text-slate-500" : positive ? "green" : "red"}`}>{sub}</div>}
  </div>;
}

export default function Home() {
  const [pair, setPair] = useState<Pair>(PAIRS[0]);
  const [data, setData] = useState<MarketPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const response = await fetch(`/api/market?symbol=${encodeURIComponent(pair.value)}`, { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not load market data.");
      setData(json);
      setError("");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Market data error");
    } finally {
      setLoading(false);
    }
  }, [pair]);

  useEffect(() => { setData(null); load(true); }, [pair, load]);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => load(false), 60_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, load]);

  const structure4h = useMemo(() => data ? detectStructure(data.candles4h) : null, [data]);
  const structure1h = useMemo(() => data ? detectStructure(data.candles1h) : null, [data]);
  const structure15m = useMemo(() => data ? detectStructure(data.candles15m) : null, [data]);
  const gaps = useMemo(() => data ? findFairValueGaps(data.candles15m) : [], [data]);
  const lastPrice = data?.candles15m.at(-1)?.close;
  const previousPrice = data?.candles15m.at(-2)?.close;
  const change = lastPrice && previousPrice ? ((lastPrice - previousPrice) / previousPrice) * 100 : 0;
  const decimals = pair.quote === "JPY" ? 3 : 5;
  const pipValue = pair.pip;
  const dailyRange = structure15m?.averageRange != null ? (structure15m.averageRange * 96 / pipValue).toFixed(0) : "—";
  const volatility = structure15m?.atr != null
    ? structure15m.atr > pipValue * 12 ? "High" : structure15m.atr > pipValue * 6 ? "Medium" : "Low"
    : pair.volatility;

  const trendTone = (trend?: string) => trend === "Bullish" ? "green" : trend === "Bearish" ? "red" : "text-amber-300";
  const priceText = (n?: number) => n == null ? "—" : n.toFixed(decimals);

  return <main className="min-h-screen">
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#080d16]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-7">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300"><Activity size={21}/></div>
          <div><div className="font-semibold tracking-wide text-slate-100">STRUCTURE<span className="text-emerald-400">FLOW</span></div><div className="text-[10px] tracking-[.2em] text-slate-500">FOREX ANALYSIS TERMINAL</div></div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PairSelector pairs={PAIRS} value={pair} onChange={setPair}/>
          <button onClick={() => load(true)} className="mt-5 flex h-11 items-center gap-2 rounded-lg border border-slate-700 px-3 text-xs text-slate-300 hover:border-emerald-400/60 hover:text-white">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""}/> Refresh
          </button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 lg:px-7">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><span>MARKET OVERVIEW</span><span>/</span><span>{pair.base} / {pair.quote}</span></div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{pair.label}</h1>
            <span className={`text-sm font-medium ${change >= 0 ? "green" : "red"}`}>{change >= 0 ? "+" : ""}{change.toFixed(3)}%</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Multi-timeframe price action · 4H / 1H / 15M</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-2 rounded-full border px-3 py-2 ${data?.isDemo ? "border-amber-500/30 text-amber-300" : "border-emerald-500/30 text-emerald-300"}`}>
            {data?.isDemo ? <WifiOff size={13}/> : <Wifi size={13}/>}
            {data?.isDemo ? "DEMO DATA — ADD API KEY" : "PROVIDER CONNECTED"}
          </span>
          <button onClick={() => setAutoRefresh(v => !v)} className={`rounded-full border px-3 py-2 ${autoRefresh ? "border-emerald-500/30 text-emerald-300" : "border-slate-700 text-slate-400"}`}>
            Auto refresh {autoRefresh ? "ON" : "OFF"}
          </button>
          <span className="flex items-center gap-1 text-slate-500"><Clock3 size={13}/> {lastUpdated || "—"}</span>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label="CURRENT PRICE" value={priceText(lastPrice)} sub={data?.isDemo ? "Illustrative demo feed" : "Latest 15M close"} positive={change >= 0}/>
        <Stat label="4H MARKET BIAS" value={structure4h?.trend || "Loading"} sub={structure4h?.lastEvent || "Structure event"} positive={structure4h?.trend === "Bullish" ? true : structure4h?.trend === "Bearish" ? false : undefined}/>
        <Stat label="EST. DAILY RANGE" value={dailyRange === "—" ? "—" : `${dailyRange} pips`} sub="Approx. from recent 15M candles"/>
        <Stat label="VOLATILITY" value={volatility} sub={`Pair profile: ${pair.volatility}`}/>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-slate-100">4H · Higher-timeframe direction</h2><p className="mt-1 text-xs text-slate-500">Major trend and swing structure</p></div><span className={`rounded-md bg-slate-800 px-2 py-1 text-xs ${trendTone(structure4h?.trend)}`}>{structure4h?.trend || "—"}</span></div>
          {data && <MarketChart candles={data.candles4h} kind="line" color="#35d49a" label="4 HOUR CLOSE PRICE"/>}
          {!data && <div className="h-[270px] animate-pulse rounded-lg bg-slate-800/40"/>}
          <div className="mt-3 flex justify-between border-t border-slate-800 pt-3 text-xs"><span className="muted">Last structure event</span><span className="text-slate-200">{structure4h?.lastEvent || "—"}</span></div>
        </div>
        <div className="panel p-4">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-slate-100">1H · Intermediate structure</h2><p className="mt-1 text-xs text-slate-500">Pullbacks and continuation context</p></div><span className={`rounded-md bg-slate-800 px-2 py-1 text-xs ${trendTone(structure1h?.trend)}`}>{structure1h?.trend || "—"}</span></div>
          {data && <MarketChart candles={data.candles1h} kind="line" color="#60a5fa" label="1 HOUR CLOSE PRICE"/>}
          {!data && <div className="h-[270px] animate-pulse rounded-lg bg-slate-800/40"/>}
          <div className="mt-3 flex justify-between border-t border-slate-800 pt-3 text-xs"><span className="muted">Last structure event</span><span className="text-slate-200">{structure1h?.lastEvent || "—"}</span></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <div className="panel p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold text-slate-100">15M · Execution timeframe</h2><p className="mt-1 text-xs text-slate-500">Candlestick view for entry confirmation</p></div><span className={`rounded-md bg-slate-800 px-2 py-1 text-xs ${trendTone(structure15m?.trend)}`}>{structure15m?.trend || "—"}</span></div>
          {data && <MarketChart candles={data.candles15m} kind="candles" height={390} label="15 MINUTE OHLC"/>}
          {!data && <div className="h-[390px] animate-pulse rounded-lg bg-slate-800/40"/>}
          <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-800 pt-3 text-xs">
            <span className="muted">Last event: <b className="ml-1 text-slate-200">{structure15m?.lastEvent || "—"}</b></span>
            <span className="muted">ATR(14): <b className="ml-1 text-slate-200">{structure15m?.atr ? priceText(structure15m.atr) : "—"}</b></span>
            <span className="muted">FVG zones: <b className="ml-1 text-slate-200">{gaps.length}</b></span>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2"><Zap size={16} className="text-amber-300"/><h3 className="font-semibold">Trade alignment</h3></div>
            <div className="space-y-3">
              {[["4H bias", structure4h?.trend], ["1H bias", structure1h?.trend], ["15M bias", structure15m?.trend]].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between border-b border-slate-800 pb-2 text-sm"><span className="text-slate-400">{label}</span><span className={trendTone(String(value))}>{String(value || "Waiting")}</span></div>)}
            </div>
            <div className="mt-3 rounded-lg bg-slate-800/60 p-3 text-xs leading-5 text-slate-400">
              {structure4h?.trend === structure1h?.trend && structure1h?.trend === structure15m?.trend && structure4h?.trend !== "Ranging" && structure4h?.trend !== "Insufficient data"
                ? `All three timeframes currently show ${structure4h?.trend.toLowerCase()} structure. Wait for your entry model and risk rules before considering a trade.`
                : "Timeframes are not fully aligned. Wait for a clear pullback and 15M confirmation instead of forcing an entry."}
            </div>
          </div>
          <div className="panel p-4">
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">15M fair value gaps</h3><span className="text-[10px] text-slate-500">RECENT DETECTIONS</span></div>
            {gaps.length ? <div className="space-y-2">{gaps.map((gap, i) => <div key={`${gap.from}-${i}`} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 text-xs"><div><div className={gap.direction === "Bullish" ? "green" : "red"}>{gap.direction} FVG</div><div className="mt-1 text-slate-500">{new Date(gap.from * 1000).toLocaleString()}</div></div><div className="text-right text-slate-300">{priceText(gap.bottom)} – {priceText(gap.top)}</div></div>)}</div> : <p className="text-xs text-slate-500">No recent three-candle gaps detected.</p>}
          </div>
          <div className="panel p-4">
            <h3 className="mb-2 font-semibold">Quick analysis checklist</h3>
            <ul className="space-y-2 text-xs leading-5 text-slate-400">
              <li>01 · Confirm 4H swing direction.</li><li>02 · Mark 1H pullback and liquidity.</li><li>03 · Wait for 15M CHoCH or BOS.</li><li>04 · Check FVG quality and entry location.</li><li>05 · Place stop beyond invalidation; calculate risk.</li>
            </ul>
          </div>
        </aside>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-4 text-[11px] text-slate-600">
        <span>STRUCTUREFLOW · Built for multi-timeframe price-action analysis</span>
        <span>Source: {data?.source || "Connecting"} · {data?.isDemo ? "Demo data is not tradable" : "Provider data may be delayed"}</span>
      </footer>
    </div>
  </main>;
}
