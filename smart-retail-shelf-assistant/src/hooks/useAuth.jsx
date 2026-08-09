import { createContext, useContext, useState, useCallback } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const u = await authService.login({ email, password })
      setUser(u)
      return u
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [])

  const signUp = useCallback(async (name, email, password) => {
    setError(null)
    try {
      const u = await authService.signUp({ name, email, password })
      setUser(u)
      return u
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, error, setError, login, signUp, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
