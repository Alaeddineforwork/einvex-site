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

export default function ContactPage() {
  return (
    <main className="page-shell">
      <div className="page-container py-16">
        <section className="page-hero">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Let&apos;s connect around ethical investing</h1>
          <p className="page-intro">
            Whether you are an investor, potential partner, early user, or simply
            curious about EinveX, we would be glad to hear from you.
          </p>
        </section>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="surface-card">
            <h2 className="text-2xl font-semibold text-slate-900">Why reach out</h2>

            <ul className="mt-6 space-y-4 text-slate-700">
              <li>Investor conversations</li>
              <li>Partnership opportunities</li>
              <li>Product feedback</li>
              <li>Early access interest</li>
              <li>Media or event discussions</li>
            </ul>
          </div>

          <div className="surface-card">
            <h2 className="text-2xl font-semibold text-slate-900">Contact details</h2>

            <div className="mt-6 space-y-5 text-slate-700">
              <div>
                <p className="section-label">Startup</p>
                <p className="mt-1 text-base text-slate-900">EinveX</p>
              </div>

              <div>
                <p className="section-label">Email</p>
                <a
                  href="mailto:Alaeddine.bya@einvex.com"
                  className="mt-1 inline-flex break-all text-base text-slate-900 hover:text-emerald-700"
                >
                  Alaeddine.bya@einvex.com
                </a>
              </div>

              <div>
                <p className="section-label">Focus</p>
                <p className="mt-1 text-base text-slate-900">
                  Ethical investment screening
                </p>
              </div>

              <div>
                <p className="section-label">Market</p>
                <p className="mt-1 text-base text-slate-900">
                  Morocco, starting with the Casablanca Stock Exchange
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 surface-card">
          <h2 className="text-2xl font-semibold text-slate-900">Meet us at GITEX</h2>
          <p className="mt-4 leading-8 text-slate-700">
            EinveX is currently building its early product experience and
            engaging with investors, partners, and early supporters ahead of
            broader platform development.
          </p>

          <div className="mt-8 border-t border-slate-200/80 pt-6">
            <p className="text-sm font-medium text-slate-500">Follow EinveX</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-600">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-sm transition hover:text-slate-950"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/early-access"
              className="inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Request Early Access
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
