import Image from "next/image";
import type { Metadata } from "next";
import { getPage } from "@/lib/content";

const page = getPage("about");

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid gap-12 pt-12 md:grid-cols-[1fr_1.1fr] md:gap-16 md:pt-20">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.4rem)] font-[450]">Bread that takes its time</h1>
          <div className="mt-8 overflow-hidden rounded-[var(--radius-card)]">
            <Image src={page.data.image} alt={page.data.imageAlt} width={1536} height={1020} priority sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
        <article className="prose prose-lg prose-bakery max-w-none md:pt-24" dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </div>
  );
}
