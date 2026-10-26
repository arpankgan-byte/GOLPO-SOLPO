# Golpo Solpo live ordering files

This package adds an **Order from your table** floating button to the existing site, a menu/order page at `/order/`, a PIN-protected order panel at `/panel/`, and a Vercel serverless API at `/api/orders`. The API uses the Neon `DATABASE_URL` environment variable and creates its order table the first time it runs.

## Deploy through your linked GitHub repo

1. Download/extract this ZIP.
2. In `arpankgan-byte/GOLPO-SOLPO`, replace the current site HTML with the included `index.html` at the repository root. Keep the supplied `api/`, `order/`, `panel/`, and `package.json` paths at the repo root.
3. Commit/push to the production branch (`main`). Vercel should build a deployment automatically.
4. Test `https://golpo-solpo-2.vercel.app/order/` by sending a test order. Then open `https://golpo-solpo-2.vercel.app/panel/` and enter the panel PIN.

## Environment variables

Vercel project environment needs `DATABASE_URL` from the Neon integration and `ADMIN_PIN` set to a private value. Do not put secrets in client-side files or commit them. The API rejects panel reads and status changes without the PIN. Configure `ADMIN_PIN` in Vercel → Project → Settings → Environment Variables, then redeploy if needed.

## Notes

The customer menu contains eight signature dishes with prices listed on the site; add the remaining menu entries in both `api/orders.js` and `order/index.html` as desired. Payments are not included. This creates a website order request and kitchen panel; it does not process online payments. A customer can select tables 1–12; per-table QR links can use `/order/?table=1`, `/order/?table=2`, etc.
