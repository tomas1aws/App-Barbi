import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StarRating from '../../components/StarRating'
import { deleteAlfajor, fetchAlfajorById } from '../../lib/alfajoresApi'

function formatDegustadoEn(degustadoEn) {
  if (!degustadoEn) return '—'

  const formatted = new Date(`${degustadoEn}T00:00:00`).toLocaleDateString('es-AR')
  return formatted === 'Invalid Date' ? '—' : formatted
}

export default function AlfajorDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [alfajor, setAlfajor] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await fetchAlfajorById(id)
        setAlfajor(data)
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [id])

  async function handleDelete() {
    setError('')

    const deleteId = alfajor?.id ?? id

    if (!deleteId || typeof deleteId !== 'string') {
      setError('ID faltante')
      return
    }

    if (!window.confirm('¿Eliminar este alfajor?')) return

    console.log('DELETE id:', deleteId)

    try {
      await deleteAlfajor(deleteId, alfajor?.image_path)
      await router.push('/')
      router.refresh?.()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <main className="p-4 text-red-600">{error}</main>
  if (!alfajor) return <main className="p-4">Cargando...</main>

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 p-4">
      <img
        src={alfajor.image_path || 'https://placehold.co/600x400?text=Sin+Foto'}
        alt={alfajor.name}
        className="h-72 w-full rounded-xl object-cover"
      />
      <h1 className="text-3xl font-bold">{alfajor.name}</h1>
      <p className="text-lg text-slate-700">Marca: {alfajor.brand || 'Sin marca'}</p>
      <StarRating rating={alfajor.rating || 0} />
      <p className="whitespace-pre-line rounded bg-white p-3 shadow">{alfajor.review || 'Sin reseña'}</p>
      <p className="text-sm text-slate-500">
        Degustado: {formatDegustadoEn(alfajor.degustado_en)}
      </p>
      <div className="flex gap-3">
        <Link href={`/edit/${alfajor.id}`} className="rounded bg-blue-600 px-4 py-2 text-white">
          Editar
        </Link>
        <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white">
          Eliminar
        </button>
        <Link href="/" className="rounded border px-4 py-2">
          Inicio
        </Link>
      </div>
    </main>
  )
}
