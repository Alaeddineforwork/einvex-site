import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/screener", label: "Screener" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/early-access", label: "Early Access" },
];

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

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo/einvex-dark.svg"
                alt="EinveX"
                width={232}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Ethical investment screening with a clean, modern research
              experience.
            </p>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-500">Follow EinveX</p>
              <div className="mt-3 flex items-center gap-1 text-slate-500">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="rounded-full p-2 transition hover:text-slate-950"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-3 text-sm font-medium text-slate-600">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200/80 pt-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Focused on ethical investing insights for the Casablanca Stock Exchange.</p>
          <p>Built for clearer long-term research.</p>
        </div>
      </div>
    </footer>
  );
}
