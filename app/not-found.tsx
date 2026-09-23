import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="site-shell flex min-h-svh flex-col justify-center py-32">
      <p className="eyebrow text-black/45">404 / Outside the frame</p>
      <h1 className="display mt-7 max-w-[9ch] text-[clamp(5rem,13vw,14rem)]">Nothing held here.</h1>
      <Link href="/" className="text-link mt-12 self-start"><ArrowLeft size={15} /> Return home</Link>
    </main>
  );
}
