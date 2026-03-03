import { useRouter } from 'next/router'
import Link from 'next/link'
import VinoForm from '../components/VinoForm'
import { createVino } from '../lib/vinosApi'

export default function NewVinoPage() {
  const router = useRouter()

  async function handleCreate(payload) {
    const created = await createVino(payload)
    router.push(`/vinos/${created.id}`)
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nuevo Vino</h1>
        <Link href="/" className="text-orange-600">
          Volver
        </Link>
      </div>
      <VinoForm onSubmit={handleCreate} submitText="Crear vino" />
    </main>
  )
}
