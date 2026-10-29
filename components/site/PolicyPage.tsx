import Link from "next/link";
import { policies, type PolicyKey } from "@/lib/policies";
import { policyLinks } from "@/lib/site";
import { normalizeWhatsAppNumber } from "@/lib/bag";
import { getGlobalSettings } from "@/sanity/lib/fetch";

export async function PolicyPage({ name }: { name: PolicyKey }) {
  const policy = policies[name];
  const settings = await getGlobalSettings();
  const number = normalizeWhatsAppNumber(settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  return (
    <main id="main-content" className="site-shell pb-[var(--section)]">
      <header className="page-intro px-0">
        <p className="eyebrow text-muted">Customer information · Updated 28 October 2026</p>
        <h1 className="mt-7 max-w-4xl text-[clamp(3rem,7vw,6rem)] leading-[1] tracking-[-.05em]">{policy.title}</h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{policy.intro}</p>
      </header>
      <div className="max-w-3xl space-y-12">
        {policy.sections.map(section => <section key={section.title}><h2 className="text-2xl tracking-[-.03em]">{section.title}</h2><div className="mt-5 space-y-4 text-base leading-relaxed text-muted">{section.paragraphs.map(copy => <p key={copy}>{copy}</p>)}</div></section>)}
        <section className="border-t border-black/20 pt-10"><h2 className="text-2xl">Contact Timeless</h2><div className="mt-5 flex flex-wrap gap-6">{number && <a className="text-link" href={`https://wa.me/${number}`} target="_blank" rel="noreferrer">Contact on WhatsApp</a>}<a className="text-link" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div></section>
        <nav aria-label="Customer information" className="flex flex-wrap gap-6 border-t border-black/20 pt-10 text-sm">{policyLinks.map(link => <Link key={link.href} href={link.href} className="underline underline-offset-4">{link.label}</Link>)}</nav>
      </div>
    </main>
  );
}
