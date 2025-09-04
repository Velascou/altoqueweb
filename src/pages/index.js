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
            <p className="mt-4 text-lg/7 text-rose-50/90">
              {t('hero_sub_2')}
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
              src="/batukada.jpg"
              alt="Al Toque"
              width={520}
              height={520}
              className="relative w-full h-96 overflow-hidden rounded-3xl object-cover fade-mask"
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
            { img: '/fallas.jpg',  alt: 'Learning', t: t('benefit_1_t'), d: t('benefit_1_d'), href:'/about#method' },
            { img: '/teacher.jpg',    alt: 'Team',        t: t('benefit_2_t'), d: t('benefit_2_d'), href:'/about#team' },
            { img: '/flexschedule.jpg',alt: 'Schedule',     t: t('benefit_3_t'), d: t('benefit_3_d'), href:'/horarios' }
          ].map((f, i) => (
            <Link key={i} href={f.href} className="block group">
              <article className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                
                {/* Imagen superior: ocupa el ancho del card, altura fija responsive, sin superponerse */}
                <figure className="relative w-full h-44 md:h-48 overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.alt}
                    fill
                    priority={i === 0}
                    className="object-cover mask-bottom transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </figure>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="font-bold">{f.t}</h3>
                  <p className="text-slate-600">{f.d}</p>
                  <span className="inline-block mt-3 text-sm text-rose-700 underline">Learn more</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">{t('courses_title')} <span className="italic underline decoration-rose-600">{t('courses_title_*')}</span></h2>
        <h4 className="text-center text-slate-600 mt-2 max-w-xl mx-auto">{t('courses_subtitle')}</h4>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'course_1_t', bullets: [t('course_1_b1'), t('course_1_b2')], color: 'from-rose-50 to-white' },
            { title: 'course_2_t', bullets: [t('course_2_b1'), t('course_2_b2')], color: 'from-rose-50 to-white' },
            { title: 'course_3_t', bullets: [t('course_3_b1'), t('course_3_b2')], color: 'from-amber-50 to-white' },
            { title: 'course_4_t', bullets: [t('course_4_b1'), t('course_4_b2')], color: 'from-amber-50 to-white' }
          ].map((c, i) => (
            <div
              key={i}
              className={`flex flex-col justify-between h-full p-8 rounded-2xl bg-gradient-to-br ${c.color}
                          border border-slate-200 shadow-sm
                          hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300`}
            >
              <h3 className="text-xl font-bold">{t(c.title)}</h3>
              <h4 className="mt-2 font-semibold">{c.bullets[0]}</h4>
              <p className="text-slate-600">{c.bullets[1]}</p>
              <div className="pt-6">
                <Link
                  href="/inscripcion"
                  className="inline-block px-5 py-2 rounded-xl bg-rose-600 text-white
                        shadow-md hover:shadow-lg hover:bg-rose-700
                        active:scale-[.98] transition-transform duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
                >
                  {t('courses_cta')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="prices" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">{t('pricing_title')}</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-4 items-stretch">
          {[
            { price: '€22', label: t('pricing_1_l'), features: [t('pricing_1_f1'), t('pricing_1_f2')], featured: false },
            { price: '€100', label: t('pricing_2_l'), features: [t('pricing_2_f1'), t('pricing_2_f2')], featured: false },
            { price: '€160', label: t('pricing_3_l'), features: [t('pricing_3_f1'), t('pricing_3_f2')], featured: true },
            { price: '€30', label: t('pricing_4_l'), features: [t('pricing_4_f1'), t('pricing_4_f2')], featured: false }
          ].map((p, i) => (
            <div
              key={i}
              className={`flex flex-col h-full rounded-2xl shadow-sm p-6
                ${p.featured
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                  : 'bg-white border border-slate-200'}
                hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300`}
            >
              {/* Contenido (ocupa el espacio disponible) */}
              <div className="flex-1">
                <div className={`text-4xl font-extrabold ${p.featured ? '' : 'text-slate-900'}`}>
                  {p.price}
                </div>
                <div className="opacity-90 font-semibold">{p.label}</div>
                <ul className={`mt-3 list-disc pl-5 space-y-1 ${p.featured ? 'text-rose-50' : 'text-slate-700'}`}>
                  {p.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* CTA siempre abajo */}
              <div className="pt-6">
                <Link
                  href="/inscripcion"
                  className={`inline-block text-center px-5 py-2 rounded-xl shadow
                    ${p.featured
                      ? 'bg-white text-rose-700 hover:bg-rose-50'
                      : 'bg-rose-600 text-white hover:bg-rose-700'}
                    active:scale-[.98] transition-transform duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500`}
                >
                  {t('pricing_cta')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 mx-auto max-w-xl">
          <h4 className="text-lg font-bold mb-2 text-center">{t('pricing_includes_title')}</h4>
          <ul className="list-none space-y-2 text-slate-700 text-base">
            <li>• {t('pricing_includes_1')}</li>
            <li>• {t('pricing_includes_2')}</li>
            <li>• {t('pricing_includes_3')}</li>
            <li>• {t('pricing_includes_4')}</li>
          </ul>
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
