'use client';
import emailjs from 'emailjs-com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name, email, phone, course, level, schedule, message
  } = req.body;

  try {
    // 1) EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        timestamp: new Date().toISOString(),
        name, email, phone, course, level, schedule, message
      },
      process.env.EMAILJS_USER_ID
    );

    // 2) SheetDB
    const row = {
      timestamp: new Date().toISOString(),
      name, email, phone, course, level, schedule, message
    };
    const sheetRes = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ data: [row] })
    });

    if (!sheetRes.ok) throw new Error('Error saving to SheetDB');

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
