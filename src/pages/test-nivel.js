'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SeoHead from '../components/SeoHead';

export async function getStaticProps({ locale = 'en' }) {
  const l = locale || 'en';

  // Carga segura (evita fallos con Turbopack y require)
  const load = async (code) => {
    try {
      const mod = await import(`../locales/${code}.json`);
      return mod?.default ?? mod ?? null;   // <- soporta ambas formas
    } catch {
      return null;
    }
  };

  const messages = (await load(l)) || (await load('en')) || {};

  return {
    props: { messages, locale: l }
  };
}

const QUESTIONS = [
  {
    q: '¿Cómo se dice “I am” en español?',
    options: ['Soy', 'Estas', 'Estoy', 'Eres'],
    answer: 0
  },
  {
    q: 'El plural de “libro” es…',
    options: ['libra', 'libros', 'libras', 'libres'],
    answer: 1
  },
  {
    q: '“We have” en español:',
    options: ['Tenemos', 'Tienen', 'Tenéis', 'Tengo'],
    answer: 0
  },
  {
    q: '“She is from Ireland” se traduce como:',
    options: ['Ella eres de Irlanda', 'Ella está de Irlanda', 'Ella es de Irlanda', 'Ella soy de Irlanda'],
    answer: 2
  },
  {
    q: 'Selecciona el artículo correcto: ___ agua está fría.',
    options: ['La', 'El', 'Una', 'Un'],
    answer: 1
  }
];

export default function TestNivel() {
  const t = useTranslations();
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [score, setScore] = useState(null);

  const setAns = (i, v) => {
    const copy = [...answers];
    copy[i] = v;
    setAnswers(copy);
  };

  const submit = () => {
    let s = 0;
    answers.forEach((a, i) => {
      if (a === QUESTIONS[i].answer) s++;
    });
    setScore(s);
  };

  const renderRecommendation = () => {
    if (score === null) return null;
    if (score <= 2) return t('level_reco_low');
    if (score === 3) return t('level_reco_mid');
    return t('level_reco_high');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <SeoHead />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-red-700 mb-6">
          {t('test_title')}
        </h1>

        {score === null ? (
          <div className="space-y-6">
            {QUESTIONS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <p className="font-semibold mb-3">{i + 1}. {item.q}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {item.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`border rounded px-3 py-2 cursor-pointer ${
                        answers[i] === idx ? 'bg-red-100 border-red-300' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        className="mr-2"
                        onChange={() => setAns(i, idx)}
                        checked={answers[i] === idx}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={submit}
              className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700"
            >
              {t('test_submit')}
            </button>
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl shadow p-8">
            <p className="text-2xl font-bold mb-2">
              {t('test_score')} {score}/{QUESTIONS.length}
            </p>
            <p className="text-gray-700 mb-6">{renderRecommendation()}</p>
            <Link href="/inscripcion">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700">
                {t('register')}
              </button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
