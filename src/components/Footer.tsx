import Link from "next/link";
import type { Business } from "@/lib/content";
import { HoursTable } from "./HoursTable";

export function Footer({ business }: { business: Business }) {
  const a = business.address;
  return (
    <footer className="mt-24 bg-crust text-flour">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl">
            Juniper <span className="italic text-[#d9a47c]">&amp;</span> Rye
          </p>
          <p className="mt-3 max-w-xs text-flour/70">{business.tagline}</p>
          <address className="mt-6 not-italic text-flour/85">
            {a.street}
            <br />
            {a.city}, {a.region} {a.postalCode}
            <br />
            <a className="underline decoration-flour/30 underline-offset-4 hover:decoration-flour" href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>
              {business.phone}
            </a>
          </address>
        </div>
        <div>
          <p className="eyebrow !text-[#d9a47c]">Hours</p>
          <div className="mt-4 text-flour/85">
            <HoursTable hours={business.hours} compact />
          </div>
        </div>
        <div>
          <p className="eyebrow !text-[#d9a47c]">Around the bakery</p>
          <ul className="mt-4 space-y-2 text-flour/85">
            <li><Link href="/menu" className="hover:text-flour">Menu</Link></li>
            <li><Link href="/about" className="hover:text-flour">Our story</Link></li>
            <li><Link href="/journal" className="hover:text-flour">Journal</Link></li>
            <li><Link href="/visit" className="hover:text-flour">Hours &amp; directions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-flour/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-flour/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            {business.fictional ? "A demo site for a fictional bakery. Photos are AI-generated. " : ""}
            © {new Date().getFullYear()} {business.name}
          </p>
          <p>
            Built with Claude Code and run by an AI agent.{" "}
            <a
              href="https://empowerment-ai.com/?utm_source=agent-site-kit&utm_medium=demo-site&utm_campaign=footer-credit"
              className="text-flour/80 underline decoration-flour/30 underline-offset-4 hover:text-flour"
            >
              How it works: Empowerment AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
