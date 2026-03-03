export default function StarRating({ rating = 0, onChange, editable = false }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => onChange?.(star)}
          className={`${editable ? 'cursor-pointer' : 'cursor-default'} text-2xl leading-none`}
          aria-label={`Puntuar ${star}`}
        >
          <span className={star <= rating ? 'text-amber-400' : 'text-slate-300'}>★</span>
        </button>
      ))}
    </div>
  )
}
