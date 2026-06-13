import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../utils/helpers'

const AuthContext = createContext(null)

const TOKEN_KEY = 'cinelingo_token'
const REFRESH_KEY = 'cinelingo_refresh_token'
const USER_KEY = 'cinelingo_user'
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

const decodeJwt = (token) => {
  try {
    const payload = token?.split('.')?.[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map(char => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

const getTokenClaims = () => decodeJwt(localStorage.getItem(TOKEN_KEY)) || {}

const getClaimRoles = (claims = {}) => {
  const value = claims.role ?? claims.roles ?? claims[ROLE_CLAIM]
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

const splitName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

const normalizeUser = (raw = {}) => {
  const claims = getTokenClaims()
  const fullName = raw.fullName || raw.FullName || `${raw.firstName || raw.FirstName || ''} ${raw.lastName || raw.LastName || ''}`.trim()
  const names = splitName(fullName)
  const roles = raw.roles || raw.Roles || (raw.role || raw.Role ? [raw.role || raw.Role] : getClaimRoles(claims))
  const level = raw.levelName ?? raw.LevelName ?? raw.level ?? raw.Level ?? claims.EnglishLevel ?? null

  return {
    ...raw,
    id: raw.id || raw.Id || claims.sub || claims.nameid || claims[NAME_ID_CLAIM],
    fullName,
    firstName: raw.firstName || raw.FirstName || names.firstName,
    lastName: raw.lastName || raw.LastName || names.lastName,
    levelName: level,
    englishLevel: raw.englishLevel ?? raw.EnglishLevel ?? raw.levelId ?? raw.LevelId ?? level,
    email: raw.email || raw.Email,
    role: raw.role || raw.Role || roles[0] || 'User',
    roles,
    isPremium: raw.isPremium ?? raw.IsPremium ?? raw.isSubscribed ?? raw.IsSubscribed ?? false,
    wordsSaved: raw.wordsSaved ?? raw.WordsSaved ?? raw.totalSavedWords ?? raw.TotalSavedWords ?? 0,
    unitsCompleted: raw.unitsCompleted ?? raw.UnitsCompleted ?? raw.totalUnitsCompleted ?? raw.TotalUnitsCompleted ?? 0,
    quizzesTaken: raw.quizzesTaken ?? raw.QuizzesTaken ?? raw.totalQuizzesTaken ?? raw.TotalQuizzesTaken ?? 0,
  }
}

const getStoredUser = () => {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? normalizeUser(JSON.parse(value)) : null
  } catch {
    return null
  }
}

const persistAuth = (auth, fallbackUser = {}) => {
  const accessToken = auth?.accessToken || auth?.AccessToken
  const refreshToken = auth?.refreshToken || auth?.RefreshToken

  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)

  const user = normalizeUser({
    ...fallbackUser,
    fullName: auth?.fullName || auth?.FullName || fallbackUser.fullName,
    email: auth?.email || auth?.Email || fallbackUser.email,
    level: auth?.level ?? auth?.Level ?? fallbackUser.level,
  })

  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(false)

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return null

    try {
      const res = await authService.getProfile()
      const nextUser = normalizeUser({
        ...getStoredUser(),
        ...res.data,
      })
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  useEffect(() => {
    const onLogout = () => {
      clearAuth()
      setUser(null)
    }
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.login(credentials)
      const nextUser = persistAuth(res.data, { email: credentials.email })
      setUser(nextUser)
      await refreshUser()
      toast.success(`Welcome back, ${nextUser.firstName || 'friend'}!`)
      return { success: true, user: getStoredUser() || nextUser }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed.')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [refreshUser])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      const res = await authService.register(data)
      const nextUser = persistAuth(res.data, {
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
      })
      setUser(nextUser)
      await refreshUser()
      toast.success('Account created!')
      return { success: true, user: getStoredUser() || nextUser }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Registration failed.')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [refreshUser])

  const selectLevel = useCallback(async (englishLevel) => {
    setLoading(true)
    try {
      await authService.selectLevel(englishLevel)
      const nextUser = normalizeUser({ ...user, englishLevel, levelId: englishLevel })
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      await refreshUser()
      toast.success("Level selected. Let's start learning.")
      return { success: true }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not select level.')
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [refreshUser, user])

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(TOKEN_KEY)) await authService.logout()
    } catch {
    } finally {
      clearAuth()
      setUser(null)
      toast.success('Logged out.')
    }
  }, [])

  const value = useMemo(() => {
    const claims = getTokenClaims()
    const roles = user?.roles || (user?.role ? [user.role] : getClaimRoles(claims))
    const isAuthenticated = !!localStorage.getItem(TOKEN_KEY)

    return {
      user,
      loading,
      isAuthenticated,
      isAdmin: roles.some(role => String(role).toLowerCase() === 'admin') || String(user?.role).toLowerCase() === 'admin',
      hasLevel: !!user && (user.englishLevel != null || !!user.levelName || user.levelId != null),
      login,
      register,
      logout,
      selectLevel,
      refreshUser,
    }
  }, [loading, login, logout, refreshUser, register, selectLevel, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
