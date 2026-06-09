import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const MOCK_USER = {
  id: '1', firstName: 'Alex', lastName: 'Johnson',
  email: 'alex@cinelingo.com', role: 'Admin', roles: ['Admin'],
  levelId: 2, levelName: 'Intermediate', englishLevel: 4,
  isPremium: false, streak: 7, bestStreak: 14, totalPoints: 1240,
  wordsSaved: 6, unitsCompleted: 1, quizzesTaken: 3,
  avatarUrl: null, createdAt: '2024-01-15T00:00:00Z',
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(MOCK_USER)
  const [loading, setLoading] = useState(false)

  const isAuthenticated = true
  const isAdmin         = true
  const hasLevel        = true

  const login = useCallback(async (credentials) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    toast.success(`Welcome back, ${MOCK_USER.firstName}! 👋`)
    return { success: true, user: MOCK_USER }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    const u = { ...MOCK_USER, firstName: data.firstName, lastName: data.lastName, email: data.email, levelId: null }
    setUser(u)
    toast.success('Account created! 🎉')
    return { success: true, user: u }
  }, [])

  const selectLevel = useCallback(async (levelId) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setUser(u => ({ ...u, levelId }))
    setLoading(false)
    toast.success("Level selected! Let's start learning 🎬")
    return { success: true }
  }, [])

const logout = useCallback(async () => {
    toast.success('Logged out.')
    window.location.href = '/home'
  }, [])

  const refreshUser = useCallback(async () => {}, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated, isAdmin, hasLevel,
      login, register, logout, selectLevel, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
