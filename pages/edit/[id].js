import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AlfajorForm from '../../components/AlfajorForm'
import { fetchAlfajorById, updateAlfajor } from '../../lib/alfajoresApi'

export default function EditAlfajorPage() {
  const router = useRouter()
  const { id } = router.query
  const [alfajor, setAlfajor] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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

  async function handleUpdate(payload) {
    setError('')
    setSuccessMessage('')

    const editId = alfajor?.id ?? id

    if (!editId || typeof editId !== 'string') {
      setError('ID faltante')
      return
    }

    console.log('EDIT id:', editId)

    try {
      const normalizedPayload = {
        name: payload.name,
        brand: payload.brand,
        rating: payload.rating,
        review: payload.review,
        degustado_en: payload.degustado_en || null,
      }

      if (payload.image_path && payload.image_path !== alfajor?.image_path) {
        normalizedPayload.image_path = payload.image_path
      }

      const updated = await updateAlfajor(editId, normalizedPayload)
      setSuccessMessage('Alfajor actualizado correctamente')
      router.push(`/alfajores/${editId}`)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  if (error && !alfajor) return <main className="p-4 text-red-600">{error}</main>
  if (!alfajor) return <main className="p-4">Cargando...</main>

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Alfajor</h1>
        <Link href={`/alfajores/${alfajor?.id ?? id}`} className="text-orange-600">
          Volver
        </Link>
      </div>
      <AlfajorForm initialValues={alfajor} onSubmit={handleUpdate} submitText="Guardar cambios" />
      {successMessage && <p className="mt-3 text-sm text-green-700">{successMessage}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </main>
  )
}
