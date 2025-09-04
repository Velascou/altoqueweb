// src/pages/api/questions.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const endpoint = process.env.SHEETDB_QUESTIONS_ENDPOINT;
  if (!endpoint) return res.status(500).json({ error: 'Missing SHEETDB_QUESTIONS_ENDPOINT' });

  const { model: modelQuery } = req.query;

  try {
    const r = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    const raw = await r.json();
    const rows = Array.isArray(raw) ? raw : raw?.data || [];

    // Normalización
    const norm = rows.map((x) => {
      const Model = String(x.Model ?? '').trim();
      const Question = Number(String(x.Question ?? '').trim()) || 0;
      const Type = String(x.Type ?? '').trim().toLowerCase(); // options|true_false|fill
      const Prompt = String(x.Prompt ?? '').trim();
      const Prompt_trans = String(x.Prompt_trans ?? '').trim();
      const Options = String(x.Options ?? '').trim();
      const Answer = String(x.Answer ?? '').trim();
      const Accept = String(x.Accept ?? '').trim();
      const Enabled = String(x.Enabled ?? '').trim().toLowerCase();

      const enabled = Enabled === 'true' || Enabled === '1' || Enabled === 'yes';

      const options = Options
        ? Options.split(/[\|;]+/).map(s => s.trim()).filter(Boolean)
        : (Type === 'true_false' ? ['True', 'False'] : []);

      const accept = Accept
        ? Accept.split(/[\|;]+/).map(s => s.trim()).filter(Boolean)
        : [];

      return {
        model: Model,
        question: Question,
        type: Type,
        prompt: Prompt,
        prompt_trans: Prompt_trans,
        options,
        answer: Answer,
        accept,
        enabled
      };
    }).filter(q => q.enabled && q.model && q.question && q.type && q.prompt);

    if (!norm.length) return res.status(200).json({ models: [], selectedModel: null, questions: [] });

    // Agrupar por modelo
    const modelsMap = norm.reduce((acc, q) => {
      (acc[q.model] ||= []).push(q);
      return acc;
    }, {});

    // Si llega ?model=... usamos ese; si no, aleatorio entre los disponibles
    const models = Object.keys(modelsMap).sort();
    const selectedModel = modelQuery && modelsMap[modelQuery]
      ? modelQuery
      : models[Math.floor(Math.random() * models.length)];

    // Orden por número de pregunta
    const questions = modelsMap[selectedModel].sort((a, b) => a.question - b.question);

    return res.status(200).json({ models, selectedModel, questions });
  } catch (err) {
    console.error('[questions] fetch error', err);
    return res.status(500).json({ error: 'Upstream fetch failed' });
  }
}
