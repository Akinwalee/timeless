import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
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
