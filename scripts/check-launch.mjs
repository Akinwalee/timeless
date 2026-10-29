import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
let failed = false;
function check(name, valid, guidance) {
  console.log(`${valid ? "PASS" : "MISSING/INVALID"} ${name}${valid ? "" : ` — ${guidance}`}`);
  if (!valid) failed = true;
}

check("BREVO_API_KEY", Boolean(process.env.BREVO_API_KEY), "Add a server-only Brevo API key.");
for (const name of ["BREVO_LIST_ID", "BREVO_DOI_TEMPLATE_ID"]) {
  const value = Number(process.env[name]);
  check(name, Number.isSafeInteger(value) && value > 0, "Add the positive numeric ID from Brevo.");
}
let validOrigin = false;
try {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
  validOrigin = url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash;
} catch { /* Print the variable name, never its value. */ }
check("NEXT_PUBLIC_SITE_URL", validOrigin, "Set the verified production HTTPS origin, without a path/query.");

if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
  check("NEXT_PUBLIC_GA_MEASUREMENT_ID", /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""), "Add the GA4 measurement ID or leave analytics disabled.");
}
if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) console.log("REVIEW WhatsApp — verify the published Global Settings number override before launch.");
console.log("REVIEW Confirm Brevo template/sender, delivery to a controlled inbox, approved policies, real recipient, collection/alerts and rollback. This command does not contact providers.");
process.exitCode = failed ? 1 : 0;
