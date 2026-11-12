# StructureFlow — Forex Market Structure Dashboard

A Next.js + TypeScript dashboard for quickly reviewing 20 forex pairs across 4H, 1H and 15M.

## Features

- Searchable React Select currency-pair selector with your 20 pairs.
- 4H and 1H line charts, plus a 15M candlestick chart.
- Candle aggregation from the 15-minute feed to create 1H and 4H OHLC bars.
- Basic swing-high / swing-low, BOS / CHoCH, ATR and three-candle FVG detection.
- Multi-timeframe alignment summary and a quick trading checklist.
- Server-side API key handling; the browser never receives your Twelve Data key.
- Demo data fallback when no API key is configured.
- 60-second auto-refresh toggle and manual refresh.

## Requirements

- Node.js 20 or newer
- npm
- Twelve Data API key (optional for demo mode; required for provider data)

## Run locally

```bash
npm install
cp .env.example .env.local
```

Add your key to `.env.local`:

```env
TWELVE_DATA_API_KEY=your_real_key_here
```

Then:

```bash
npm run dev
```

Open http://localhost:3000

On Windows PowerShell, create the env file with:

```powershell
Copy-Item .env.example .env.local
```

## Data provider and refresh behaviour

This project uses Twelve Data's `/time_series` endpoint with a 15-minute interval and requests up to 500 candles per selected pair. The 1H and 4H candles are aggregated from that same 15M dataset, so selecting a pair uses one provider request rather than three separate timeframe requests.

The dashboard refreshes every 60 seconds by default. Check your Twelve Data plan's API-credit, rate-limit, forex-symbol and real-time entitlement before enabling frequent refreshes. Provider data may be delayed depending on the account and feed. Do not assume the free tier supplies institutional-grade live prices.

If your plan has a lower request limit, turn Auto refresh off and use manual refresh. Keep your API key private in `.env.local`; do not prefix it with `NEXT_PUBLIC_`.

## Important notes about analysis

The structure engine is a transparent starter implementation, not a certified trading signal:
- Swing points use a simple left/right candle strength rule.
- BOS / CHoCH is a basic close-through-last-swing heuristic.
- FVG is detected using a three-candle imbalance rule.
- ATR and daily-range values are approximate and based on the loaded candle history.

Use these detections as visual prompts. Add your own confirmation rules, session filters, minimum displacement, mitigation rules, spread checks and risk model before relying on them. The dashboard does not place trades or provide financial advice.

## Suggested next improvements

1. Add chart overlays for swing points, BOS/CHoCH labels and FVG rectangles.
2. Add previous-day high/low, weekly high/low and session ranges.
3. Add a market-news / high-impact event calendar.
4. Add broker-specific spread and execution data.
5. Add a watchlist scanner to rank all 20 pairs by ATR, range expansion and timeframe alignment.

## Main dependencies

- Next.js
- React Select
- TradingView Lightweight Charts
- Tailwind CSS
- Lucide React
# MarketQuickView
