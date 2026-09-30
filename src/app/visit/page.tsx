import Image from "next/image";
import type { Metadata } from "next";
import { getBusiness, getPage } from "@/lib/content";
import { HoursTable } from "@/components/HoursTable";
import { OpenNow } from "@/components/OpenNow";

const page = getPage("visit");

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  const b = getBusiness();
  const tel = b.phone.replace(/[^\d+]/g, "");
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <header className="pt-12 md:pt-20">
        <p className="eyebrow">Visit</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.4rem)] font-[450]">Come by early</h1>
        <div className="mt-5 text-crust/80">
          <OpenNow hours={b.hours} timezone={b.timezone} />
        </div>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1fr]">
        <div className="rounded-[var(--radius-card)] border border-line bg-white/50 p-8 md:p-10">
          <h2 className="text-2xl font-[500]">Hours</h2>
          <div className="mt-6">
            <HoursTable hours={b.hours} />
          </div>
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-2xl font-[500]">Find us</h2>
            <address className="mt-4 not-italic leading-relaxed">
              {b.address.street}
              <br />
              {b.address.city}, {b.address.region} {b.address.postalCode}
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${tel}`} className="btn btn-primary">Call {b.phone}</a>
              <a href={`mailto:${b.email}`} className="btn btn-ghost">Email us</a>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-card)]">
          <Image src={page.data.image} alt={page.data.imageAlt} width={1536} height={1020} priority sizes="(min-width: 768px) 50vw, 100vw" className="h-full min-h-80 w-full object-cover" />
        </div>
      </div>

      <article className="prose prose-lg prose-bakery mt-16 max-w-3xl" dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
}
