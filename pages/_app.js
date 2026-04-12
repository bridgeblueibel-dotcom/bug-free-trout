import Head from 'next/head'
import Script from 'next/script'
import '../global.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Google Tag — GT-KT9BDB8L + Google Ads AW-18059698700 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GT-KT9BDB8L"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GT-KT9BDB8L');
        gtag('config', 'AW-18059698700');
      `}</Script>
      <Component {...pageProps} />
    </>
  )
}

