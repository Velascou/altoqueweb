// src/pages/api/sheetdb.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const endpoint = process.env.SHEETDB_ENDPOINT;
  if (!endpoint) return res.status(500).json({ error: 'SHEETDB_ENDPOINT not set' });

  try {
    const { data } = req.body || {};
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid payload: { data: [...] } required' });
    }

    const sanitize = (v) =>
      String(v ?? '')
        .replace(/(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|XP_)\b)/gi, '')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, 1000);

    const safe = { data: data.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, sanitize(v)]))) };

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(safe)
    });

    const text = await upstream.text();
    // Log en servidor para depurar
    console.log('[SheetDB] status:', upstream.status, 'body:', text);

    if (!upstream.ok) {
      // SheetDB suele devolver JSON con {created: 1} o un mensaje de error
      return res.status(upstream.status).json({ error: text || 'Upstream error' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(text ? JSON.parse(text) : { ok: true });
  } catch (e) {
    console.error('[api/sheetdb] error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
