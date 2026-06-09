import api from '../api/axiosConfig'

export const authService = {
  login: (credentials) =>
    api.post('/api/auth/login', credentials),

  register: (data) =>
    api.post('/api/auth/register', data),

  selectLevel: (levelId) =>
    api.post('/api/auth/select-level', { levelId }),

  getProfile: () =>
    api.get('/api/auth/profile'),

  updateProfile: (data) =>
    api.put('/api/auth/profile', data),

  logout: () =>
    api.post('/api/auth/logout'),
}
