const journeySteps = [
  {
    period: "2025",
    title: "Idea & Founding",
    description:
      "Recent IPOs on the Casablanca Stock Exchange triggered the original idea, and the EinveX concept was born from a real investor need.",
    highlight: false,
  },
  {
    period: "2026",
    title: "MVP Launch",
    description:
      "The first EinveX website MVP was built to introduce a structured screening experience focused on Casablanca Stock Exchange companies.",
    highlight: true,
  },
  {
    period: "2026",
    title: "GITEX AFRICA",
    description:
      "EinveX entered investor validation through Morocco 300 and used the platform to sharpen the product direction with real feedback.",
    highlight: true,
  },
  {
    period: "Future",
    title: "Full Platform",
    description:
      "The longer-term vision is a complete Sharia-compliant investment platform spanning stocks, real estate, startups, crowdfunding, and portfolio tools.",
    highlight: false,
  },
];

const teamMembers = [
  {
    name: "Alaeddine Bya",
    role: "Co-founder & CEO",
    email: "Alaeddine.bya@einvex.com",
    image: "/team/alaeddine-bya.png",
  },
  {
    name: "Walid Flifel",
    role: "Co-founder & CFO",
    email: "Walid.Flifel@einvex.com",
    image: "/team/walid-flifel.png",
  },
];

export default function AboutPage() {
  return (
    <main className="page-shell">
      <div className="page-container py-16">
        <section className="page-hero">
          <p className="eyebrow">About EinveX</p>
          <h1 className="page-title">Building a clearer path to ethical investing</h1>
          <p className="page-intro">
            EinveX is an ethical investment platform designed to help investors
            identify opportunities aligned with transparent screening principles,
            starting with companies listed on the Casablanca Stock Exchange.
          </p>
        </section>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="surface-card">
            <h2 className="text-2xl font-semibold text-slate-900">Our mission</h2>
            <p className="mt-4 leading-8 text-slate-700">
              We aim to make ethical investment screening more accessible,
              understandable, and relevant for investors looking for greater
              clarity in their decision-making process.
            </p>
          </div>

          <div className="surface-card">
            <h2 className="text-2xl font-semibold text-slate-900">Why Morocco first</h2>
            <p className="mt-4 leading-8 text-slate-700">
              We are starting with the Moroccan market because local investors
              need simple tools to explore listed companies through a more
              structured and ethical lens, especially within the Casablanca
              Stock Exchange ecosystem.
            </p>
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">
            What EinveX is building
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="surface-subtle">
              <h3 className="text-lg font-semibold text-slate-900">Screening</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                A simple interface to review whether listed companies align with
                defined screening principles.
              </p>
            </div>

            <div className="surface-subtle">
              <h3 className="text-lg font-semibold text-slate-900">Transparency</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                A clearer way to understand company status, screening notes, and
                supporting rationale.
              </p>
            </div>

            <div className="surface-subtle">
              <h3 className="text-lg font-semibold text-slate-900">Future Growth</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Over time, EinveX aims to expand into broader ethical investment
                opportunities and tools.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">
            How EinveX Started
          </h2>
          <div className="mt-6 max-w-4xl space-y-5 text-base leading-8 text-slate-700">
            <p>
              When the recent IPOs launched on the Casablanca Stock Exchange, we
              wanted to invest.
            </p>
            <p>
              But the first question that came to mind was not{" "}
              <span className="font-medium text-slate-950">
                &quot;Is this profitable?&quot;
              </span>
            </p>
            <p>
              It was{" "}
              <span className="font-medium text-slate-950">
                &quot;Is this Sharia-compliant?&quot;
              </span>
            </p>
            <p>
              We started looking for a reliable solution to help us invest with
              confidence. However, we could not find a clear, structured, and
              trustworthy screening solution focused on Moroccan stocks.
            </p>
            <p>
              That is when we decided to build one ourselves. Together, we
              launched EinveX, an ethical investment screening platform designed
              to help investors make confident, values-aligned decisions.
            </p>
            <p>
              Today, EinveX starts with the Casablanca Stock Exchange, with a
              broader vision to become a complete Sharia-compliant investment
              platform.
            </p>
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">EinveX Journey</h2>

          <div className="mt-8 space-y-0">
            {journeySteps.map((step, index) => {
              const isLastStep = index === journeySteps.length - 1;

              return (
                <div
                  key={`${step.period}-${step.title}`}
                  className="grid grid-cols-[28px_1fr] gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-3.5 w-3.5 rounded-full border ${
                        step.highlight
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-slate-300 bg-white"
                      }`}
                    />
                    {!isLastStep ? (
                      <span className="mt-2 h-full min-h-16 w-px bg-slate-200" />
                    ) : null}
                  </div>

                  <div className="pb-8">
                    <div
                    className={`rounded-2xl border px-4 py-4 sm:px-5 ${
                        step.highlight
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-slate-200/80 bg-white/80"
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {step.period}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">Meet the Team</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div key={member.email} className="surface-subtle">
                <div className="mb-6 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-48 w-36 rounded-xl border border-gray-200 object-cover sm:h-56 sm:w-44"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                    {member.role}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 inline-flex max-w-full break-all text-sm text-emerald-700 transition hover:text-emerald-800"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">Our current stage</h2>
          <p className="mt-4 leading-8 text-slate-700">
            EinveX is currently in its early stage, focused on validating the
            product experience, refining the screening framework, and engaging
            with early users, partners, and investors.
          </p>
        </div>
      </div>
    </main>
  );
}
