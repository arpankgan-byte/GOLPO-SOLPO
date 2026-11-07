import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "..")

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: path.resolve(here, "../glass-transition"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        preview: path.resolve(here, "index.html"),
        transition: path.resolve(here, "transition.html"),
      },
    },
  },
  resolve: {
    alias: [
      { find: "react/jsx-runtime", replacement: path.resolve(here, "node_modules/react/jsx-runtime.js") },
      { find: "react-dom/client", replacement: path.resolve(here, "node_modules/react-dom/client.js") },
      { find: /^react$/, replacement: path.resolve(here, "node_modules/react/index.js") },
      { find: /^react-dom$/, replacement: path.resolve(here, "node_modules/react-dom/index.js") },
      { find: /^clsx$/, replacement: path.resolve(here, "node_modules/clsx/dist/clsx.js") },
      { find: /^tailwind-merge$/, replacement: path.resolve(here, "node_modules/tailwind-merge/dist/bundle-mjs.mjs") },
      { find: "@", replacement: repoRoot },
    ],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 5173,
    strictPort: true,
    fs: { allow: [repoRoot] },
  },
})
