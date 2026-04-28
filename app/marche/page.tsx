import TickerTape from "../components/ticker-tape";
import MarcheClient from "./marche-client";
import MarketStatusPill from "./market-status-pill";

export const metadata = {
  title: "Market - EinveX",
  description:
    "Market snapshot of the Casablanca Stock Exchange with Sharia screening, sector filters, top movers and an interactive ticker tape.",
};

export default function MarchePage() {
  return (
    <main className="page-shell pt-[60px]">
      {/* Ticker tape sits flush under the fixed header */}
      <TickerTape />

      <section className="page-container py-8 md:py-10">
        <div className="page-hero grid-fade">
          <p className="eyebrow">Market · Casablanca</p>
          <MarketStatusPill />
          <h1 className="page-title">Markets in one screen.</h1>
          <p className="page-intro">
            Browse the Casablanca Stock Exchange universe with latest available
            quotes, AAOIFI Sharia status and sector grouping. Click any
            row to drill into a 1-year price chart, momentum, volatility
            and the screening detail.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <MarcheClient />
      </section>
    </main>
  );
}
