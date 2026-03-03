import { supabase, assertSupabaseEnv } from './supabaseClient'

function getSupabaseClient() {
  assertSupabaseEnv()

  if (!supabase) {
    throw new Error('No se pudo inicializar el cliente de Supabase.')
  }

  return supabase
}

function buildStoragePath(fileName, prefix = '') {
  const cleanedFileName = fileName?.replace(/\s+/g, '-') || 'imagen'
  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`

  return prefix ? `${prefix}/${uniqueId}-${cleanedFileName}` : `${uniqueId}-${cleanedFileName}`
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

export async function removeImage(imagePath) {
  const client = getSupabaseClient()

  if (!imagePath) return

  const { error } = await client.storage.from('vinos').remove([imagePath])
  if (error) {
    console.warn('No se pudo borrar la imagen del bucket vinos:', error.message)
  }
}

export async function deleteVino(id, imagePath) {
  const client = getSupabaseClient()

  if (!id) {
    throw new Error('Missing vino id')
  }

  const { error } = await client.from('vinos').delete().eq('id', id)
  if (error) throw error

  await removeImage(imagePath)
}

export async function uploadImage(file, pathPrefix = '') {
  const client = getSupabaseClient()

  if (!file) {
    throw new Error('Archivo de imagen faltante')
  }

  const filePath = buildStoragePath(file.name, pathPrefix)
  const { error } = await client.storage.from('vinos').upload(filePath, file)

  if (error) throw error

  return filePath
}

export async function createSignedImageUrl(imagePath, expiresIn = 60 * 60) {
  const client = getSupabaseClient()

  if (!imagePath) {
    return null
  }

  const { data, error } = await client.storage.from('vinos').createSignedUrl(imagePath, expiresIn)

  if (error) {
    console.warn('No se pudo generar signed url para imagen:', error.message)
    return null
  }

  return data?.signedUrl || null
}
