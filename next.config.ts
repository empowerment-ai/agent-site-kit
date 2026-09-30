import type { NextConfig } from "next";
import redirectsFile from "./content/redirects.json";

const nextConfig: NextConfig = {
  // Old URLs (for example from a WordPress site) -> new pages, as permanent 301s.
  // The list lives in content/redirects.json; `npm run check` fails the build
  // if any destination doesn't exist.
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
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
