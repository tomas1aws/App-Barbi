import Link from 'next/link'
import { useEffect, useState } from 'react'
import VinoCard from '../components/VinoCard'
import { fetchVinos } from '../lib/vinosApi'

export default function HomePage() {
  const [vinos, setVinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchVinos()
        setVinos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">App-Barbi · Biblioteca de Vinos</h1>
        <div className="flex gap-2">
          <Link href="/new" className="rounded bg-orange-500 px-4 py-2 text-white">
            + Nuevo
          </Link>
        </div>
      </header>

      {loading && <p>Cargando vinos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vinos.map((vino) => (
          <VinoCard key={vino.id} vino={vino} />
        ))}
      </section>
    </main>
  )
}
