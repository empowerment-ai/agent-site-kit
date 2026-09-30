import Link from "next/link";
import type { Business } from "@/lib/content";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/visit", label: "Visit" },
];

export function Header({ business }: { business: Business }) {
  const tel = business.phone.replace(/[^\d+]/g, "");
  return (
    <>
      {business.announcement?.show && (
        <div className="bg-juniper text-juniper-ink text-center text-sm px-4 py-2.5">
          {business.announcement.text}
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-flour/90 backdrop-blur supports-[backdrop-filter]:bg-flour/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/" className="font-display text-[1.45rem] leading-none tracking-tight" aria-label={`${business.name} home`}>
            Juniper <span className="italic text-rye">&amp;</span> Rye
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-7 text-[0.97rem] md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-crust/80 transition-colors hover:text-crust">
                {n.label}
              </Link>
            ))}
          </nav>
          <a href={`tel:${tel}`} className="btn btn-primary !px-4 !py-2 text-sm">
            <span aria-hidden>☎</span>
            <span className="hidden sm:inline">{business.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
        <nav aria-label="Main mobile" className="flex justify-center gap-6 border-t border-line/60 px-5 py-2.5 text-sm md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-crust/80">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
