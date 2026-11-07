# Liquid Glass Reveal — React component setup

## Added files

- `components/ui/liquid-glass-logo-reveal.tsx` — the supplied self-contained WebGL 2 React component.
- `components/ui/demo.tsx` — the `GlassReveal21stDemo` example.
- `lib/utils.ts` — the standard shadcn `cn()` helper.
- `glass-preview/` — an isolated Vite + React + TypeScript + Tailwind demo that imports the component and previews the Golpo Solpo logo.

### Run the live component preview

```bash
cd glass-preview
npm install
npm run dev
```

Vite serves the demo on port `5173`. The preview project is separate from the restaurant's static HTML app. Its production build also emits a small standalone React interstitial at `glass-transition/transition.html`. The existing static wrapper in `index.html` runs its original cover/loader first, plays that interstitial, and only then loads and reveals the requested destination. Completion is signaled with `postMessage`; a five-second fallback prevents a stuck navigation. Keep the generated `glass-transition/` files and the shared `page-transition.js` in deployments alongside the static site. The same cover → glass → destination flow is wired for the homepage, `/order/`, and `/panel/`; destination pages reveal after loading. The custom `logo-reveal-music.wav` sonic logo is triggered directly by the user's navigation click, so it plays automatically under the cover and glass reveal, including in browsers that block unprompted autoplay. It is a short, original synthesized cinematic sting, separate from the restaurant's background track. Reduced-motion preferences bypass the effect.

The restaurant remains a **static HTML** Vercel site: its pages have not been migrated to React. Only the transition interstitial is a built React bundle. The supplied reusable TSX source remains in `/components/ui`; the static pages still do not require a React runtime or Tailwind build of their own.

## Set up a React + TypeScript + Tailwind app

To run the supplied demo without converting the existing static site, create a separate Next.js app (choose **no `src/` directory** so its default component path is `/components/ui`):

```bash
npx create-next-app@latest golpo-solpo-react \
  --typescript --tailwind --eslint --app --import-alias "@/*"
cd golpo-solpo-react
npx shadcn@latest init
npm install clsx tailwind-merge
```

In the new app, ensure `components.json` maps `ui` to `components/ui` and `utils` to `lib/utils`. Copy the two component files and `lib/utils.ts` from this repository into the matching locations. The Next scaffold provides TypeScript and Tailwind; shadcn initialization establishes its aliases and component structure.

Create `app/page.tsx`:

```tsx
import { GlassReveal21stDemo } from "@/components/ui/demo";

export default function Page() {
  return <GlassReveal21stDemo />;
}
```

Then run:

```bash
npm run dev
```

The reveal requires a browser with WebGL 2. `GlassReveal21st` intentionally displays the 21st.dev mark from the supplied demo. For the Golpo Solpo artwork, use the component's exported `GlassIconReveal` implementation with the logo URL/data URI and `originalColors` enabled, or deliberately migrate the restaurant homepage to the React app. Do not point the current static Vercel project at a React build until its existing routes and APIs have been migrated and checked.

## Why `/components/ui` matters

shadcn's `components.json` records the UI component alias (commonly `@/components/ui`). Keeping reusable UI source in `/components/ui` makes CLI-installed components and imports agree. This static repository already has the directory, so it is reused rather than creating a parallel component folder.
