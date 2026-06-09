import api from '../api/axiosConfig'

// ── Units / Learning ─────────────────────────────────────────────────────────
export const unitService = {
  getAll: (params) => api.get('/api/units', { params }),
  getById: (id) => api.get(`/api/units/${id}`),
  markWatched: (id, progress) => api.post(`/api/units/${id}/watch`, { progress }),
  getLevels: () => api.get('/api/levels'),
}

// ── Vocabulary ───────────────────────────────────────────────────────────────
export const vocabularyService = {
  getSaved: (params) => api.get('/api/vocabulary', { params }),
  saveWord: (data) => api.post('/api/vocabulary', data),
  deleteWord: (id) => api.delete(`/api/vocabulary/${id}`),
  search: (q) => api.get('/api/vocabulary/search', { params: { q } }),
}

// ── Quiz ─────────────────────────────────────────────────────────────────────
export const quizService = {
  getByUnit: (unitId) => api.get(`/api/quiz/unit/${unitId}`),
  submit: (quizId, answers) => api.post(`/api/quiz/${quizId}/submit`, { answers }),
  getHistory: () => api.get('/api/quiz/history'),
  getHistoryDetail: (quizId) => api.get(`/api/quiz/history/${quizId}`),
}

// ── Flashcards ───────────────────────────────────────────────────────────────
export const flashcardService = {
  getDeck: (params) => api.get('/api/flashcards', { params }),
  markResult: (cardId, result) => api.post(`/api/flashcards/${cardId}/result`, { result }),
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
export const leaderboardService = {
  getGlobal: (params) => api.get('/api/leaderboard', { params }),
  getFriends: () => api.get('/api/leaderboard/friends'),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationService = {
  getAll: () => api.get('/api/notifications'),
  markRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllRead: () => api.put('/api/notifications/read-all'),
}

// ── Follow System ─────────────────────────────────────────────────────────────
export const followService = {
  getFollowers: () => api.get('/api/follow/followers'),
  getFollowing: () => api.get('/api/follow/following'),
  follow: (userId) => api.post(`/api/follow/${userId}`),
  unfollow: (userId) => api.delete(`/api/follow/${userId}`),
}

// ── Payment / Subscription ───────────────────────────────────────────────────
export const paymentService = {
  getPlans: () => api.get('/api/payment/plans'),
  subscribe: (planId, paymentData) => api.post('/api/payment/subscribe', { planId, ...paymentData }),
  getStatus: () => api.get('/api/payment/status'),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminService = {
  // Dashboard stats
  getStats: () => api.get('/api/admin/stats'),

  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),

  // Units
  getUnits: (params) => api.get('/api/admin/units', { params }),
  createUnit: (data) => api.post('/api/admin/units', data),
  updateUnit: (id, data) => api.put(`/api/admin/units/${id}`, data),
  deleteUnit: (id) => api.delete(`/api/admin/units/${id}`),

  // Levels
  getLevels: () => api.get('/api/admin/levels'),
  createLevel: (data) => api.post('/api/admin/levels', data),
  updateLevel: (id, data) => api.put(`/api/admin/levels/${id}`, data),
  deleteLevel: (id) => api.delete(`/api/admin/levels/${id}`),

  // Quiz
  getQuizzes: (params) => api.get('/api/admin/quizzes', { params }),
  createQuiz: (data) => api.post('/api/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/api/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/api/admin/quizzes/${id}`),
}
