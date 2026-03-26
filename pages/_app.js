import Head from 'next/head'
import dynamic from 'next/dynamic'
import '../global.css'

// Load IndigoBot only on client side (uses localStorage + browser APIs)
const IndigoBot = dynamic(() => import('../components/IndigoBot'), { ssr: false })

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
      <Component {...pageProps} />
      <IndigoBot />
    </>
  )
}
