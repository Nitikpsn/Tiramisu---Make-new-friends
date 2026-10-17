import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as Record<string, string | undefined>

// Vite exposes VITE_* variables by default. These aliases keep existing
// deployments working while making the supported names explicit.
const supabaseUrl = env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_TIRAMISU_SUPABASE_URL ?? env.NEXT_PUBLIC_Tiramisu_SUPABASE_URL
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_TIRAMISU_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_Tiramisu_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey
)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const supabaseConfigMessage =
  'Supabase is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then redeploy.'
