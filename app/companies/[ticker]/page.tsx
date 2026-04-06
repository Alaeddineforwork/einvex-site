import {
  companyScreeningData,
  getFinalStatus,
  getStatusStyle,
} from "../../screening-data";

function getBusinessOverview(name: string, sector: string) {
  return `${name} is listed on the Casablanca Stock Exchange and operates in the ${sector} sector.`;
}

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
              We could not find details for this company in the current coverage universe.
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

  const finalStatus = getFinalStatus(company.aaoifi);
  const businessOverview = getBusinessOverview(company.name, company.sector);

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
              className={`h-fit self-start rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
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
            <p className="section-label">Business Overview</p>
            <p className="mt-3 leading-8 text-slate-700">{businessOverview}</p>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6">
            <p className="section-label">Sharia Screening - AAOIFI Standard</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="section-label">Source</p>
                <p className="mt-2 text-base font-medium text-slate-900">AAOIFI</p>
              </div>

              <span
                className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  finalStatus
                )}`}
              >
                {finalStatus}
              </span>
            </div>

            <div className="mt-6">
              <p className="section-label">Comment</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {company.aaoifi.comment}
              </p>
            </div>
          </div>

          <div className="mt-10 surface-subtle">
            <p className="section-label">Methodology Disclaimer</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              This screening is based on AAOIFI Sharia standards using publicly
              available financial and business activity information. The
              screening is provided for informational purposes only and does not
              constitute investment advice.
            </p>
          </div>

          <div className="mt-10">
            <a
              href="/screener"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 sm:w-auto"
            >
              Back to Screener
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
