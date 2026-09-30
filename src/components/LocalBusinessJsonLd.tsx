// Structured data that tells Google the business name, address, phone,
// and hours. Built from content/business.json, so it can never disagree
// with what the page shows.
import type { Business } from "@/lib/content";

const DAY: Record<string, string> = {
  Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th", Friday: "Fr", Saturday: "Sa", Sunday: "Su",
};

export function LocalBusinessJsonLd({ business }: { business: Business }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.phone,
    email: business.email,
    image: `${business.url}/images/hero-loaves.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    openingHours: business.hours
      .filter((h) => !h.closed && h.open && h.close)
      .map((h) => `${DAY[h.day]} ${h.open}-${h.close}`),
    servesCuisine: "Bakery",
    priceRange: "$",
  };
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps any text in business.json from closing the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
