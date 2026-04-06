"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/screener", label: "Screener" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-12 md:py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/einvex-dark.svg"
            alt="EinveX"
            width={215}
            height={52}
            className="h-9 w-auto md:h-[52px]"
            priority
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
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

          <Link
            href="/early-access"
            className="shrink-0 whitespace-nowrap rounded-full bg-emerald-700 px-2.5 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-800 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Early Access
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200/70 px-4 py-2 sm:px-6 md:hidden">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border px-3 py-1.5 transition ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white/80 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
