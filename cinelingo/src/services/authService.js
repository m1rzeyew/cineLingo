import api from '../api/axiosConfig'

export const authService = {
  login: ({ email, password }) =>
    api.post('/api/Auth/login', {
      EmailOrUsername: email,
      Password: password,
    }),

  register: ({ firstName, lastName, username, email, password }) => {
    const fullName = `${firstName} ${lastName}`.trim()

    return api.post('/api/Auth/register', {
      FullName: fullName,
      Username: username,
      Email: email,
      Password: password,
      ConfirmPassword: password,
    })
  },

  refreshToken: (refreshToken) =>
    api.post('/api/Auth/refresh-token', { RefreshToken: refreshToken }),

  selectLevel: (englishLevel) =>
    api.patch('/api/Auth/select-level', { EnglishLevel: Number(englishLevel) }),

  getProfile: () =>
    api.get('/api/Profile/me'),

  updateProfile: (data) =>
    api.put('/api/Profile/me', data),

  logout: () =>
    api.post('/api/Auth/logout'),

  deleteAccount: () =>
    api.delete('/api/Auth/delete-account'),

  forgotPassword: (email) =>
    api.post('/api/Auth/forgot-password', { Email: email }),

  verifyResetToken: ({ email, token }) =>
    api.post('/api/Auth/verify-reset-token', { Email: email, Token: token }),

  resetPassword: ({ email, token, newPassword }) =>
    api.post('/api/Auth/reset-password', { Email: email, Token: token, NewPassword: newPassword }),

  google: (idToken) =>
    api.post('/api/Auth/google', { IdToken: idToken }),
}
