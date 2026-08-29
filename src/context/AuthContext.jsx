import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest } from '../api/authApi'

const AuthContext = createContext(null)

const STORAGE_KEY = 'carpartmarket_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { userid, email, role, ...roleFields }
  const [loading, setLoading] = useState(true)

  // Restore session on load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const loggedInUser = await loginRequest(email, password)
    setUser(loggedInUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    return loggedInUser
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    role: user?.role ?? null, // 'buyer' | 'seller' | 'admin'
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    setUser, // used right after registration to log a user straight in
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
