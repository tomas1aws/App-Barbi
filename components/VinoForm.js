import { useEffect, useState } from 'react'
import StarRating from './StarRating'
import { uploadImage } from '../lib/vinosApi'

export default function VinoForm({ onSubmit, initialValues = {}, initialImageUrl = '', submitText = 'Guardar' }) {
  const [name, setName] = useState(initialValues.name || '')
  const [winery, setWinery] = useState(initialValues.winery || '')
  const [varietal, setVarietal] = useState(initialValues.varietal || '')
  const [year, setYear] = useState(initialValues.year || '')
  const [rating, setRating] = useState(initialValues.rating || 0)
  const [review, setReview] = useState(initialValues.review || '')
  const [imagePath, setImagePath] = useState(initialValues.image_path || '')
  const [previewUrl, setPreviewUrl] = useState('')
  const [catadoEn, setCatadoEn] = useState(initialValues.catado_en || '')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)
    setLoading(true)
    setErrorMessage('')

    try {
      const nextImagePath = await uploadImage(file, initialValues.id)
      setImagePath(nextImagePath)
    } catch (error) {
      URL.revokeObjectURL(localPreviewUrl)
      setPreviewUrl('')
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
        winery,
        varietal,
        year: year === '' ? null : Number(year),
        rating,
        review,
        image_path: imagePath || null,
        catado_en: catadoEn || null,
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const imagePreviewToShow = previewUrl || initialImageUrl

  return (
    <form className="space-y-4 rounded-xl bg-white p-4 shadow" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Nombre</label>
        <input className="w-full rounded border p-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Bodega</label>
        <input className="w-full rounded border p-2" value={winery} onChange={(e) => setWinery(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Varietal</label>
        <input className="w-full rounded border p-2" value={varietal} onChange={(e) => setVarietal(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Año</label>
        <input
          type="number"
          min="0"
          className="w-full rounded border p-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
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
        <label className="mb-1 block text-sm font-medium">Fecha de cata</label>
        <input
          type="date"
          name="catado_en"
          className="w-full rounded border p-2"
          value={catadoEn}
          onChange={(e) => setCatadoEn(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Foto</label>
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
        {imagePreviewToShow ? (
          <img src={imagePreviewToShow} alt="Vista previa" className="mt-2 h-32 w-32 rounded object-cover" />
        ) : (
          <div className="mt-2 flex h-32 w-32 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">Sin Foto</div>
        )}
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
