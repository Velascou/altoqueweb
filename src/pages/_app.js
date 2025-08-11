'use client';
import { IntlProvider } from 'next-intl';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  const locale = pageProps?.locale || 'en';
  const messages = pageProps?.messages || {}; // ← nunca undefined

  return (
    <IntlProvider messages={messages} locale={locale}>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
      <>
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </>
    </IntlProvider>
    
  );
}
export default MyApp;
