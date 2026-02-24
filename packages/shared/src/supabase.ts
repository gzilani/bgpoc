import { createClient } from '@supabase/supabase-js'

// Vite uses import.meta.env; Next.js and Expo use process.env
const env = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : (typeof process !== 'undefined' ? process.env : {})

const supabaseUrl: string =
    (env as Record<string, string>).VITE_SUPABASE_URL ||
    (env as Record<string, string>).NEXT_PUBLIC_SUPABASE_URL ||
    (env as Record<string, string>).EXPO_PUBLIC_SUPABASE_URL ||
    ''

const supabaseAnonKey: string =
    (env as Record<string, string>).VITE_SUPABASE_ANON_KEY ||
    (env as Record<string, string>).NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (env as Record<string, string>).EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

