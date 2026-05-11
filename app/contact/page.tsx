import ContactForm from "./contact-form";

const socialLinks = [
  {
    href: "https://linkedin.com/company/einvex",
    label: "LinkedIn",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <path d="M2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/einve_x",
    label: "Instagram",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export const metadata = {
  title: "Contact - EinveX",
  description:
    "Get in touch with the EinveX team for questions, feedback, partnerships, and investor conversations.",
};

export default function ContactPage() {
  return (
    <main className="page-shell pt-[60px]">
      <div className="page-container py-8 md:py-10">
        <section className="page-hero grid-fade">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">
            Let&apos;s connect around ethical investing.
          </h1>
          <p className="page-intro">
            Questions, feedback, partnership requests, and investor interest
            are welcome. Tell us what you are working on and the team will
            follow up.
          </p>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card">
            <h2
              className="text-[20px] font-semibold tracking-tight"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
              }}
            >
              Send us a message
            </h2>
            <p
              className="mt-3 text-[14px] leading-7"
              style={{ color: "var(--text-dim)" }}
            >
              Use this form for product questions, partnership ideas,
              investor conversations, media requests, or feedback on the
              EinveX experience.
            </p>

            <ContactForm />
          </div>

          <div className="flex flex-col gap-5">
            <div className="surface-card">
              <h2
                className="text-[20px] font-semibold tracking-tight"
                style={{
                  color: "var(--text)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                Contact details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="section-label">Startup</p>
                  <p
                    className="mt-1 text-[14px]"
                    style={{ color: "var(--text)" }}
                  >
                    EinveX
                  </p>
                </div>

                <div>
                  <p className="section-label">Email</p>
                  <a
                    href="mailto:Alaeddine.bya@einvex.com"
                    className="mt-1 inline-flex break-all text-[14px] transition"
                    style={{ color: "#6ee7a7" }}
                  >
                    Alaeddine.bya@einvex.com
                  </a>
                </div>

                <div>
                  <p className="section-label">Focus</p>
                  <p
                    className="mt-1 text-[14px]"
                    style={{ color: "var(--text)" }}
                  >
                    Ethical investment screening
                  </p>
                </div>

                <div>
                  <p className="section-label">Market</p>
                  <p
                    className="mt-1 text-[14px]"
                    style={{ color: "var(--text)" }}
                  >
                    Morocco, starting with the Casablanca Stock Exchange
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card">
              <h2
                className="text-[20px] font-semibold tracking-tight"
                style={{
                  color: "var(--text)",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                Common reasons to contact us
              </h2>

              <ul
                className="mt-5 space-y-3 text-[14px] leading-7"
                style={{ color: "var(--text-dim)" }}
              >
                <li>Questions about EinveX tools and coverage</li>
                <li>Partnership opportunities</li>
                <li>Investor conversations</li>
                <li>Product feedback</li>
                <li>Media or event discussions</li>
              </ul>
            </div>

            <div className="surface-card">
              <p className="section-label">Follow EinveX</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-chip"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
