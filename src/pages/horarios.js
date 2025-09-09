// src/pages/horarios.js
'use client';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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

// ⚠️ Reemplaza por tu embed de Google Calendar (solo el valor de src)
const CALENDAR_SRC =
  'https://calendar.google.com/calendar/embed?src=7038895acb4e2821bbfbecea2e94b2f8b32f6ff695902c163452b0cfb508ddc0%40group.calendar.google.com&ctz=Europe%2FDublin';

// Orden fijo de días
const WEEK_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Helper para agrupar
function groupByDay(slots) {
  const map = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
  for (const s of slots) {
    if (map[s.day]) map[s.day].push({ time: s.time, course: s.course });
  }
  // Ordena cada día por hora textual si quieres (aquí simple alfabético)
  for (const d of WEEK_ORDER) {
    map[d].sort((a, b) => a.time.localeCompare(b.time));
  }
  return map;
}

const toHref = (day, time, course) =>
  `/inscripcion?slot=${encodeURIComponent(`${day} ${time}`)}&course=${encodeURIComponent(course)}`;

export default function Horarios() {
  // toggle entre vistas: 'grid' | 'accordion'
  const [view, setView] = useState('grid');
  const [openDay, setOpenDay] = useState(null); // para el acordeón

  const t = useTranslations();

  // Estado de carga/slots
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [slots, setSlots] = useState([]); // [{day,time,course}, ...]

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await fetch('/api/schedule');
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Fetch failed');
        if (active) setSlots(Array.isArray(json.slots) ? json.slots : []);
      } catch (e) {
        console.error('[horarios] schedule fetch error', e);
        if (active) setErr('Could not load schedule. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const slotsByDay = useMemo(() => groupByDay(slots), [slots]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 to-white">
      <Navbar />
      <SeoHead
        title="Schedule & Availability | Al Toque"
        description="Check our live calendar and pick a slot that works for you."
      />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 space-y-10">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {t('schedule_availability')}
          </h1>
          <p className="text-slate-600 mt-2">
            {t('schedule_note')}
          </p>
        </header>

        {/* Toggle de vista */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                view === 'grid' ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Weekly grid
            </button>
            <button
              onClick={() => setView('accordion')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                view === 'accordion' ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Accordion
            </button>
          </div>
        </div>

        {/* Carga/errores */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            Loading schedule…
          </div>
        )}
        {err && !loading && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm text-center text-rose-700">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {view === 'grid' ? (
              /* Opción A: Grid semanal (5 columnas) */
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-2">{t('calendar_cta')}</h2>
                <p className="text-slate-600 mb-4">
                  {t('calendar_note')}
                </p>

                {/* Cabecera con los 5 días */}
                <div className="hidden md:grid grid-cols-5 gap-4 pb-2">
                  {WEEK_ORDER.map((day) => (
                    <div key={day} className="text-center font-semibold text-slate-700">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Cuerpo: grid de 5 columnas con “stacks” verticales */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {WEEK_ORDER.map((day) => (
                    <div key={day} className="space-y-3">
                      {/* En móviles mostramos el heading de cada columna */}
                      <div className="md:hidden font-semibold text-slate-700">{day}</div>

                      {(slotsByDay[day] || []).map(({ time, course }, idx) => (
                        <Link
                          key={`${day}-${idx}-${time}`}
                          href={toHref(day, time, course)}
                          className="block rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition p-3 shadow-sm"
                        >
                          <div className="flex flex-col items-center text-center">
                            <span className="text-sm font-semibold text-rose-700">{time}</span>
                            <span className="text-xs text-slate-500">{course}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  Times shown in Europe/Dublin timezone.
                </p>
              </section>
            ) : (
              /* Opción B: Acordeón por día */
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-2">Quick booking links</h2>
                <p className="text-slate-600 mb-4">
                  Tap a weekday to expand its available class times.
                </p>

                <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                  {WEEK_ORDER.map((day) => {
                    const isOpen = openDay === day;
                    const daySlots = slotsByDay[day] || [];
                    return (
                      <div key={day}>
                        <button
                          onClick={() => setOpenDay(isOpen ? null : day)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                          aria-expanded={isOpen}
                          aria-controls={`panel-${day}`}
                        >
                          <span className="font-semibold text-slate-800">
                            {day} <span className="text-slate-500 text-sm">({daySlots.length})</span>
                          </span>
                          <span className="text-slate-500">{isOpen ? '–' : '+'}</span>
                        </button>

                        {/* Panel */}
                        <div
                          id={`panel-${day}`}
                          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 pb-4 transition-all duration-200 ${
                            isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                          }`}
                        >
                          {daySlots.map(({ time, course }, idx) => (
                            <Link
                              key={`${day}-${idx}-${time}`}
                              href={toHref(day, time, course)}
                              className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition shadow-sm flex items-center justify-between"
                            >
                              <span className="text-sm font-semibold text-rose-700">{time}</span>
                              <span className="text-xs text-slate-500">{course}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  Times shown in Europe/Dublin timezone.
                </p>
              </section>
            )}
          </>
        )}

        {/* Google Calendar embed */}
        <section className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <iframe
            src={CALENDAR_SRC}
            className="w-full h-[680px]"
            style={{ border: 0 }}
          />
        </section>

        <div className="text-center">
          <Link
            href="/inscripcion"
            className="inline-block px-6 py-3 rounded-2xl bg-rose-600 text-white shadow-md hover:shadow-lg hover:bg-rose-700 active:scale-[.98] transition-transform duration-200"
          >
            Go to booking form
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
