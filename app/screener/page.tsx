import ScreenerClient from "./screener-client";

export default function ScreenerPage() {
  return (
    <main className="page-shell">
      <section className="page-container py-16">
        <div className="page-hero">
          <p className="eyebrow">EinveX Screener</p>
          <h1 className="page-title">Explore screened companies</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
            This demo shows how investors can review companies and see whether
            they are compliant, non-compliant, or still under review.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <ScreenerClient />
      </section>
    </main>
  );
}
