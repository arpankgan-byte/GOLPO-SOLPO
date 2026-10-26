# Golpo Solpo — public website and ordering update

This package opens with the welcome/story experience, then uses the site's existing demo login screen before entering the restaurant homepage. Staff access remains separate at the PIN-protected `/panel/` and server-side API. The front-end demo login is not secure authentication and must not be used to protect private data. It also updates the menu category copy, removes the unverified crown/highest-price marker, clarifies that WhatsApp reservations still need to be sent and confirmed, and replaces the newsletter's simulated success with a consent-based database signup. For link previews, `og-image.jpg` is the 1200×630 share image referenced by the root page's Open Graph and Twitter Card metadata.

## Deploy

Copy the complete contents of this project folder into the root of the linked `arpankgan-byte/GOLPO-SOLPO` repository, then commit and push to `main` (or upload the contents to the existing Vercel project). Keep the existing Vercel/Neon environment variables configured:

- `DATABASE_URL` — Neon database connection string (used by both ordering and newsletter APIs).
- `ADMIN_PIN` — private staff-panel PIN. Never place either value in browser code or commit it to Git.

The order and newsletter tables are created automatically on their first API request. Verify that the Vercel deployment has the Neon `DATABASE_URL` environment variable in the Production environment before testing signups/orders.

## Newsletter limitation

Consent and email addresses are stored in Neon (`newsletter_subscribers`). The site does **not** send confirmation emails or marketing campaigns: no email delivery provider/credentials are configured. The signup message therefore reports that the address was saved, not that an email was sent. Subscriber addresses are not public; the newsletter API's GET list requires the staff PIN.

## Reservation limitation

The reservation form opens a prefilled WhatsApp message. The guest must send it in WhatsApp, and the restaurant must confirm availability. The website does not claim to send or confirm a booking.

## Routes and checks

- `/` — opens the welcome/story experience.
- `/welcome` — welcome/story experience; use its main-site button to continue through the login screen to the restaurant homepage.
- `/order/` — table ordering (QR links may use `/order/?table=1`, `/order/?table=2`, etc.).
- `/panel/` — staff order panel protected by `ADMIN_PIN`.
- `/api/orders` — order API; staff reads/status changes require the PIN.
- `/api/subscribe` — consent-based signup; subscriber list reads require the PIN.
- `robots.txt` and `sitemap.xml` — basic search-engine discovery; the panel and API are excluded from indexing.

Payments and email campaign delivery are not included.
