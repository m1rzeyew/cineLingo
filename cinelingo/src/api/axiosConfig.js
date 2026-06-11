import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5267').replace(/\/+$/, '')
const TOKEN_KEY = 'cinelingo_token'
const REFRESH_KEY = 'cinelingo_refresh_token'
const USER_KEY = 'cinelingo_user'

let refreshPromise = null

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) throw new Error('Missing refresh token')

  const res = await axios.post(`${BASE_URL}/api/Auth/refresh-token`, { RefreshToken: refreshToken }, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  })

  const nextAccessToken = res.data?.accessToken || res.data?.AccessToken || res.data?.token
  const nextRefreshToken = res.data?.refreshToken || res.data?.RefreshToken

  if (!nextAccessToken) throw new Error('Missing access token')

  localStorage.setItem(TOKEN_KEY, nextAccessToken)
  if (nextRefreshToken) localStorage.setItem(REFRESH_KEY, nextRefreshToken)

  return nextAccessToken
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/api/Auth/refresh-token')) {
      originalRequest._retry = true

      try {
        refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null })
        const token = await refreshPromise
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        clearAuth()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshError)
      }
    }

    if (status === 401) {
      clearAuth()
      window.dispatchEvent(new Event('auth:logout'))
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'))
    }

    return Promise.reject(error)
  }
)

export default api
