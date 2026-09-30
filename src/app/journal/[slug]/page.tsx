import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: { type: "article", images: post.image ? [post.image] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 pt-12 md:px-8 md:pt-20">
      <Link href="/journal" className="text-sm font-medium text-juniper">← Journal</Link>
      <p className="mt-8 text-sm text-muted">{formatDate(post.date)}</p>
      <h1 className="mt-3 text-[clamp(2.4rem,5.5vw,3.8rem)] font-[450]">{post.title}</h1>
      <p className="mt-5 text-xl text-crust/75">{post.description}</p>
      {post.image && (
        <div className="-mx-5 mt-10 overflow-hidden md:mx-0 md:rounded-[var(--radius-card)]">
          <Image src={post.image} alt={post.imageAlt ?? ""} width={1536} height={1020} priority sizes="(min-width: 768px) 768px, 100vw" className="aspect-[3/2] w-full object-cover" />
        </div>
      )}
      <div className="prose prose-lg prose-bakery mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
