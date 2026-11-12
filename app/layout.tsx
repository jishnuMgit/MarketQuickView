import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Structure | Forex Terminal",
  description: "Multi-timeframe forex market structure dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
