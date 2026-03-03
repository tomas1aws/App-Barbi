import { createClient } from '@supabase/supabase-js'

export const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabaseUrl = rawUrl.trim()
export const supabaseKey = rawKey.trim()

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase env vars')
  }
}
