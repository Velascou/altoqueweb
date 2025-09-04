// src/pages/api/schedule.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const endpoint = process.env.SHEETDB_SCHEDULE_ENDPOINT;
  if (!endpoint) return res.status(500).json({ error: 'Missing SHEETDB_SCHEDULE_ENDPOINT' });

  try {
    const upstream = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    const data = await upstream.json();

    // Esperamos filas con { Day, Time, Course, Enabled }
    const rows = Array.isArray(data) ? data : data?.data || [];

    // Normalizamos y filtramos
    const clean = rows
      .map(r => ({
        day: String(r.Day || '').trim(),
        time: String(r.Time || '').trim(),
        course: String(r.Course || '').trim(),
        enabled: String(r.Enabled || '').toLowerCase() === 'true'
      }))
      .filter(r => r.day && r.time && r.course && r.enabled);

    return res.status(200).json({ slots: clean });
  } catch (err) {
    console.error('[schedule] fetch error', err);
    return res.status(500).json({ error: 'Upstream fetch failed' });
  }
}
