import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.VERCEL_ENV || process.env.NODE_ENV || "development" },
  poweredByHeader: false,
  images: {
    qualities: [75, 85],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}/**` : "/images/**" }],
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // Restrict embedding and base URLs without breaking Next inline hydration or Studio.
      // A strict script policy needs per-response nonces and deployment-specific vendor origins.
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
    ];
    return [{ source: "/:path*", headers }];
  },
  async redirects() {
    return [
      {
        source: "/journal/in-the-wild-akure",
        destination: "/in-the-wild",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
