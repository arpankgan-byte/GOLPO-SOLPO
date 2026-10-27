# Golpo Solpo — public website update

The root URL `/` opens the full animated welcome story, with a visible **Skip intro** link. The public homepage and menu are at `/home`; customers need no login. Normal visitor authentication has been removed; the staff dashboard remains protected by `ADMIN_PIN` and the order API.

The site uses a consistent blue/black palette. Music is optional and only starts after a visitor presses its music button. The `/order/` and `/panel/` buttons retain their subtle animated treatment. The welcome, homepage, order and back-to-home route changes use the stairs transition with a morph loader; blue divider lines are removed. Reduced-motion settings are respected.

The newsletter signup and its API have been removed because no email campaign delivery is configured. Reservation requests open a prefilled WhatsApp message and remain pending until the guest sends it and the restaurant confirms. They are not shown as confirmed by the site.

## Deploy

Copy this project folder's contents to the root of the linked `arpankgan-byte/GOLPO-SOLPO` repository, commit and push to `main`, then wait for Vercel to deploy. Keep these server environment variables configured; never put them in browser files or Git:

- `DATABASE_URL` — Neon connection used by the orders API.
- `ADMIN_PIN` — staff-panel PIN.

## Routes and files

- `/` and `/welcome` — full animated welcome story; Skip intro goes to the homepage/menu.
- `/home` — public homepage with menu, hours, location and order/reservation actions; no customer login.
- `/order/?table=N` — table order page with a table preselected. The 12 QR codes target these pages directly.
- `/panel/` — PIN-protected staff panel.
- `og-image.jpg`, `favicon.png`, `favicon.ico` — link-preview and browser icon assets.
- `Golpo-Solpo-12-Table-QR-Codes.pdf` and `table-qr-codes/` — printable sheet and individual table QR images.

The QR print sheet is also supplied separately as `Golpo-Solpo-12-table-QRs.zip`. Payments and email marketing are not included.
