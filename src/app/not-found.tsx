import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-[450]">This page sold out.</h1>
      <p className="mt-4 text-crust/75">It might have moved. Try the menu, or come see us in person.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/menu" className="btn btn-primary">See the menu</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
