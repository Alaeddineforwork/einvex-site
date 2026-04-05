import ScreeningSummary from "../../screening-summary";
import {
  companyScreeningData,
  getFinalStatus,
  getStatusStyle,
} from "../../screening-data";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = companyScreeningData[ticker];

  if (!company) {
    return (
      <main className="page-shell">
        <div className="page-container py-16">
          <div className="mx-auto max-w-4xl surface-card">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Company not found
            </h1>
            <p className="mt-4 text-slate-700">
              We could not find details for this company in the current demo.
            </p>
            <a
              href="/screener"
              className="mt-6 inline-block rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Back to Screener
            </a>
          </div>
        </div>
      </main>
    );
  }

  const finalStatus = getFinalStatus(company.norms);

  return (
    <main className="page-shell">
      <div className="page-container py-16">
        <div className="mx-auto max-w-4xl surface-card md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="eyebrow">Company Details</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {company.name}
              </h1>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
                {company.ticker}
              </p>
            </div>

            <span
              className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                finalStatus
              )}`}
            >
              {finalStatus}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
            <div>
              <p className="section-label">Sector</p>
              <p className="mt-2 text-lg text-slate-900">{company.sector}</p>
            </div>

            <div>
              <p className="section-label">Ticker</p>
              <p className="mt-2 text-lg text-slate-900">{company.ticker}</p>
            </div>
          </div>

          <div className="mt-10">
            <p className="section-label">Overview</p>
            <p className="mt-3 leading-8 text-slate-700">{company.description}</p>
          </div>

          <div className="mt-10">
            <p className="section-label">Screening Note</p>
            <p className="mt-3 leading-8 text-slate-700">{company.reasoning}</p>
          </div>

          <ScreeningSummary norms={company.norms} finalStatus={finalStatus} className="mt-10" />

          <div className="mt-10 surface-subtle">
            <p className="section-label">Disclaimer</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              This page is a product demo for preview purposes. Final screening
              outputs and methodology may evolve as the EinveX framework is refined.
            </p>
          </div>

          <div className="mt-10">
            <a
              href="/screener"
              className="inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Back to Screener
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
