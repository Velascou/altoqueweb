import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const { locale, asPath } = useRouter();
  return (
    <div className="flex gap-2">
      <Link href={asPath} locale="en">
        <button className={`px-2 py-1 ${locale === 'en' ? 'font-bold underline' : ''}`}>EN</button>
      </Link>
      <Link href={asPath} locale="es">
        <button className={`px-2 py-1 ${locale === 'es' ? 'font-bold underline' : ''}`}>ES</button>
      </Link>
    </div>
  );
}
