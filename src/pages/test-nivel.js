'use client';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export async function getStaticProps({ locale = 'en' }) {
  const l = locale || 'en';
  const load = async (code) => {
    try { const m = await import(`../locales/${code}.json`); return m?.default ?? m; }
    catch { return null; }
  };
  const messages = (await load(l)) || (await load('en')) || {};
  return { props: { messages, locale: l } };
}



function normalizeStr(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  // Permite "a|b|c", "a;b;c" o "a, b, c"
  return String(v).split(/[\|;,]/g).map(s => s.trim()).filter(Boolean);
}

function normalizeList(list) {
  return toArray(list).map(s =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export default function TestNivel() {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [model, setModel] = useState(null);
  const [models, setModels] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showTrans, setShowTrans] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    const url = modelParam ? `/api/questions?model=${encodeURIComponent(modelParam)}` : '/api/questions';

    setLoading(true);
    setFetchError('');
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!data?.questions?.length) {
          setFetchError('No questions available.');
          setQuestions([]);
        } else {
          setQuestions(data.questions);
          setModel(data.selectedModel || null);
          setModels(data.models || []);
        }
      })
      .catch(() => setFetchError('Could not load questions.'))
      .finally(() => setLoading(false));
  }, []);

  const onAnswer = (idx, value) => {
    setAnswers(a => ({ ...a, [idx]: value }));
  };

  const grade = useMemo(() => {
    if (score == null || !questions.length) return null;
    const pct = (score / questions.length) * 100;
    if (pct < 35) return 'A1';
    if (pct < 55) return 'A2';
    if (pct < 70) return 'B1';
    if (pct < 85) return 'B2';
    return 'C1+';
  }, [score, questions.length]);

  const evaluate = () => {
  let s = 0;
  questions.forEach((q, i) => {
    const user = answers[i];
    if (user == null || String(user).trim() === '') return;

    const nUser = normalizeStr(user);
    const okList = normalizeList(q.answer);   // soporta string o array
    const accList = normalizeList(q.accept);  // soporta string (con | , ;) o array
    const allValid = new Set([...okList, ...accList]);

    // Para cualquier tipo, si el user coincide con answer o con accept => correcto
    if (allValid.has(nUser)) s++;
  });

  setScore(s);
  setTimeout(() => {
    const el = document.getElementById('result');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
};

  const reset = () => {
    setAnswers({});
    setShowTrans({});
    setScore(null);
  };

  // --- Barra de estado (respondidas / total) ---
  const answeredCount = useMemo(
    () =>
      Object.entries(answers).reduce((acc, [idx, val]) => {
        if (val !== undefined && val !== null && String(val).trim() !== '') acc++;
        return acc;
      }, 0),
    [answers]
  );
  const total = questions.length;
  const pct = total ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <SeoHead title="Spanish Placement Test" description="Take a quick placement test powered by our question bank." />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-rose-700 mb-2">
          {t('placement_test')} {model ? `(Model ${model})` : ''}
        </h1>
       

        {loading && <div className="p-6 bg-white rounded-xl shadow">{t('loading_questions')}</div>}
        {fetchError && <div className="p-6 bg-white rounded-xl shadow text-rose-700">{fetchError}</div>}

        {!loading && !fetchError && questions.length > 0 && score == null && (
          <div className="space-y-6 pb-28">{/* padding-bottom para no tapar con la barra */}
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold">{idx + 1}. {q.prompt}</p>
                  {q.prompt_trans && (
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                      onClick={() => setShowTrans(s => ({ ...s, [idx]: !s[idx] }))}
                    >
                      {showTrans[idx] ? 'Hide translation' : 'Show translation'}
                    </button>
                  )}
                </div>
                {showTrans[idx] && (
                  <p className="mt-2 text-slate-600 italic">{q.prompt_trans}</p>
                )}

                {(q.type === 'options' || q.type === 'true_false') ? (
                  <div className="grid gap-2 sm:grid-cols-2 mt-4">
                    {(q.options || []).map((opt, k) => (
                      <label
                        key={k}
                        className={`border rounded px-3 py-2 cursor-pointer ${
                          answers[idx] === opt ? 'bg-rose-100 border-rose-300' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          className="mr-2"
                          checked={answers[idx] === opt}
                          onChange={() => onAnswer(idx, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={answers[idx] || ''}
                      onChange={(e) => onAnswer(idx, e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Your answer…"
                    />
                    {q.accept?.length ? (
                      <p className="text-xs text-slate-400 mt-1">
                        *(Variantes aceptadas configuradas)*
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {score != null && (
          <div id="result" className="mt-8 text-center bg-white rounded-xl shadow p-8">
            <p className="text-2xl font-bold mb-2">
              Score: {score}/{questions.length} ({Math.round((score/questions.length)*100)}%)
            </p>
            <p className="text-rose-700 font-semibold mb-4">
              {t('recommended_level')} {grade}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              >
                {t('retry')}
              </button>
              <Link
                href="/inscripcion"
                className="px-5 py-2 rounded-xl bg-amber-400 text-rose-900 hover:bg-amber-300"
              >
                {t('free_trial')}
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Barra flotante de progreso */}
      {!loading && !fetchError && questions.length > 0 && score == null && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-slate-200"
          role="status"
          aria-label="Progreso del test"
        >
          <div className="mx-auto max-w-3xl px-4 py-3">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-slate-700">
                {answeredCount}/{total} {answeredCount === 1 ? 'respondida' : 'respondidas'}
              </span>
              <span className="text-slate-500">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${pct}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              />
            </div>

            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-slate-300 hover:bg-slate-50"
              >
                {t('scroll_up')}
              </button>
              <button
                onClick={evaluate}
                className="px-4 py-1.5 text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                disabled={answeredCount === 0}
              >
                {t('form.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
