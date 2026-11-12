"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  LineSeries,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import type { Candle } from "@/types/market";

type Props = { candles: Candle[]; kind: "line" | "candles"; height?: number; color?: string; label: string };

export default function MarketChart({ candles, kind, height = 270, color = "#35d49a", label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height,
      layout: { background: { type: ColorType.Solid, color: "#0e1725" }, textColor: "#8797ad", fontFamily: "Arial", fontSize: 11 },
      grid: { vertLines: { color: "#1a2637" }, horzLines: { color: "#1a2637" } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#26364b" },
      timeScale: { borderColor: "#26364b", timeVisible: true, secondsVisible: false },
      localization: { priceFormatter: (price: number) => price.toFixed(price > 20 ? 3 : 5) },
      handleScroll: true,
      handleScale: true,
    });
    chartRef.current = chart;

    if (kind === "line") {
      const series = chart.addSeries(LineSeries, {
        color, lineWidth: 2, priceLineVisible: true, lastValueVisible: true,
        crosshairMarkerVisible: true,
      });
      series.setData(candles.map(c => ({ time: c.time as Time, value: c.close })));
    } else {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#35d49a", downColor: "#ff6475",
        borderUpColor: "#35d49a", borderDownColor: "#ff6475",
        wickUpColor: "#35d49a", wickDownColor: "#ff6475",
      });
      series.setData(candles.map(c => ({
        time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close,
      })));
    }

    chart.timeScale().fitContent();
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width) chart.applyOptions({ width });
    });
    observer.observe(containerRef.current);
    return () => { observer.disconnect(); chart.remove(); chartRef.current = null; };
  }, [candles, kind, height, color]);

  return <div className="w-full">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs font-semibold tracking-wider text-slate-300">{label}</span>
      <span className="text-[10px] text-slate-500">{kind === "line" ? "CLOSE PRICE" : "OHLC CANDLES"}</span>
    </div>
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg" />
  </div>;
}
