const crypto = require('crypto');
const MENU = require('../menu.json');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function dbRequest(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase server environment is not configured');
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
  if (!response.ok) {
    console.error('Supabase orders request failed:', response.status, data);
    throw new Error('Supabase orders request failed');
  }
  return data;
}

function admin(req) {
  return !!process.env.ADMIN_PIN && req.headers['x-admin-pin'] === process.env.ADMIN_PIN;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      if (!admin(req)) return res.status(401).json({ error: 'Panel PIN required' });
      const rows = await dbRequest('restaurant_orders?select=id,table:table_no,items,status,createdAt:created_at&order=created_at.desc&limit=300');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const table = Number(body.table);
      const items = body.items;
      if (!Number.isInteger(table) || table < 1 || table > 12 || !Array.isArray(items) || !items.length || items.length > 30) {
        return res.status(400).json({ error: 'Choose a valid table and add menu items.' });
      }
      const clean = [];
      for (const item of items) {
        const menuItem = MENU.find((entry) => entry.id === Number(item.menuId));
        const qty = Number(item.qty);
        if (!menuItem || !Number.isInteger(qty) || qty < 1 || qty > 25) {
          return res.status(400).json({ error: 'Invalid item or quantity.' });
        }
        clean.push({ menuId: menuItem.id, category: menuItem.category, name: menuItem.name, qty, price: menuItem.price });
      }
      const id = `GS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const rows = await dbRequest('restaurant_orders?select=id,table:table_no,items,status,createdAt:created_at', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ id, table_no: table, items: clean, status: 'New' }),
      });
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PATCH') {
      if (!admin(req)) return res.status(401).json({ error: 'Panel PIN required' });
      const { id, status } = req.body || {};
      if (!id || !['Preparing', 'Ready', 'Served'].includes(status)) {
        return res.status(400).json({ error: 'Invalid order status.' });
      }
      const query = new URLSearchParams({ id: `eq.${id}`, select: 'id' });
      const rows = await dbRequest(`restaurant_orders?${query.toString()}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ status }),
      });
      if (!rows.length) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Order service error. Check Supabase backend setup.' });
  }
};
