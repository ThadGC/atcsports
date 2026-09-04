import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { auth as authApi } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Restore the session from the httpOnly cookie on first paint.
  useEffect(() => {
    const ctrl = new AbortController()
    authApi
      .me(ctrl.signal)
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
    return () => ctrl.abort()
  }, [])

  const login = useCallback(async (payload) => {
    const d = await authApi.login(payload)
    setUser(d.user)
    return d.user
  }, [])

  const register = useCallback(async (payload) => {
    const d = await authApi.register(payload)
    setUser(d.user)
    return d.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout, setUser }),
    [user, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
