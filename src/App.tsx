import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthPage } from './pages/AuthPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { JoyPage } from './pages/JoyPage'
import { MessagesPage } from './pages/MessagesPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuth } from './lib/AuthContext'
import { navigateTo } from './lib/utils'
import { supabase } from './lib/supabase'

const publicPaths = ['/login', '/signup', '/forgot-password']
const appPaths = ['/discover', '/messages', '/joy', '/profile']
const readDemoMode = () => sessionStorage.getItem('tiramisu-demo-mode') === 'true' || sessionStorage.getItem('vibe-demo-mode') === 'true' || new URLSearchParams(window.location.search).get('demo') === '1'

export default function App() {
  const [path, setPath] = useState(window.location.pathname || '/discover')
  const [demoMode, setDemoMode] = useState(readDemoMode)
  const [supabaseData, setSupabaseData] = useState<any[]>([])
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const { user, loading } = useAuth()

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/discover')
      setDemoMode(readDemoMode())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client) return

    let isActive = true

    const loadProfiles = async () => {
      try {
        const { data, error } = await client.from('profiles').select('*').limit(5)

        if (!isActive) return

        if (error) {
          setSupabaseError(error.message)
          return
        }

        setSupabaseData(data ?? [])
        setSupabaseError(null)
      } catch (error) {
        if (isActive) setSupabaseError(error instanceof Error ? error.message : 'Unknown Supabase error')
      }
    }

    void loadProfiles()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (user && (publicPaths.includes(path) || path === '/')) navigateTo('/discover')
    if (!user && !demoMode && !publicPaths.includes(path)) navigateTo('/login')
  }, [demoMode, loading, path, user])

  if (loading) return <div className="loading-screen"><div className="loading-mark">T<span>✦</span></div><p>Finding your way in…</p></div>
  if ((!user && !demoMode) || publicPaths.includes(path)) return <AuthPage mode={path === '/signup' ? 'signup' : path === '/forgot-password' ? 'forgot' : 'login'} />

  const activePath = appPaths.includes(path) ? path : '/discover'
  const screen = activePath === '/messages' ? <MessagesPage /> : activePath === '/joy' ? <JoyPage /> : activePath === '/profile' ? <ProfilePage /> : <DiscoverPage />

  return (
    <>
      {supabaseData.length > 0 && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50, background: 'rgba(13, 18, 32, 0.9)', border: '1px solid rgba(200,255,90,0.3)', color: '#fff', padding: '10px 12px', borderRadius: 12, fontSize: 12, maxWidth: 260 }}>
          Supabase connected: {supabaseData.length} profile rows loaded.
        </div>
      )}
      {supabaseError && (
        <div style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 50, background: 'rgba(30, 12, 18, 0.92)', border: '1px solid rgba(255, 120, 120, 0.35)', color: '#fff', padding: '10px 12px', borderRadius: 12, fontSize: 12, maxWidth: 300 }}>
          Supabase query status: {supabaseError}
        </div>
      )}
      <AppShell path={activePath} demoMode={demoMode && !user}>{screen}</AppShell>
    </>
  )
}
