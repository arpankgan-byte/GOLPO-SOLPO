import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef } from "react";

/**
 * EyeTracker Component
 * An interactive, spring-animated SVG character that watches the cursor
 * with natural foreshortening, eye blinking, and shape morphing.
 * Attribution: Bencho (https://bencho.dev)
 * License: MIT
 */
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
const stillness = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const R = 50;
type Eye = { w: number; h: number; r: number };
const STYLES: Record<string, Eye> = {
  Slant: { w: 9, h: 15, r: 4.5 }, Dots: { w: 11, h: 11, r: 5.5 }, Squares: { w: 12, h: 12, r: 3.5 },
};
const GAP = 0.19;
const TILT = 64;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const SHAPES: Record<string, string> = {
  Ball: "M50 0 A50 50 0 1 1 49.99 0 Z",
  Circle: "M50 7 A43 43 0 1 1 49.99 7 Z",
  Cube: "M30 6 H70 A24 24 0 0 1 94 30 V70 A24 24 0 0 1 70 94 H30 A24 24 0 0 1 6 70 V30 A24 24 0 0 1 30 6 Z",
  Pill: "M34 17 H66 A33 33 0 0 1 66 83 H34 A33 33 0 0 1 34 17 Z",
  Hexagon: "M59.53 8.50 L81.18 21.00 Q90.70 26.50 90.70 37.50 L90.70 62.50 Q90.70 73.50 81.18 79.00 L59.53 91.50 Q50.00 97.00 40.47 91.50 L18.82 79.00 Q9.30 73.50 9.30 62.50 L9.30 37.50 Q9.30 26.50 18.82 21.00 L40.47 8.50 Q50.00 3.00 59.53 8.50 Z",
  "Hex flat": "M91.50 59.53 L79.00 81.18 Q73.50 90.70 62.50 90.70 L37.50 90.70 Q26.50 90.70 21.00 81.18 L8.50 59.53 Q3.00 50.00 8.50 40.47 L21.00 18.82 Q26.50 9.30 37.50 9.30 L62.50 9.30 Q73.50 9.30 79.00 18.82 L91.50 40.47 Q97.00 50.00 91.50 59.53 Z",
};
const RAYS = 120;
const radii = new Map<string, number[]>();
function measure(shape: string): number[] {
  const hit = radii.get(shape); if (hit) return hit;
  if (typeof document === "undefined") return [];
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", "0 0 100 100"); svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  const path = document.createElementNS(ns, "path"); path.setAttribute("d", SHAPES[shape] ?? SHAPES.Ball); svg.appendChild(path); document.body.appendChild(svg);
  const pt = svg.createSVGPoint(); const out: number[] = [];
  for (let i = 0; i < RAYS; i++) { const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2; let lo = 0, hi = 60;
    for (let k = 0; k < 16; k++) { const mid = (lo + hi) / 2; pt.x = 50 + Math.cos(a) * mid; pt.y = 50 + Math.sin(a) * mid; if (path.isPointInFill(pt)) lo = mid; else hi = mid; }
    out.push(lo);
  }
  svg.remove(); radii.set(shape, out); return out;
}
function outline(r: number[]): string { let d = ""; r.forEach((v, i) => { const a = (i / r.length) * Math.PI * 2 - Math.PI / 2; d += `${i ? "L" : "M"}${(50 + Math.cos(a) * v).toFixed(2)} ${(50 + Math.sin(a) * v).toFixed(2)}`; }); return d + "Z"; }
export interface EyeTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  follow?: number; bounce?: number; size?: number; shape?: "Ball" | "Circle" | "Cube" | "Pill" | "Hexagon" | "Hex flat";
  eyes?: "Slant" | "Dots" | "Squares"; eyeScale?: number; eyeWidth?: number; eyeRound?: number; eyeHeight?: number; idle?: boolean;
}
export function EyeTracker({ follow = 60, bounce = 30, size = 110, shape = "Cube", eyes: look = "Slant", eyeScale = 1, eyeWidth = 1, eyeRound = 1, eyeHeight = 1, idle = false, className, ...props }: EyeTrackerProps) {
  const still = stillness(); const box = useRef<HTMLDivElement>(null); const eyes = useRef<(SVGGElement | null)[]>([]); const knobs = useRef({ follow, bounce, eyeScale }); knobs.current = { follow, bounce, eyeScale };
  const base = STYLES[look] ?? STYLES.Slant; const eye = { w: base.w * eyeScale * eyeWidth, h: base.h * eyeScale * eyeHeight, r: base.r * eyeScale * eyeWidth * eyeRound }; const eyeNow = useRef(eye); eyeNow.current = eye;
  useEffect(() => {
    const el = box.current; if (!el) return;
    const t = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }; let raf = 0, prev = 0, blink = 0, nextBlink = performance.now() + 2200;
    const draw = (now: number) => {
      let lid = 1; if (now > nextBlink) { blink = now; nextBlink = now + (idle ? 2000 : 2600 + Math.random() * 3200); }
      const since = now - blink; if (since < 160) lid = 1 - 0.9 * Math.sin((since / 160) * Math.PI);
      const as = (v: number) => Math.asin(clamp(v, -0.92, 0.92)); const yaw = as(t.x), pitch = -as(t.y); const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const tilt = TILT * t.x * t.y; const g0 = GAP * Math.max(1, knobs.current.eyeScale * 0.8);
      [-g0, g0].forEach((x0, i) => { const g = eyes.current[i]; if (!g) return; const z0 = Math.sqrt(1 - x0 * x0), x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy, y2 = -z1 * sp, z2 = z1 * cp; const near = clamp(z2, 0, 1), k = 0.45 + 0.55 * near, sx = k * (0.7 + 0.3 * near); const e0 = eyeNow.current, w = e0.w * sx, h = Math.max(0.6, e0.h * k * lid); const rect = g.firstElementChild as SVGRectElement | null;
        if (rect) { rect.setAttribute("x", (-w / 2).toFixed(2)); rect.setAttribute("y", (-h / 2).toFixed(2)); rect.setAttribute("width", w.toFixed(2)); rect.setAttribute("height", h.toFixed(2)); rect.setAttribute("rx", Math.min(e0.r, w / 2, h / 2).toFixed(2)); }
        g.setAttribute("transform", `translate(${(50 + x1 * R).toFixed(2)} ${(50 + y2 * R).toFixed(2)}) rotate(${tilt.toFixed(2)})`); g.style.opacity = z2 < 0.05 ? "0" : "1";
      });
    };
    const tick = (now: number) => { const dt = prev ? Math.min(2.5, (now - prev) / 16.67) : 1; prev = now; if (still) { t.x = t.tx; t.y = t.ty; } else { const k = 0.06, d = 0.34 - (clamp(knobs.current.bounce, 0, 100) / 100) * 0.22; t.vx += ((t.tx - t.x) * k - t.vx * d) * dt; t.vy += ((t.ty - t.y) * k - t.vy * d) * dt; t.x += t.vx * dt; t.y += t.vy * dt; } draw(now); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const frame = el.closest<HTMLElement>(".bench-card, .dtl-block, .board, .sf-thumb, .gs-eye-tracker-stage") ?? el;
    const aim = (e: PointerEvent) => { const f = frame.getBoundingClientRect(); if (e.clientX < f.left || e.clientX > f.right || e.clientY < f.top || e.clientY > f.bottom) { t.tx = 0; t.ty = 0; return; } const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, reach = Math.max(60, Math.min(f.width, f.height) * 0.28), far = Math.min(0.85, Math.tanh(d / reach) * (clamp(knobs.current.follow, 0, 100) / 100) * 1.5); t.tx = (dx / d) * far; t.ty = (dy / d) * far; };
    const rest = () => { t.tx = 0; t.ty = 0; };
    if (idle) { let glance = 0; const lookAround = () => { const a = Math.random() * Math.PI * 2, far = 0.45 + Math.random() * 0.25; t.tx = Math.cos(a) * far; t.ty = Math.sin(a) * far; glance = window.setTimeout(() => { rest(); glance = window.setTimeout(lookAround, 4100); }, 900); }; glance = window.setTimeout(lookAround, 5000); return () => { cancelAnimationFrame(raf); window.clearTimeout(glance); }; }
    window.addEventListener("pointermove", aim, { passive: true }); document.documentElement.addEventListener("pointerleave", rest);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", aim); document.documentElement.removeEventListener("pointerleave", rest); };
  }, [still, idle]);
  const s = clamp(size, 16, 180), body = SHAPES[shape] ?? SHAPES.Ball, clip = `eyt-clip-${useId().replace(/:/g, "")}`;
  const bodyEl = useRef<SVGPathElement>(null), clipEl = useRef<SVGPathElement>(null), shown = useRef<number[] | null>(null), from = useRef(shape);
  useLayoutEffect(() => {
    if (from.current === shape) return; const start = shown.current ?? measure(from.current), end = measure(shape); from.current = shape;
    if (still) { shown.current = end; const d = outline(end); bodyEl.current?.setAttribute("d", d); clipEl.current?.setAttribute("d", d); return; }
    const t0 = performance.now(), ms = 520; let raf = 0;
    const step = (now: number) => { const u = Math.min(1, (now - t0) / ms), c = 1.3, e = 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2), r = start.map((a, i) => a + (end[i] - a) * e); shown.current = r; const d = outline(r); bodyEl.current?.setAttribute("d", d); clipEl.current?.setAttribute("d", d); if (u < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [shape, still]);
  return <div ref={box} role="img" aria-label="Interactive character following cursor" className={cn("relative grid place-items-center w-[200px] h-[200px] select-none touch-none", className)} {...props}>
    <svg style={{ width: `${s}px`, height: `${s}px` }} className="overflow-visible drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]" viewBox="0 0 100 100">
      <defs><clipPath id={clip}><path ref={clipEl} d={shown.current ? outline(shown.current) : body} /></clipPath></defs>
      <path ref={bodyEl} className="eye-tracker-body fill-zinc-100/90 stroke-zinc-300 stroke-[1.25]" d={shown.current ? outline(shown.current) : body} />
      <g clipPath={`url(#${clip})`}>{[0, 1].map((i) => <g key={i} ref={(n) => { eyes.current[i] = n; }}><rect className="eye-tracker-eye" x={-eye.w / 2} y={-eye.h / 2} width={eye.w} height={eye.h} rx={eye.r} /></g>)}</g>
    </svg>
  </div>;
}
export { EyeTracker as Component };
export default EyeTracker;
