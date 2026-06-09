import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinelingo_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 / 403 globally ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem('cinelingo_token')
      localStorage.removeItem('cinelingo_user')
      window.dispatchEvent(new Event('auth:logout'))
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'))
    }

    return Promise.reject(error)
  }
)

export default api
