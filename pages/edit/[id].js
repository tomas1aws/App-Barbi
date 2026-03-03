import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import VinoForm from '../../components/VinoForm'
import { fetchVinoById, updateVino } from '../../lib/vinosApi'

export default function EditVinoPage() {
  const router = useRouter()
  const { id } = router.query
  const [vino, setVino] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await fetchVinoById(id)
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
      <VinoForm initialValues={vino} onSubmit={handleUpdate} submitText="Guardar cambios" />
      {successMessage && <p className="mt-3 text-sm text-green-700">{successMessage}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </main>
  )
}
