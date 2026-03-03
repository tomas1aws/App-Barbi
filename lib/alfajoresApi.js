import { supabase, assertSupabaseEnv } from './supabaseClient'

function getSupabaseClient() {
  assertSupabaseEnv()

  if (!supabase) {
    throw new Error('No se pudo inicializar el cliente de Supabase.')
  }

  return supabase
}

export async function fetchAlfajores() {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchAlfajorById(id) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('Missing alfajor id')
  }

  const { data, error } = await client
    .from('alfajores')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) {
    throw new Error('No se encontró el alfajor solicitado')
  }
  return data
}

export async function createAlfajor(payload) {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateAlfajor(id, payload) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('ID faltante')
  }

  const { data, error } = await client
    .from('alfajores')
    .update(payload)
    .eq('id', id)
    .select('*')

  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('No se encontró el alfajor para actualizar')
  }

  return data[0]
}

function getStoragePathFromPublicUrl(publicUrl) {
  if (!publicUrl) return null

  const marker = '/storage/v1/object/public/alfajores/'
  const markerIndex = publicUrl.indexOf(marker)
  if (markerIndex === -1) return null

  return publicUrl.slice(markerIndex + marker.length)
}

export async function deleteAlfajor(id, imagePath) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('Missing alfajor id')
  }

  const { error } = await client.from('alfajores').delete().eq('id', id)
  if (error) throw error

  const storagePath = getStoragePathFromPublicUrl(imagePath)
  if (!storagePath) return

  const { error: storageError } = await client.storage.from('alfajores').remove([storagePath])
  if (storageError) {
    console.warn('No se pudo borrar la imagen del bucket alfajores:', storageError.message)
  }
}

export async function uploadImage(file) {
  const client = getSupabaseClient()
  const fileName = `${Date.now()}-${file.name}`
  const { error } = await client.storage.from('alfajores').upload(fileName, file)

  if (error) throw error

  const { data } = client.storage.from('alfajores').getPublicUrl(fileName)
  return data.publicUrl
}
