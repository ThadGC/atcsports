import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Seo from '../components/Seo.jsx'

export default function RequireAuth({ children, title = 'My account' }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  // The gate renders before the page does, so it carries the title itself,
  // otherwise the prerendered shell for this route would ship with no <title>.
  if (!ready) {
    return (
      <div className="grid min-h-[70dvh] place-items-center px-6">
        <Seo
          title={title}
          description="Manage your ATC Sports athletes, divisions and season registrations."
          path="/account"
        />
        <div className="flex items-center gap-3 text-white/50">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <span className="text-sm">Checking your session…</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
