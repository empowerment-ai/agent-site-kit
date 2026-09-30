import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import redirectsFile from "./content/redirects.json";

// The local builder (builder/, port 4000 by default) shows this site in an iframe.
// In development we allow exactly that origin to frame it; in production nobody can.
const BUILDER_ORIGINS = [
  `http://localhost:${process.env.BUILDER_PORT ?? 4000}`,
  `http://127.0.0.1:${process.env.BUILDER_PORT ?? 4000}`,
];

export default function config(phase: string): NextConfig {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    // Pin the project root so a stray lockfile in a parent folder can't confuse the build.
    turbopack: { root: process.cwd() },
    // Old URLs (for example from a WordPress site) -> new pages, as permanent redirects
    // (Next.js sends 308, which search engines treat like a 301). The list lives in
    // content/redirects.json; `npm run check` fails the build if a destination doesn't exist.
    async redirects() {
      return redirectsFile.redirects.map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      }));
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            {
              key: "Content-Security-Policy",
              value: dev ? `frame-ancestors 'self' ${BUILDER_ORIGINS.join(" ")}` : "frame-ancestors 'self'",
            },
            ...(dev ? [] : [{ key: "X-Frame-Options", value: "SAMEORIGIN" }]),
          ],
        },
      ];
    },
  };
}
