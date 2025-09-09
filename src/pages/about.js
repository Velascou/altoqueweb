import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Image from 'next/image';
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

export default function About() {
  const t = useTranslations(''); // usaremos el namespace "about"

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 to-white">
      <Navbar />
      <SeoHead />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 space-y-10">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t('about.title')}</h1>
          {/*<p className="text-slate-600 max-w-2xl mx-auto mt-2">{t('subtitle')}</p>*/}
        </header>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">{t('about.laia')} - <span className='italic text-slate-600'>{t('about.laia_sub')}</span></h2>
            <p className="text-slate-700">{t('about.background_copy_1')}</p>
            <p className="text-slate-700">{t('about.background_copy_2')}</p>
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
          <h2 className="text-xl font-bold mb-2">{t('about.method_title')}</h2>
          <p className="text-slate-700">{t('about.method_copy')}</p>
          <p className="text-slate-700 mt-4 font-semibold">{t('about.method_list_intro')}</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li className="text-slate-700">{t('about.point_1')}</li>
            <li className="text-slate-700">{t('about.point_2')}</li>
            <li className="text-slate-700">{t('about.point_3')}</li>
          </ul>
          <p className="text-slate-700 mt-4 font-semibold">{t('about.method_list_outro')}</p>
        </section>

        {/*<section id="method" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2">{t('method_title')}</h2>
          <p className="text-slate-700">{t('method_copy')}</p>
        </section>*/}

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-4 py-14 text-center bg-gradient-to-br from-rose-50 to-white rounded-3xl">
          <h3 className="text-2xl md:text-3xl font-extrabold">{t('cta_final_title')}</h3>
          <p className="mt-2 text-slate-600">{t('cta_final_sub')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="../inscripcion"
              className="px-6 py-3 rounded-2xl bg-rose-600 text-white shadow-md
                        hover:shadow-lg hover:bg-rose-700
                        active:scale-[.98] transition-transform duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
            >
              {t('hero_cta_trial')}
            </Link>
            <Link
              href="../test-nivel"
              className="px-6 py-3 rounded-2xl ring-1 ring-slate-300
                        hover:shadow-lg hover:bg-rose-50
                        active:scale-[.98] transition-transform duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
            >
              {t('hero_cta_test')}
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
