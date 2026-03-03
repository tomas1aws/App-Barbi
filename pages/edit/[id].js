import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import VinoForm from '../../components/VinoForm'
import { createSignedImageUrl, fetchVinoById, removeImage, updateVino } from '../../lib/vinosApi'

export default function EditVinoPage() {
  const router = useRouter()
  const { id } = router.query
  const [vino, setVino] = useState(null)
  const [initialImageUrl, setInitialImageUrl] = useState('')
  const [imageUrlCache, setImageUrlCache] = useState({})
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await fetchVinoById(id)

        if (data?.image_path) {
          const cached = imageUrlCache[data.image_path]
          const signedUrl = cached || (await createSignedImageUrl(data.image_path))

          if (signedUrl) {
            setInitialImageUrl(signedUrl)
            setImageUrlCache((previousCache) => ({ ...previousCache, [data.image_path]: signedUrl }))
          }
        }

        setVino(data)
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [id])

  async function handleUpdate(payload) {
    setError('')
    setSuccessMessage('')

    const editId = vino?.id ?? id

    if (!editId || typeof editId !== 'string') {
      setError('ID faltante')
      return
    }

    try {
      const normalizedPayload = {
        name: payload.name,
        winery: payload.winery,
        varietal: payload.varietal,
        year: payload.year,
        rating: payload.rating,
        review: payload.review,
        catado_en: payload.catado_en || null,
      }

      if (payload.image_path && payload.image_path !== vino?.image_path) {
        normalizedPayload.image_path = payload.image_path
      }

      await updateVino(editId, normalizedPayload)

      if (normalizedPayload.image_path && vino?.image_path && normalizedPayload.image_path !== vino.image_path) {
        await removeImage(vino.image_path)
      }

      setSuccessMessage('Vino actualizado correctamente')
      router.push(`/vinos/${editId}`)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  if (error && !vino) return <main className="p-4 text-red-600">{error}</main>
  if (!vino) return <main className="p-4">Cargando...</main>

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Vino</h1>
        <Link href={`/vinos/${vino?.id ?? id}`} className="text-orange-600">
          Volver
        </Link>
      </div>
      <VinoForm initialValues={vino} initialImageUrl={initialImageUrl} onSubmit={handleUpdate} submitText="Guardar cambios" />
      {successMessage && <p className="mt-3 text-sm text-green-700">{successMessage}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </main>
  )
}
