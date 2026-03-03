import { createClient } from '@supabase/supabase-js'

export const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabaseUrl = rawUrl.trim()
export const supabaseKey = rawKey.trim()

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase env vars')
  }
}
