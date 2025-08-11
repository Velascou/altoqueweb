'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
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

export default function Gracias() {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <SeoHead />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">{t('thank_you')}</h1>
        <p className="text-gray-700 mb-8">{t('thank_you_sub')}</p>
        <Link href="/">
          <button className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700">
            {t('go_home')}
          </button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
