import Image from "next/image";
import type { Metadata } from "next";
import { getMenu, getHoliday, getPage, formatPrice, formatMonthDay, formatDateRange } from "@/lib/content";

const page = getPage("menu");

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const sections = getMenu();
  const holiday = getHoliday();
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
        {holiday && (
          <a href="#holiday" className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-crust/80 hover:bg-crumb hover:text-crust">
            Holiday
          </a>
        )}
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-crust/80 hover:bg-crumb hover:text-crust">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {holiday && (
          <section id="holiday" aria-labelledby="holiday-title" className="scroll-mt-40 rounded-[var(--radius-card)] bg-juniper px-6 py-10 text-juniper-ink md:px-12 md:py-14">
            <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
              <div>
                <p className="eyebrow !text-juniper-ink/85">Seasonal</p>
                <h2 id="holiday-title" className="mt-4 text-[clamp(2.2rem,5vw,3.2rem)] font-[450]">{holiday.title}</h2>
                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-juniper-ink/25 pt-6">
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-juniper-ink/85">Orders open</dt>
                    <dd className="mt-1 font-display text-[1.5rem] italic leading-tight">{formatMonthDay(holiday.preordersOpen)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-juniper-ink/85">Pickup</dt>
                    <dd className="mt-1 font-display text-[1.5rem] italic leading-tight">{formatDateRange(holiday.pickupStart, holiday.pickupEnd)}</dd>
                  </div>
                </dl>
              </div>
              <ol className="self-end">
                {holiday.items.map((item, i) => (
                  <li key={item.name} className="flex items-baseline gap-5 border-b border-juniper-ink/25 py-5 first:pt-0 last:border-b-0 last:pb-0">
                    <span className="w-7 shrink-0 font-display text-lg italic tabular-nums text-juniper-ink/85" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <div className="flex items-end">
                        <span className="font-display text-[clamp(1.6rem,3.5vw,2.1rem)] leading-tight">{item.name}</span>
                        {item.price !== undefined && (
                          <>
                            <span className="leader !border-juniper-ink/30" aria-hidden />
                            <span className="tabular-nums font-medium">{formatPrice(item.price)}</span>
                          </>
                        )}
                      </div>
                      {item.description && <p className="mt-1 text-juniper-ink/85">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
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
