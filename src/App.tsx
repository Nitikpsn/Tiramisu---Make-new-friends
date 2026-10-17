import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AuthPage } from './pages/AuthPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { JoyPage } from './pages/JoyPage'
import { MessagesPage } from './pages/MessagesPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuth } from './lib/AuthContext'
import { navigateTo } from './lib/utils'

const publicPaths = ['/login', '/signup', '/forgot-password']
const appPaths = ['/discover', '/messages', '/joy', '/profile']

export default function App() {
  const [path, setPath] = useState(window.location.pathname || '/discover')
  const { user, loading } = useAuth()

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/discover')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (loading) return
    if (user && (publicPaths.includes(path) || path === '/')) navigateTo('/discover')
    if (!user && !publicPaths.includes(path)) navigateTo('/login')
  }, [loading, path, user])

  if (loading) return <div className="loading-screen"><div className="loading-mark">T<span>✦</span></div><p>Finding your way in…</p></div>
  if (!user || publicPaths.includes(path)) return <AuthPage mode={path === '/signup' ? 'signup' : path === '/forgot-password' ? 'forgot' : 'login'} />

  const activePath = appPaths.includes(path) ? path : '/discover'
  const screen = activePath === '/messages' ? <MessagesPage /> : activePath === '/joy' ? <JoyPage /> : activePath === '/profile' ? <ProfilePage /> : <DiscoverPage />

  return (
    <>
      <AppShell path={activePath}>{screen}</AppShell>
    </>
  )
}
