'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InscripcionForm from '../components/InscripcionForm';
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

export default function Inscripcion() {
  const t = useTranslations();        // textos de la página
  const tf = useTranslations('form'); // textos del formulario

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 to-white">
      <Navbar />
      <SeoHead />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10"> {/* más ancho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {t('insc_title')}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t('insc_sub')}
          </p>
        </div>

        {/* Orden vertical: primero “what you get”, después formulario */}
        <aside className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-2">{t('insc_sidebar_title')}</h2>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            <li>{t('insc_sidebar_b1')}</li>
            <li>{t('insc_sidebar_b2')}</li>
            <li>{t('insc_sidebar_b3')}</li>
          </ul>
          <div className="mt-6 text-sm text-slate-500">
            {t('insc_sidebar_note')}
          </div>
        </aside>

        <InscripcionForm t={tf} />
      </main>
      <Footer />
    </div>
  );
}