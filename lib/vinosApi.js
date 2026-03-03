import { supabase, assertSupabaseEnv } from './supabaseClient'

function getSupabaseClient() {
  assertSupabaseEnv()

  if (!supabase) {
    throw new Error('No se pudo inicializar el cliente de Supabase.')
  }

  return supabase
}

export async function fetchVinos() {
  const client = getSupabaseClient()

  const { data, error } = await client.from('vinos').select('*').order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchVinoById(id) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('Missing vino id')
  }

  const { data, error } = await client.from('vinos').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export async function createVino(payload) {
  const client = getSupabaseClient()

  const { data, error } = await client.from('vinos').insert(payload).select('*').single()

  if (error) throw error
  return data
}

export async function updateVino(id, payload) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('ID faltante')
  }

  const { data, error } = await client.from('vinos').update(payload).eq('id', id).select().single()

  if (error) throw error
  return data
}

function getStoragePathFromPublicUrl(publicUrl) {
  if (!publicUrl) return null

  const marker = '/storage/v1/object/public/vinos/'
  const markerIndex = publicUrl.indexOf(marker)
  if (markerIndex === -1) return null

  return publicUrl.slice(markerIndex + marker.length)
}

export async function deleteVino(id, imagePath) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('Missing vino id')
  }

  const { error } = await client.from('vinos').delete().eq('id', id)
  if (error) throw error

  const storagePath = getStoragePathFromPublicUrl(imagePath)
  if (!storagePath) return

  const { error: storageError } = await client.storage.from('vinos').remove([storagePath])
  if (storageError) {
    console.warn('No se pudo borrar la imagen del bucket vinos:', storageError.message)
  }
}

export async function uploadImage(file) {
  const client = getSupabaseClient()
  const fileName = `${Date.now()}-${file.name}`
  const { error } = await client.storage.from('vinos').upload(fileName, file)

  if (error) throw error

  const { data } = client.storage.from('vinos').getPublicUrl(fileName)
  return data.publicUrl
}
