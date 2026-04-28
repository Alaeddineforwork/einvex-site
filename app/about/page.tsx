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

export const metadata = {
  title: "About — EinveX",
  description:
    "EinveX is an ethical investment screening platform for the Casablanca Stock Exchange. Read the founding story, mission, and team.",
};

export default function AboutPage() {
  return (
    <main className="page-shell pt-[60px]">
      <div className="page-container py-8 md:py-10">
        <section className="page-hero grid-fade">
          <p className="eyebrow">About EinveX</p>
          <h1 className="page-title">A clearer path to ethical investing.</h1>
          <p className="page-intro">
            EinveX is an ethical investment platform designed to help investors
            identify opportunities aligned with transparent screening principles,
            starting with companies listed on the Casablanca Stock Exchange.
          </p>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="surface-card">
            <h2
              className="text-[20px] font-semibold tracking-tight"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
              }}
            >
              Our mission
            </h2>
            <p
              className="mt-3 text-[14px] leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              We aim to make ethical investment screening more accessible,
              understandable, and relevant for investors looking for greater
              clarity in their decision-making process.
            </p>
          </div>

          <div className="surface-card">
            <h2
              className="text-[20px] font-semibold tracking-tight"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
              }}
            >
              Why Morocco first
            </h2>
            <p
              className="mt-3 text-[14px] leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              We are starting with the Moroccan market because local investors
              need simple tools to explore listed companies through a more
              structured and ethical lens, especially within the Casablanca
              Stock Exchange ecosystem.
            </p>
          </div>
        </div>

        <div className="mt-5 surface-card">
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            What EinveX is building
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="surface-subtle">
              <h3
                className="text-[15px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                Screening
              </h3>
              <p
                className="mt-2 text-[13px] leading-6"
                style={{ color: "var(--text-dim)" }}
              >
                A simple interface to review whether listed companies align with
                defined screening principles.
              </p>
            </div>

            <div className="surface-subtle">
              <h3
                className="text-[15px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                Transparency
              </h3>
              <p
                className="mt-2 text-[13px] leading-6"
                style={{ color: "var(--text-dim)" }}
              >
                A clearer way to understand company status, screening notes, and
                supporting rationale.
              </p>
            </div>

            <div className="surface-subtle">
              <h3
                className="text-[15px] font-semibold"
                style={{ color: "var(--text)" }}
              >
                Future Growth
              </h3>
              <p
                className="mt-2 text-[13px] leading-6"
                style={{ color: "var(--text-dim)" }}
              >
                Over time, EinveX aims to expand into broader ethical investment
                opportunities and tools.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 surface-card">
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            How EinveX started
          </h2>
          <div
            className="mt-5 max-w-4xl space-y-4 text-[14px] leading-7"
            style={{ color: "var(--text-dim)" }}
          >
            <p>
              When the recent IPOs launched on the Casablanca Stock Exchange, we
              wanted to invest.
            </p>
            <p>
              But the first question that came to mind was not{" "}
              <span style={{ color: "var(--text)", fontWeight: 500 }}>
                &quot;Is this profitable?&quot;
              </span>
            </p>
            <p>
              It was{" "}
              <span style={{ color: "var(--text)", fontWeight: 500 }}>
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

        <div className="mt-5 surface-card">
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            EinveX journey
          </h2>

          <div className="mt-6 space-y-0">
            {journeySteps.map((step, index) => {
              const isLastStep = index === journeySteps.length - 1;

              return (
                <div
                  key={`${step.period}-${step.title}`}
                  className="grid grid-cols-[28px_1fr] gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className="mt-1 h-3.5 w-3.5 rounded-full border"
                      style={{
                        borderColor: step.highlight
                          ? "rgba(34,197,94,0.50)"
                          : "var(--line-strong)",
                        background: step.highlight
                          ? "#22c55e"
                          : "var(--bg-elev)",
                        boxShadow: step.highlight
                          ? "0 0 12px rgba(34,197,94,0.4)"
                          : undefined,
                      }}
                    />
                    {!isLastStep && (
                      <span
                        className="mt-2 h-full min-h-16 w-px"
                        style={{ background: "var(--line)" }}
                      />
                    )}
                  </div>

                  <div className="pb-6">
                    <div
                      className="rounded-xl border px-4 py-4 sm:px-5"
                      style={{
                        borderColor: step.highlight
                          ? "rgba(34,197,94,0.30)"
                          : "var(--line)",
                        background: step.highlight
                          ? "var(--accent-soft)"
                          : "var(--bg-elev)",
                      }}
                    >
                      <p
                        className="text-[10.5px] font-semibold uppercase tracking-[0.22em]"
                        style={{
                          color: step.highlight ? "#86efac" : "var(--text-mute)",
                        }}
                      >
                        {step.period}
                      </p>
                      <h3
                        className="mt-2 text-[15.5px] font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="mt-2 text-[13px] leading-6"
                        style={{ color: "var(--text-dim)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 surface-card">
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            Meet the team
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div key={member.email} className="surface-subtle">
                <div className="mb-5 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-48 w-36 rounded-xl object-cover sm:h-56 sm:w-44"
                    style={{ border: "1px solid var(--line-strong)" }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="mt-4 text-center">
                  <h3
                    className="text-[17px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--text-mute)" }}
                  >
                    {member.role}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-3 inline-flex max-w-full break-all text-[13px] transition"
                    style={{ color: "#6ee7a7" }}
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 surface-card">
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
            }}
          >
            Our current stage
          </h2>
          <p
            className="mt-3 text-[14px] leading-7"
            style={{ color: "var(--text-dim)" }}
          >
            EinveX is currently in its early stage, focused on validating the
            product experience, refining the screening framework, and engaging
            with early users, partners, and investors.
          </p>
        </div>
      </div>
    </main>
  );
}
