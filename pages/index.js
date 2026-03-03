import Link from 'next/link'
import { useEffect, useState } from 'react'
import AlfajorCard from '../components/AlfajorCard'
import { fetchAlfajores } from '../lib/alfajoresApi'

export default function HomePage() {
  const [alfajores, setAlfajores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAlfajores()
        setAlfajores(data)
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
        <h1 className="text-2xl font-bold">App-Ceci · Biblioteca de Alfajores</h1>
        <div className="flex gap-2">
          <Link href="/new" className="rounded bg-orange-500 px-4 py-2 text-white">
            + Nuevo
          </Link>
        </div>
      </header>

      {loading && <p>Cargando alfajores...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alfajores.map((alfajor) => (
          <AlfajorCard key={alfajor.id} alfajor={alfajor} />
        ))}
      </section>
    </main>
  )
}
