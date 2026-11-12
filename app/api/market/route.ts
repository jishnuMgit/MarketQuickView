import { NextRequest, NextResponse } from "next/server";
import { getMarketData } from "@/lib/market-data";
import { PAIRS } from "@/lib/pairs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") || "GBP/JPY";
  if (!PAIRS.some(pair => pair.value === symbol)) {
    return NextResponse.json({ error: "Unsupported currency pair." }, { status: 400 });
  }
  try {
    const data = await getMarketData(symbol);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load market data.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
