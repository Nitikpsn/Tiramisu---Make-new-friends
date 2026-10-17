import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const env = (globalThis as typeof globalThis & { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_TIRAMISU_SUPABASE_URL ?? env.NEXT_PUBLIC_Tiramisu_SUPABASE_URL),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_TIRAMISU_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_Tiramisu_SUPABASE_ANON_KEY),
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 3000,
  },
})
