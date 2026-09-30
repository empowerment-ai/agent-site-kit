import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Journal | Baking Notes from Juniper & Rye Bakehouse" },
  description: "Notes from the bakery in Harbor Falls: how we make our sourdough, how to keep bread fresh at home, and what's coming out of the oven this season.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const posts = getPosts();
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <header className="pt-12 md:pt-20">
        <p className="eyebrow">Journal</p>
        <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.4rem)] font-[450]">Notes from the bench</h1>
      </header>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/journal/${p.slug}`} className="group block">
            {p.image && (
              <div className="overflow-hidden rounded-[var(--radius-card)]">
                <Image
                  src={p.image}
                  alt={p.imageAlt ?? ""}
                  width={1536}
                  height={1020}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <p className="mt-5 text-sm text-muted">{formatDate(p.date)}</p>
            <h2 className="mt-2 text-[1.9rem] font-[500] group-hover:text-juniper">{p.title}</h2>
            <p className="mt-2 text-crust/75">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
