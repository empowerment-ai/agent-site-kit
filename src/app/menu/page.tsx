import Image from "next/image";
import type { Metadata } from "next";
import { getMenu, getPage, formatPrice } from "@/lib/content";

const page = getPage("menu");

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const sections = getMenu();
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <header className="grid items-end gap-10 pb-12 pt-12 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <p className="eyebrow">Menu</p>
          <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.6rem)] font-[450]">What we&rsquo;re baking</h1>
          <p className="mt-5 max-w-xl text-lg text-crust/80">{page.data.intro}</p>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-card)]">
          <Image src={page.data.image} alt={page.data.imageAlt} width={1536} height={1020} priority sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[3/2] w-full object-cover" />
        </div>
      </header>

      <nav aria-label="Menu sections" className="sticky top-[73px] z-20 -mx-5 flex gap-2 overflow-x-auto border-y border-line bg-flour/95 px-5 py-3 backdrop-blur md:mx-0 md:rounded-full md:border md:px-3">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-crust/80 hover:bg-crumb hover:text-crust">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-40 grid gap-8 md:grid-cols-[16rem_1fr]">
            <div>
              <h2 className="text-[2.1rem] font-[450]">{s.title}</h2>
              {s.note && <p className="mt-2 text-muted">{s.note}</p>}
            </div>
            <ul className="space-y-6">
              {s.items.map((item) => (
                <li key={item.name}>
                  <div className="flex items-end">
                    <span className="font-display text-[1.35rem]">{item.name}</span>
                    <span className="leader" aria-hidden />
                    <span className="tabular-nums font-medium">{formatPrice(item.price)}</span>
                  </div>
                  <p className="mt-1 text-muted">
                    {item.description}
                    {item.days && (
                      <span className="ml-2 inline-block rounded-full bg-crumb px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-rye">
                        {item.days.join(" & ")} only
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
