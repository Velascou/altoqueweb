import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export async function getStaticProps({ locale = 'en' }) {
  const l = locale || 'en';
  const load = async (code) => {
    try { const m = await import(`../locales/${code}.json`); return m?.default ?? m; }
    catch { return null; }
  };
  const messages = (await load(l)) || (await load('en')) || {};
  return { props: { messages, locale: l } };
}

export default function About() {
  const t = useTranslations('about'); // usaremos el namespace "about"

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 to-white">
      <Navbar />
      <SeoHead />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 space-y-10">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t('title')}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-2">{t('subtitle')}</p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{t('mission_title')}</h2>
            <p className="text-slate-700">{t('mission_copy')}</p>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>{t('point_1')}</li>
              <li>{t('point_2')}</li>
              <li>{t('point_3')}</li>
            </ul>
          </div>

          <div className="relative w-full h-96 overflow-hidden rounded-3xl">
            <Image
              src="/teacher2.jpg"
              alt="Al Toque"
              fill
              className="object-cover fade-mask"
            />
          </div>
        </section>

        <section id="team" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2">{t('team_title')}</h2>
          <p className="text-slate-700">{t('team_copy')}</p>
        </section>

        <section id="method" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2">{t('method_title')}</h2>
          <p className="text-slate-700">{t('method_copy')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
