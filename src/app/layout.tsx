import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/core/QueryProvider";

export const metadata: Metadata = {
  title: "Quantara — Institutional Financial Infrastructure",
  description:
    "Income-backed credit markets on-chain. Institutional-grade infrastructure to securitize, risk-assess, and trade income streams as programmable assets.",
  keywords: ["fintech", "DeFi", "institutional", "credit markets", "risk engine", "capital allocation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-dark text-white font-sans antialiased min-h-screen selection:bg-white selection:text-black">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
