import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StarRating from '../../components/StarRating'
import { createSignedImageUrl, deleteVino, fetchVinoById } from '../../lib/vinosApi'

function formatCatadoEn(catadoEn) {
  if (!catadoEn) return '—'

  const formatted = new Date(`${catadoEn}T00:00:00`).toLocaleDateString('es-AR')
  return formatted === 'Invalid Date' ? '—' : formatted
}

export default function VinoDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [vino, setVino] = useState(null)
  const [imageUrlCache, setImageUrlCache] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await fetchVinoById(id)
        let imageUrl = null

        if (data?.image_path) {
          imageUrl = imageUrlCache[data.image_path] || (await createSignedImageUrl(data.image_path))
        }

        if (data?.image_path && imageUrl) {
          setImageUrlCache((previousCache) => ({
            ...previousCache,
            [data.image_path]: imageUrl,
          }))
        }

        setVino({ ...data, imageUrl })
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [id])

  async function handleDelete() {
    setError('')

    const deleteId = vino?.id ?? id

    if (!deleteId || typeof deleteId !== 'string') {
      setError('ID faltante')
      return
    }

    if (!window.confirm('¿Eliminar este vino?')) return

    try {
      await deleteVino(deleteId, vino?.image_path)
      await router.push('/')
      router.refresh?.()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <main className="p-4 text-red-600">{error}</main>
  if (!vino) return <main className="p-4">Cargando...</main>

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 p-4">
      {vino.imageUrl ? (
        <img src={vino.imageUrl} alt={vino.name} className="h-72 w-full rounded-xl object-cover" />
      ) : (
        <div className="flex h-72 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-500">Sin Foto</div>
      )}
      <h1 className="text-3xl font-bold">{vino.name}</h1>
      <p className="text-lg text-slate-700">Bodega: {vino.winery || 'Sin bodega'}</p>
      <p className="text-lg text-slate-700">Varietal: {vino.varietal || 'Sin varietal'}</p>
      <p className="text-lg text-slate-700">Año: {vino.year || 'Sin año'}</p>
      <StarRating rating={vino.rating || 0} />
      <p className="whitespace-pre-line rounded bg-white p-3 shadow">{vino.review || 'Sin reseña'}</p>
      <p className="text-sm text-slate-500">Catado: {formatCatadoEn(vino.catado_en)}</p>
      <div className="flex gap-3">
        <Link href={`/edit/${vino.id}`} className="rounded bg-blue-600 px-4 py-2 text-white">
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
