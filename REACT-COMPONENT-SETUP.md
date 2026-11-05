# Ghost 404 React component: framework notes

## Current project status

This repository is a small static Vercel site: its public pages are embedded in `index.html`, and the order/admin apps are standalone HTML. It currently has **no** React/Next.js app, TypeScript configuration, Tailwind setup, shadcn `components.json`, or default reusable-component directory. Its `package.json` only declares the orders API database dependency.

The live 404 experience is implemented in root `404.html` (and mirrored in the wrapper's embedded 404 page), so Vercel can return a real HTTP 404 without converting the restaurant site. The React files in `components/ui/` are migration-ready source; they are **not compiled or used by the current static deployment**. Do not add Next/React packages to the current deployment just to make these source files appear active—it could change Vercel's build detection without migrating the rest of the site.

## Component and style paths

There is no existing component path in the static site. The requested `/components/ui` folder has been added for the reusable component source. In a normal shadcn project, `components.json` maps the `ui` alias to `@/components/ui`; using this folder keeps imports consistent and lets shadcn CLI additions land beside the component. Styles belong in the app's global stylesheet, normally `app/globals.css` for the App Router.

## To run the React component in a separate Next.js + shadcn app

Keep the current static site intact, or plan a deliberate full migration before replacing its Vercel project. To create a compatible app in a new folder:

1. Run `npx create-next-app@latest golpo-solpo-next` and choose **TypeScript: yes**, **App Router: yes**, **src directory: no** (so the default path is `/components/ui`), and **Tailwind: no** during the prompts.
2. From the new app folder, install Tailwind v3 (the supplied config uses the v3 config-file and `@tailwind` syntax), then initialise it and shadcn:

   ```bash
   npm install -D tailwindcss@3.4.17 postcss autoprefixer
   npx tailwindcss init -p
   npx shadcn@latest init
   npm install framer-motion lucide-react
   ```

3. Keep `components.json`'s UI alias as `@/components/ui`, and copy `components/ui/ghost-404-page.tsx` plus `components/ui/flow-button.tsx` into that folder.
4. Add `app/not-found.tsx` in the new Next app:

   ```tsx
   import { NotFound } from "@/components/ui/ghost-404-page";

   export default function NotFoundPage() {
     return <NotFound />;
   }
   ```

5. Tailwind's content paths must include `./app/**/*.{js,ts,jsx,tsx,mdx}` and `./components/**/*.{js,ts,jsx,tsx,mdx}`. A minimal Tailwind v3 `tailwind.config.ts` can be:

   ```ts
   import type { Config } from "tailwindcss";

   export default {
     content: [
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: { extend: {} },
     plugins: [],
   } satisfies Config;
   ```

   The supplied React component uses standard Tailwind utilities plus Framer Motion; its movement does not need the extra custom keyframes from the prompt.
6. In `app/globals.css`, retain the Next/shadcn base styles and Tailwind v3 directives:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   The long global CSS sample in the request sets `html` and `body` to `position: fixed`, disables scrolling, and uses `touch-action: none`; **do not paste those global rules into the whole restaurant site**, because they would break page scrolling and mobile interaction. The ghost illustration is inline SVG, so no remote-image allowlist or Google Font download is needed.

The supplied external `Find shelter` destination was changed to the restaurant's own welcome route. The page layout, white background, charcoal text, 404 numerals, ghost motion, main button, and “What means 404?” disclosure follow the supplied reference. I retrieved and saved the exact ghost PNG from the URL in your component. The static 404 embeds it as a data URI so it works offline; the Next component imports `components/ui/ghost-404.png` locally, so it needs no remote-image allowlist.
