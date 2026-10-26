const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

function isAdmin(req) {
  const expected = process.env.ADMIN_PIN || '';
  const supplied = req.headers['x-admin-pin'] || '';
  if (!expected || !supplied) return false;
  const a = Buffer.from(String(expected));
  const b = Buffer.from(String(supplied));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email text PRIMARY KEY,
      consented_at timestamptz NOT NULL DEFAULT now(),
      source text NOT NULL DEFAULT 'website'
    )`;

    if (req.method === 'POST') {
      const body = req.body || {};
      // Honeypot: quietly accept automated submissions without storing them.
      if (typeof body.company === 'string' && body.company.trim()) {
        return res.status(200).json({ ok: true, already: false });
      }
      if (body.consent !== true) {
        return res.status(400).json({ error: 'Please agree to receive email updates.' });
      }
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Enter a valid email address.' });
      }
      const found = await sql`SELECT email FROM newsletter_subscribers WHERE email = ${email} LIMIT 1`;
      await sql`INSERT INTO newsletter_subscribers(email, consented_at, source)
        VALUES(${email}, now(), 'website')
        ON CONFLICT(email) DO UPDATE SET consented_at = now(), source = 'website'`;
      return res.status(found.length ? 200 : 201).json({ ok: true, already: Boolean(found.length) });
    }

    // Optional admin-only list endpoint; never expose subscriber addresses publicly.
    if (req.method === 'GET') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Panel PIN required' });
      const rows = await sql`SELECT email, consented_at AS "consentedAt" FROM newsletter_subscribers ORDER BY consented_at DESC LIMIT 5000`;
      return res.status(200).json(rows);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ error: 'Signup could not be saved. Check the database configuration and try again.' });
  }
};
