export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://weartimeless.xyz";
  const url = new URL(configured);
  if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "localhost")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS origin.");
  }
  return url.origin;
}

export const policyLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
