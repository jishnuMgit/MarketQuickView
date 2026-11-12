import type { Pair } from "@/types/market";

export const PAIRS: Pair[] = [
  { value: "GBP/JPY", label: "GBPJPY", base: "GBP", quote: "JPY", pip: 0.01, dailyRange: "100–150 pips", volatility: "Very high" },
  { value: "GBP/NZD", label: "GBPNZD", base: "GBP", quote: "NZD", pip: 0.0001, dailyRange: "100–150 pips", volatility: "Very high" },
  { value: "GBP/AUD", label: "GBPAUD", base: "GBP", quote: "AUD", pip: 0.0001, dailyRange: "80–130 pips", volatility: "Very high" },
  { value: "GBP/CAD", label: "GBPCAD", base: "GBP", quote: "CAD", pip: 0.0001, dailyRange: "80–120 pips", volatility: "High" },
  { value: "EUR/NZD", label: "EURNZD", base: "EUR", quote: "NZD", pip: 0.0001, dailyRange: "80–120 pips", volatility: "High" },
  { value: "EUR/JPY", label: "EURJPY", base: "EUR", quote: "JPY", pip: 0.01, dailyRange: "70–110 pips", volatility: "High" },
  { value: "GBP/CHF", label: "GBPCHF", base: "GBP", quote: "CHF", pip: 0.0001, dailyRange: "70–110 pips", volatility: "High" },
  { value: "AUD/JPY", label: "AUDJPY", base: "AUD", quote: "JPY", pip: 0.01, dailyRange: "60–100 pips", volatility: "High" },
  { value: "CAD/JPY", label: "CADJPY", base: "CAD", quote: "JPY", pip: 0.01, dailyRange: "60–100 pips", volatility: "High" },
  { value: "EUR/AUD", label: "EURAUD", base: "EUR", quote: "AUD", pip: 0.0001, dailyRange: "60–100 pips", volatility: "High" },
  { value: "NZD/JPY", label: "NZDJPY", base: "NZD", quote: "JPY", pip: 0.01, dailyRange: "55–90 pips", volatility: "Medium–High" },
  { value: "GBP/USD", label: "GBPUSD", base: "GBP", quote: "USD", pip: 0.0001, dailyRange: "60–90 pips", volatility: "Medium–High" },
  { value: "EUR/USD", label: "EURUSD", base: "EUR", quote: "USD", pip: 0.0001, dailyRange: "50–80 pips", volatility: "Medium" },
  { value: "USD/JPY", label: "USDJPY", base: "USD", quote: "JPY", pip: 0.01, dailyRange: "50–80 pips", volatility: "Medium" },
  { value: "USD/CAD", label: "USDCAD", base: "USD", quote: "CAD", pip: 0.0001, dailyRange: "50–80 pips", volatility: "Medium" },
  { value: "AUD/CAD", label: "AUDCAD", base: "AUD", quote: "CAD", pip: 0.0001, dailyRange: "45–75 pips", volatility: "Medium" },
  { value: "AUD/USD", label: "AUDUSD", base: "AUD", quote: "USD", pip: 0.0001, dailyRange: "45–70 pips", volatility: "Medium" },
  { value: "NZD/USD", label: "NZDUSD", base: "NZD", quote: "USD", pip: 0.0001, dailyRange: "45–70 pips", volatility: "Medium" },
  { value: "USD/CHF", label: "USDCHF", base: "USD", quote: "CHF", pip: 0.0001, dailyRange: "45–70 pips", volatility: "Medium" },
  { value: "EUR/GBP", label: "EURGBP", base: "EUR", quote: "GBP", pip: 0.0001, dailyRange: "40–65 pips", volatility: "Lower" }
];
