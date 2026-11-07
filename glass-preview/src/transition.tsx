import React from "react"
import ReactDOM from "react-dom/client"
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal"
import "./index.css"

const token = new URLSearchParams(window.location.search).get("token")

function Transition() {
  const notifiedRef = React.useRef(false)
  const finish = React.useCallback(() => {
    if (notifiedRef.current) return
    notifiedRef.current = true
    try {
      window.parent.postMessage({ gsGlassTransitionDone: true, token }, "*")
    } catch {
      // The host owns the transition and will apply its timeout fallback.
    }
  }, [])

  return (
    <main className="fixed inset-0 grid place-items-center overflow-hidden bg-[#05070c]">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(ellipse_at_50%_50%,rgba(25,137,222,.18),transparent_58%)]" />
      <GlassIconReveal
        logo="/logo-home.webp"
        label="Golpo Solpo liquid-glass page transition"
        look="dark"
        background="#05070c"
        originalColors
        iconPlate={false}
        keepPlate={false}
        tileSize={560}
        logoScale={0.92}
        finalScale={1.04}
        loop={false}
        hold={0}
        tuning={{ present: 1.65, glide: 1.25, sheen: 1, lightTurn: 0.9 }}
        className="absolute inset-0 h-full w-full"
        onComplete={finish}
      />
    </main>
  )
}

ReactDOM.createRoot(document.getElementById("transition-root")!).render(<Transition />)
