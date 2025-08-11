'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import SeoHead from '../components/SeoHead';
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

export default function Home() {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <SeoHead />

      {/* HERO */}
      <section className="bg-gradient-to-br from-rose-500 via-red-500 to-orange-400 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {t('hero_title_1')}{' '}
              <span className="underline decoration-amber-300">{t('hero_title_2')}</span>
            </h1>
            <p className="mt-4 text-lg/7 text-rose-50/90">
              {t('hero_sub')}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inscripcion"
                className="px-6 py-3 rounded-2xl bg-white text-rose-600 font-semibold
                           shadow-md hover:shadow-lg hover:bg-rose-50
                           active:scale-[.98] transition-transform duration-200
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500">
                {t('hero_cta_trial')}
              </Link>
              <Link
                href="/test-nivel"
                className="px-6 py-3 rounded-2xl bg-rose-700/40 ring-1 ring-white/40
                           hover:shadow-lg hover:bg-rose-600/50
                           active:scale-[.98] transition-transform duration-200
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500">
                {t('hero_cta_test')}
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-rose-50/90">
              <span className="font-semibold">{t('hero_stats_1')}</span>
              <span>{t('hero_stats_2')}</span>
              <span>{t('hero_stats_3')}</span>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/logo-altoque.png"
              alt="Al Toque"
              width={520}
              height={520}
              className="rounded-3xl border border-white/30 shadow-2xl object-cover bg-white p-4"
            />
            <div className="absolute -bottom-4 -right-4 bg-amber-300 text-rose-900 px-4 py-2 rounded-2xl shadow font-bold">
              {t('hero_badge')}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">{t('benefits_title')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { icon: '🎯', t: t('benefit_1_t'), d: t('benefit_1_d') },
            { icon: '👩‍🏫', t: t('benefit_2_t'), d: t('benefit_2_d') },
            { icon: '⏰', t: t('benefit_3_t'), d: t('benefit_3_d') }
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-white
                         border border-slate-200 shadow-sm
                         hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300"
            >
              <div className="text-4xl">{f.icon}</div>
              <p className="mt-3 font-bold">{f.t}</p>
              <p className="text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">{t('courses_title')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: 'course_1_t', bullets: [t('course_1_b1'), t('course_1_b2'), t('course_1_b3')], color: 'from-rose-50 to-white' },
            { title: 'course_2_t', bullets: [t('course_2_b1'), t('course_2_b2'), t('course_2_b3')], color: 'from-amber-50 to-white' },
            { title: 'course_3_t', bullets: [t('course_3_b1'), t('course_3_b2'), t('course_3_b3')], color: 'from-amber-50 to-white' }
          ].map((c, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-gradient-to-br ${c.color}
                          border border-slate-200 shadow-sm
                          hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300`}
            >
              <h3 className="text-xl font-bold">{t(c.title)}</h3>
              <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
                {c.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <Link
                href="/inscripcion"
                className="inline-block mt-5 px-5 py-2 rounded-xl bg-rose-600 text-white
                           shadow-md hover:shadow-lg hover:bg-rose-700
                           active:scale-[.98] transition-transform duration-200
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
              >
                {t('courses_cta')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="prices" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">{t('pricing_title')}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { price: '€20', label: t('pricing_1_l'), features: [t('pricing_1_f1'), t('pricing_1_f2'), t('pricing_1_f3')], featured: false },
            { price: '€32', label: t('pricing_2_l'), features: [t('pricing_2_f1'), t('pricing_2_f2'), t('pricing_2_f3')], featured: true },
            { price: '€85', label: t('pricing_3_l'), features: [t('pricing_3_f1'), t('pricing_3_f2'), t('pricing_3_f3')], featured: false }
          ].map((p, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-sm
                ${p.featured
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                  : 'bg-white border border-slate-200'}
                hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300`}
            >
              <div className={`text-4xl font-extrabold ${p.featured ? '' : 'text-slate-900'}`}>{p.price}</div>
              <div className="opacity-90">{p.label}</div>
              <ul className={`mt-3 list-disc pl-5 space-y-1 ${p.featured ? 'text-rose-50' : 'text-slate-700'}`}>
                {p.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <Link
                href="/inscripcion"
                className={`inline-block mt-5 px-5 py-2 rounded-xl shadow
                    ${p.featured
                      ? 'bg-white text-rose-700 hover:bg-rose-50'
                      : 'bg-rose-600 text-white hover:bg-rose-700'}
                    active:scale-[.98] transition-transform duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500`}
              >
                {t('pricing_cta')}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">{t('pricing_note')}</p>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-14 text-center bg-gradient-to-br from-rose-50 to-white rounded-3xl">
        <h3 className="text-2xl md:text-3xl font-extrabold">{t('cta_final_title')}</h3>
        <p className="mt-2 text-slate-600">{t('cta_final_sub')}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inscripcion"
            className="px-6 py-3 rounded-2xl bg-rose-600 text-white shadow-md
                       hover:shadow-lg hover:bg-rose-700
                       active:scale-[.98] transition-transform duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
          >
            {t('hero_cta_trial')}
          </Link>
          <Link
            href="/test-nivel"
            className="px-6 py-3 rounded-2xl ring-1 ring-slate-300
                       hover:shadow-lg hover:bg-rose-50
                       active:scale-[.98] transition-transform duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
          >
            {t('hero_cta_test')}
          </Link>
        </div>
      </section>

      {/* Sticky CTA solo en móvil */}
      <div className="fixed bottom-4 inset-x-4 md:hidden flex gap-3 justify-center">
        <Link
          href="/inscripcion"
          className="flex-1 text-center px-4 py-3 rounded-xl bg-rose-600 text-white
                     shadow-md hover:shadow-lg active:scale-[.98] transition-transform duration-200"
        >
          {t('hero_cta_trial')}
        </Link>
        <Link
          href="/test-nivel"
          className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white
                     shadow-sm hover:bg-slate-50"
        >
          {t('level_test_short')}
        </Link>
      </div>

      <Footer />
    </div>
  );
}