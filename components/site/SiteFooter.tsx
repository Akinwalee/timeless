import Link from "next/link";
import { Newsletter } from "./Newsletter";
import { Wordmark } from "./Wordmark";
import type { GlobalSettings } from "@/lib/content";

export function SiteFooter({ settings }: { settings: GlobalSettings }) {
  return (
    <footer className="bg-black px-[var(--gutter)] pb-8 pt-24 text-white md:pt-36">
      <div className="grid gap-20 border-b border-white/25 pb-20 md:grid-cols-2">
        <div><p className="eyebrow mb-5 text-white/55">Keep in motion</p><h2 className="display max-w-xl text-[clamp(3.7rem,7vw,7.5rem)]">Stay close.</h2><p className="mt-5 max-w-sm text-sm text-white/60">Drops, stories and things worth knowing before they travel wider.</p></div>
        <div className="self-end"><Newsletter inverse /></div>
      </div>
      <div className="grid gap-14 py-16 text-[.72rem] uppercase tracking-[.12em] md:grid-cols-[1fr_auto_auto_auto]">
        <Wordmark className="text-[clamp(3.8rem,8vw,8rem)] normal-case tracking-normal" />
        <div className="grid content-start gap-3">{settings.navigation.map((link) => <Link key={link.href} href={link.href} target={link.external ? "_blank" : undefined}>{link.label}</Link>)}</div>
        <div className="grid content-start gap-3">{settings.socialLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}<a href={`mailto:${settings.contactEmail}`}>Contact</a></div>
        <div className="grid content-start gap-3 text-white/55"><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Privacy</a><a href="#">Terms</a></div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/15 pt-5 text-[.62rem] uppercase tracking-[.13em] text-white/50 md:flex-row md:justify-between"><span>© 2026 Timeless</span><span>Style Without Limit.</span><span>Proudly Nigerian</span></div>
    </footer>
  );
}
