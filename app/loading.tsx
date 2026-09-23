export default function Loading() {
  return (
    <main className="grid min-h-svh place-items-center bg-black px-[var(--gutter)] text-white" aria-live="polite" aria-busy="true">
      <div className="text-center"><p className="eyebrow text-white/45">Timeless</p><p className="display mt-6 text-[clamp(3.5rem,8vw,8rem)]">Coming into view.</p></div>
    </main>
  );
}
