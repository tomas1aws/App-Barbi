import { useState } from 'react'
import StarRating from './StarRating'
import { uploadImage } from '../lib/alfajoresApi'

export default function AlfajorForm({ onSubmit, initialValues = {}, submitText = 'Guardar' }) {
  const [name, setName] = useState(initialValues.name || '')
  const [brand, setBrand] = useState(initialValues.brand || '')
  const [rating, setRating] = useState(initialValues.rating || 0)
  const [review, setReview] = useState(initialValues.review || '')
  const [imagePath, setImagePath] = useState(initialValues.image_path || '')
  const [degustadoEn, setDegustadoEn] = useState(initialValues.degustado_en || '')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setErrorMessage('')

    try {
      const publicUrl = await uploadImage(file)
      setImagePath(publicUrl)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      await onSubmit({
        name,
        brand,
        rating,
        review,
        image_path: imagePath,
        degustado_en: degustadoEn || null,
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4 rounded-xl bg-white p-4 shadow" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Nombre</label>
        <input
          className="w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Marca</label>
        <input className="w-full rounded border p-2" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Puntuación</label>
        <StarRating rating={rating} onChange={setRating} editable />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Reseña</label>
        <textarea
          className="w-full rounded border p-2"
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Fecha de degustación</label>
        <input
          type="date"
          name="degustado_en"
          className="w-full rounded border p-2"
          value={degustadoEn}
          onChange={(e) => setDegustadoEn(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Foto</label>
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
        {imagePath && <img src={imagePath} alt="Vista previa" className="mt-2 h-32 w-32 rounded object-cover" />}
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-orange-500 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Guardando...' : submitText}
      </button>
    </form>
  )
}
