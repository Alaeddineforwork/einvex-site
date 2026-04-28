"use client";

import { useEffect, useState } from "react";
import { getCasablancaMarketStatus } from "../market-status";

export default function MarketStatusPill() {
  const [status, setStatus] = useState(() => getCasablancaMarketStatus());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatus(getCasablancaMarketStatus());
    }, 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      suppressHydrationWarning
      title={status.detail}
      className="mt-3 inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{
        borderColor: status.isOpen
          ? "rgba(34,197,94,0.35)"
          : "rgba(255,255,255,0.12)",
        background: status.isOpen
          ? "rgba(34,197,94,0.12)"
          : "rgba(255,255,255,0.04)",
        color: status.isOpen ? "#86efac" : "var(--text-mute)",
      }}
    >
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{
          background: status.isOpen ? "#22c55e" : "var(--text-mute)",
          boxShadow: status.isOpen ? "0 0 8px rgba(34,197,94,0.65)" : "none",
        }}
      />
      Market {status.label}
    </span>
  );
}
