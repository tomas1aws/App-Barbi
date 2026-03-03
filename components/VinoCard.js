import Link from 'next/link'
import StarRating from './StarRating'

export default function VinoCard({ vino }) {
  return (
    <Link href={`/vinos/${vino.id}`} className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-md">
      <img
        src={vino.image_path || 'https://placehold.co/600x400?text=Sin+Foto'}
        alt={vino.name}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{vino.name}</h3>
        <p className="text-sm text-slate-700">{vino.winery || 'Sin bodega'}</p>
        <StarRating rating={vino.rating || 0} />
      </div>
    </Link>
  )
}
