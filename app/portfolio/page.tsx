import { Suspense } from "react";
import TickerTape from "../components/ticker-tape";
import PortfolioClient from "./portfolio-client";

export const metadata = {
  title: "My Portfolio — EinveX",
  description:
    "Track your Casablanca Stock Exchange holdings, reinvestment pot, equity curve, sector allocation, dividend purification and Zakat — all in one place.",
};

export default function PortfolioPage() {
  return (
    <main className="page-shell pt-[60px]">
      <TickerTape />

      <section className="page-container py-8 md:py-10">
        <div className="page-hero grid-fade">
          <p className="eyebrow">Portfolio</p>
          <h1 className="page-title">Your trading desk.</h1>
          <p className="page-intro">
            Add positions, log sells, replay your equity curve, watch your
            sector allocation, and stay on top of dividend purification and
            Zakat — all stored locally in your browser.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <Suspense fallback={<div className="surface-card">Loading…</div>}>
          <PortfolioClient />
        </Suspense>
      </section>
    </main>
  );
}
