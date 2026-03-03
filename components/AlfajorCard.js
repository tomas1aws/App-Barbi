import Link from 'next/link'
import StarRating from './StarRating'

export default function AlfajorCard({ alfajor }) {
  return (
    <Link
      href={`/alfajores/${alfajor.id}`}
      className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-md"
    >
      <img
        src={alfajor.image_path || 'https://placehold.co/600x400?text=Sin+Foto'}
        alt={alfajor.name}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{alfajor.name}</h3>
        <StarRating rating={alfajor.rating || 0} />
      </div>
    </Link>
  )
}
