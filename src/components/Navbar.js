'use client';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Pacifico } from 'next/font/google';
import { useTranslations } from 'next-intl';

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale
    }
  };
}

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations(); // namespace raíz

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          
          <Image
            src="/mano_sin_fondo.png"
            alt="Al Toque"
            width={100}
            height={100}
            className="object-contain"
          />
          
          <div className="leading-tight">
            <div className={`${pacifico.className} text-[40px] sm:text-[40px] text-rose-600 group-hover:text-rose-700 transition-colors`}>
              al toque
            </div>
            <div className="text-[20px] tracking-widest uppercase text-amber-500">
              spanish on point
            </div>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#courses" className="text-slate-700 hover:text-slate-900">{t('courses')}</Link>
          <Link href="/#prices" className="text-slate-700 hover:text-slate-900">{t('prices')}</Link>
          <Link href="/test-nivel" className="text-slate-700 hover:text-slate-900">{t('test')}</Link>
          <Link
            href="/inscripcion"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white shadow-md
                       hover:bg-rose-700 hover:shadow-lg active:scale-[.98]
                       transition-transform duration-200"
          >
            {t('register1')}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile trigger */}
        <button
          className="md:hidden p-2 rounded-lg ring-1 ring-slate-300"
          aria-label="Menu"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-3">
            <Link href="/#courses" onClick={() => setOpen(false)} className="block">Courses</Link>
            <Link href="/#prices" onClick={() => setOpen(false)} className="block">Prices</Link>
            <Link href="/test-nivel" onClick={() => setOpen(false)} className="block">Level Test</Link>
            <Link
              href="/inscripcion"
              onClick={() => setOpen(false)}
              className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-center shadow-md hover:bg-rose-700"
            >
              Sign up
            </Link>
            <div className="pt-2"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </header>
  );
}