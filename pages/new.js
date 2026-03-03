import { useRouter } from 'next/router'
import Link from 'next/link'
import AlfajorForm from '../components/AlfajorForm'
import { createAlfajor } from '../lib/alfajoresApi'

export default function NewAlfajorPage() {
  const router = useRouter()

  async function handleCreate(payload) {
    const created = await createAlfajor(payload)
    router.push(`/alfajores/${created.id}`)
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo Alfajor</h1>
        <Link href="/" className="text-orange-600">
          Volver
        </Link>
      </div>
      <AlfajorForm onSubmit={handleCreate} submitText="Crear alfajor" />
    </main>
  )
}
