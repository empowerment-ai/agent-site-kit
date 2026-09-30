import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getBusiness, getMenu, getPage, getPosts, getSections, formatPrice, formatDate } from "@/lib/content";
import { OpenNow } from "@/components/OpenNow";
import { HoursTable } from "@/components/HoursTable";

const page = getPage("home");

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const business = getBusiness();
  const sections = getSections("home");
  const daily = getMenu()
    .flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })))
    .filter((i) => i.daily)
    .slice(0, 6);
  const posts = getPosts().slice(0, 2);
  const d = page.data;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:gap-14 md:px-8 md:pb-24 md:pt-16">
        <div>
          <p className="eyebrow">{d.heroEyebrow}</p>
          <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.2rem)] font-[450]">
            {d.heroTitle}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-crust/80">{d.heroBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/menu" className="btn btn-primary">See today&rsquo;s menu</Link>
            <Link href="/visit" className="btn btn-ghost">Hours &amp; directions</Link>
          </div>
          <div className="mt-8 text-crust/80">
            <OpenNow hours={business.hours} timezone={business.timezone} />
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[var(--radius-card)] shadow-[0_30px_60px_-30px_rgba(42,28,19,0.45)]">
            <Image
              src={d.heroImage}
              alt={d.heroImageAlt}
              width={1536}
              height={1020}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] h-full w-full object-cover md:aspect-[4/5]"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 rotate-[-4deg] rounded-full bg-ember px-5 py-2.5 font-display text-lg italic text-flour shadow-lg md:-left-6">
            Out of the oven at 7
          </div>
        </div>
      </section>

      {/* Three sections from content/pages/home.md */}
      <section className="border-y border-line bg-crumb/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8 md:py-20">
          {sections.map((s, i) => (
            <article key={s.heading}>
              <p className="font-display text-sm italic text-rye">0{i + 1}</p>
              <h2 className="mt-2 text-[1.75rem] font-[500]">{s.heading}</h2>
              <div className="mt-3 text-crust/80 [&_p+p]:mt-3" dangerouslySetInnerHTML={{ __html: s.html }} />
            </article>
          ))}
        </div>
      </section>

      {/* Today's case */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:px-8 md:py-24">
        <div className="overflow-hidden rounded-[var(--radius-card)]">
          <Image
            src="/images/pastry-case.jpg"
            alt="Golden butter croissants and cardamom buns lined up in a glass bakery case"
            width={1536}
            height={1020}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Every open day</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-[450]">In the case this morning</h2>
          <ul className="mt-8 space-y-5">
            {daily.map((item) => (
              <li key={item.name}>
                <div className="flex items-end">
                  <span className="font-display text-xl">{item.name}</span>
                  <span className="leader" aria-hidden />
                  <span className="tabular-nums font-medium">{formatPrice(item.price)}</span>
                </div>
                <p className="mt-1 text-[0.97rem] text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
          <Link href="/menu" className="mt-9 inline-block font-medium text-juniper underline decoration-juniper/30 underline-offset-4 hover:decoration-juniper">
            The full menu, with coffee →
          </Link>
        </div>
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <h2 className="text-[clamp(1.9rem,3.5vw,2.6rem)] font-[450]">From the journal</h2>
          <Link href="/journal" className="shrink-0 text-sm font-medium text-juniper">All posts →</Link>
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.slug} href={`/journal/${p.slug}`} className="group block">
              <p className="text-sm text-muted">{formatDate(p.date)}</p>
              <h3 className="mt-2 text-2xl font-[500] group-hover:text-juniper">{p.title}</h3>
              <p className="mt-2 text-crust/75">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="mx-auto mt-20 max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 rounded-[var(--radius-card)] bg-juniper p-8 text-juniper-ink md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow !text-[#b9cdbf]">Visit</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-[450]">
              {business.address.street}, {business.address.city}
            </h2>
            <p className="mt-4 max-w-sm text-juniper-ink/80">
              A block up from the river. Call before 10am and we&rsquo;ll hold a loaf with your name on it.
            </p>
            <Link href="/visit" className="btn mt-8 bg-flour text-crust hover:bg-white">Directions &amp; details</Link>
          </div>
          <div className="text-juniper-ink/90">
            <HoursTable hours={business.hours} />
          </div>
        </div>
      </section>
    </>
  );
}
