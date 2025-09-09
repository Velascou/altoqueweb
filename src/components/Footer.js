// src/components/Footer.jsx
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

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-3 text-sm text-slate-600">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo_100x100.png"
              alt="Al Toque"
              className="h-16 w-16 rounded-xl ring-1 ring-slate-200"
            />
            <div>
              <p className="font-extrabold text-slate-900 leading-none">Al Toque</p>
              <p className="text-xs text-rose-700 font-medium">Spanish on point</p>
            </div>
          </div>
          <p className="text-slate-600">
            {t('hero_sub')}
          </p>
        </div>

        {/* Contact */}
        <div>
          <p className="font-semibold text-slate-900 mb-3">Contact</p>
          <ul className="space-y-1">
            <li>
              <a
                href="mailto:altoquespanish@gmail.com"
                className="hover:text-rose-700 underline-offset-4 hover:underline"
              >
                altoquespanish@gmail.com
              </a>
            </li>
            <li>Dublin, Ireland</li>
          </ul>
          {/* Socials */}
          <div className="mt-4 flex items-center gap-3">
            <Link
              href="https://www.instagram.com/altoquespanish/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-rose-300 hover:shadow-sm transition"
            >
              <img
                src="/icons/instagram.png"
                alt=""
                className="h-5 w-5 opacity-80 group-hover:opacity-100"
              />
            </Link>

            <Link
              href="https://wa.me/353851853689"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-rose-300 hover:shadow-sm transition"
            >
              <img
                src="/icons/whatsapp.png"
                alt=""
                className="h-5 w-5 opacity-80 group-hover:opacity-100"
              />
            </Link>

            <Link
              href="https://www.facebook.com/profile.php?id=61578294612350"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-rose-300 hover:shadow-sm transition"
            >
              <img
                src="/icons/facebook.png"
                alt=""
                className="h-5 w-5 opacity-80 group-hover:opacity-100"
              />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="font-semibold text-slate-900 mb-3">Links</p>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:text-rose-700 underline-offset-4 hover:underline">
                About us
              </Link>
            </li>
            <li>
              <Link href="/horarios" className="hover:text-rose-700 underline-offset-4 hover:underline">
                Schedule
              </Link>
            </li>
            <li className="pt-2">
              <Link href="/terms" className="hover:text-rose-700 underline-offset-4 hover:underline">
                Terms
              </Link>{' '}
              ·{' '}
              <Link href="/privacy" className="hover:text-rose-700 underline-offset-4 hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} · Al Toque Spanish Academy
          </span>
          <span>
            Web designed by{' '}
            <a
              href="https://www.linkedin.com/in/diego-vp/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-rose-700 underline-offset-4 hover:underline"
            >
              Diego Velasco
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}