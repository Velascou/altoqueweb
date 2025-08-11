import Head from 'next/head';

export default function SeoHead({
  title = 'Al Toque — Spanish for Junior & Leaving Cert',
  description = 'Online Spanish courses with native teachers. Exam-focused. Free trial.',
  url = 'https://altoque.ie',
  image = '/logo-altoque.jpg'
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta property="og:type" content="website"/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={image}/>
      <meta property="og:url" content={url}/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={image}/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
  );
}
