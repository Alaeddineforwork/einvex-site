import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    href: "https://linkedin.com/company/einvex",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-12 md:py-4">
          <div className="flex items-center">
            <Image
              src="/logo/einvex-dark.svg"
              alt="EinveX"
              width={215}
              height={52}
              className="h-9 w-auto md:h-[52px]"
              priority
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
              <Link href="/about" className="hover:text-slate-900">
                About
              </Link>
              <a href="#how-it-works" className="hover:text-slate-900">
                How it works
              </a>
              <Link href="/contact" className="hover:text-slate-900">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-0.5 text-slate-500 sm:gap-1">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="rounded-full p-1.5 transition hover:text-slate-900 sm:p-2"
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <a
              href="#contact"
              className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="sm:hidden">Join</span>
              <span className="hidden sm:inline">Join Early Access</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 py-2 sm:px-6 md:hidden">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            <Link href="/about" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:text-slate-900">
              About
            </Link>
            <a href="#how-it-works" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:text-slate-900">
              How it works
            </a>
            <Link href="/contact" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:text-slate-900">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 md:px-12 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-14">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Ethical investing, reimagined
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
              Invest with confidence.
              <br />
              Invest ethically.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              EinveX helps investors explore ethical investment opportunities,
              starting with a screening experience for companies listed on the
              Casablanca Stock Exchange.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/screener"
                className="rounded-full bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Explore Screener
              </a>
              <a
                href="#about"
                className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md sm:max-w-lg">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.4)]">
              <Image
                src="/hero/hero-dark.png"
                alt="EinveX platform preview"
                width={1200}
                height={1200}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-12 md:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">What is EinveX?</h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              EinveX is an ethical investment platform designed to help users
              identify investment opportunities aligned with clear screening
              principles. Our first focus is the Moroccan market through a
              simple and accessible screening experience.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-12 md:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              The problem we solve
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              Many investors are interested in ethical investing, but they often
              lack a clear and simple way to evaluate whether a company aligns
              with their principles. EinveX aims to make that process easier,
              more transparent, and more accessible.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-12 md:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">How it works</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-emerald-700">Step 1</div>
              <h3 className="mt-3 text-xl font-semibold">Select a company</h3>
              <p className="mt-3 text-slate-600">
                Search or browse listed companies through a simple screening
                interface.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-emerald-700">Step 2</div>
              <h3 className="mt-3 text-xl font-semibold">Review screening status</h3>
              <p className="mt-3 text-slate-600">
                See whether a company is compliant, non-compliant, or under
                review based on the framework used.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-emerald-700">Step 3</div>
              <h3 className="mt-3 text-xl font-semibold">Make better decisions</h3>
              <p className="mt-3 text-slate-600">
                Use a clearer and more structured view to support your
                investment research.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 md:px-12 md:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Discover ethical investing in Morocco
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            EinveX is building a more accessible way to explore ethical
            investment opportunities, starting with the Casablanca Stock
            Exchange.
          </p>
          <div className="mt-8">
            <a
              href="/early-access"
              className="inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Join Early Access
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
