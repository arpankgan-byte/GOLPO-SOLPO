import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal"

export default function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] text-white">
      <div className="absolute inset-0 opacity-50 [background:radial-gradient(ellipse_at_50%_45%,rgba(27,137,222,.22),transparent_50%)]" />
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
          <span className="text-sm font-medium tracking-[.18em] text-white/75">GOLPO SOLPO</span>
        </div>
        <span className="rounded-full border border-white/15 bg-white/[.06] px-3 py-1 text-[11px] uppercase tracking-[.16em] text-white/55 backdrop-blur">WebGL 2 · Looping</span>
      </header>
      <section className="relative z-[1] flex min-h-screen items-center justify-center px-4 py-20 sm:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 shadow-[0_35px_120px_rgba(0,0,0,.55)]">
          <GlassIconReveal
            logo="/logo-home.webp"
            label="Golpo Solpo liquid-glass logo reveal"
            look="dark"
            background="#05070c"
            originalColors
            iconPlate={false}
            keepPlate={false}
            tileSize={520}
            logoScale={0.86}
            finalScale={0.96}
            loop
            hold={0.8}
            className="h-[72svh] min-h-[440px] w-full sm:h-[78svh]"
          />
        </div>
      </section>
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center px-4 pb-5 text-center text-xs tracking-wide text-white/45">
        Original Golpo Solpo artwork · Reduced-motion settings respected
      </footer>
    </main>
  )
}
