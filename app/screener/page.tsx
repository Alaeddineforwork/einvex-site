import ScreenerClient from "./screener-client";

export const metadata = {
  title: "Screener — EinveX",
  description:
    "AAOIFI-based Sharia screener for the Casablanca Stock Exchange — search and filter every listed company by sector and compliance status.",
};

export default function ScreenerPage() {
  return (
    <main className="page-shell pt-[60px]">
      <section className="page-container py-8 md:py-10">
        <div className="page-hero grid-fade">
          <p className="eyebrow">EinveX Screener</p>
          <h1 className="page-title">Explore screened companies.</h1>
          <p className="page-intro">
            Browse every Casablanca Stock Exchange company through the AAOIFI
            lens — search by ticker, filter by sector, and see at a glance
            whether each name is Sharia-compliant or not Sharia-compliant.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <ScreenerClient />
      </section>
    </main>
  );
}
