import { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((registration) => registration.unregister()))
        .catch(() => {
          // noop: debug page muestra errores de red; no rompemos UI por cleanup de SW
        })
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta name="description" content="Biblioteca de alfajores App-Ceci" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
