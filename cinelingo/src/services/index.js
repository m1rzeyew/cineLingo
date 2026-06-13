import api from '../api/axiosConfig'

const list = (value) => Array.isArray(value) ? value : []
const getStoredUserId = () => {
  try {
    const raw = localStorage.getItem('cinelingo_user')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    return parsed?.id || parsed?.Id || ''
  } catch {
    return ''
  }
}

const toFormData = (data = {}) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value)
  })

  return formData
}

export const unitService = {
  getAll: (params) => api.get('/api/Unit', { params }),
  getById: (id) => api.get(`/api/Unit/${id}`),
  start: (id) => api.post(`/api/Unit/${id}/start`),
  complete: (id) => api.post(`/api/Unit/${id}/complete`),
  review: (id, data) => api.post(`/api/Unit/${id}/review`, data),
  create: (data) => api.post('/api/Unit', toFormData({
    Title: data.title ?? data.Title,
    Description: data.description ?? data.Description,
    EnglishLevel: data.englishLevel ?? data.EnglishLevel,
    ImageFile: data.imageFile ?? data.ImageFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.patch(`/api/Unit/${id}`, toFormData({
    Title: data.title ?? data.Title,
    Description: data.description ?? data.Description,
    EnglishLevel: data.englishLevel ?? data.EnglishLevel,
    ImageFile: data.imageFile ?? data.ImageFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/api/Unit/${id}`),
  publish: (id) => api.patch(`/api/Unit/${id}/publish`),
  unpublish: (id) => api.patch(`/api/Unit/${id}/unpublish`),
}

export const videoService = {
  getAll: (params) => api.get('/api/Video', { params }),
  getById: (id) => api.get(`/api/Video/${id}`),
  getByUnit: (unitId) => api.get(`/api/Video/unit/${unitId}`),
  getPopular: (take = 10) => api.get('/api/Video/popular', { params: { take } }),
  getRecent: (take = 10) => api.get('/api/Video/recent', { params: { take } }),
  search: (q) => api.get('/api/Video/search', { params: { q } }),
  getWatchProgress: (id) => api.get(`/api/Video/${id}/watch-progress`),
  markWatched: (id) => api.post(`/api/Video/${id}/watch`),
  updateWatchProgress: (id, watched) => api.post(`/api/Video/${id}/watch-progress`, { Watched: watched }),
  create: (data) => api.post('/api/Video', toFormData({
    UnitId: data.unitId ?? data.UnitId,
    Title: data.title ?? data.Title,
    VideoFile: data.videoFile ?? data.VideoFile,
    SubtitleFile: data.subtitleFile ?? data.SubtitleFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.patch(`/api/Video/${id}`, toFormData({
    Title: data.title ?? data.Title,
    VideoFile: data.videoFile ?? data.VideoFile,
    SubtitleFile: data.subtitleFile ?? data.SubtitleFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/api/Video/${id}`),
  publish: (id) => api.patch(`/api/Video/${id}/publish`),
  unpublish: (id) => api.patch(`/api/Video/${id}/unpublish`),
}

export const wordService = {
  getAll: (params) => api.get('/api/Word', { params }),
  getById: (wordId, params) => api.get(`/api/Word/${wordId}`, { params }),
  getByUnit: (unitId) => api.get(`/api/Word/unit/${unitId}`),
  save: (wordId) => api.post(`/api/Word/${wordId}/save`),
  unsave: (wordId) => api.delete(`/api/Word/${wordId}/save`),
  markKnown: (id) => api.post(`/api/Word/${id}/known`),
  unmarkKnown: (id) => api.delete(`/api/Word/${id}/known`),
  report: (id, data) => api.post(`/api/Word/${id}/report`, data),
  getDaily: () => api.get('/api/Word/daily'),
  getReports: () => api.get('/api/Word/reports'),
  approveReport: (id) => api.patch(`/api/Word/reports/${id}/approve`),
  create: (data) => api.post('/api/Word', {
    Term: data.term ?? data.Term,
    Definition: data.definition ?? data.Definition,
    ExampleSentence: data.exampleSentence ?? data.ExampleSentence,
    Pronunciation: data.pronunciation ?? data.Pronunciation,
  }, { params: { id: data.unitId ?? data.UnitId } }),
  update: (wordId, data) => api.patch(`/api/Word/${wordId}`, {
    Term: data.term ?? data.Term,
    Definition: data.definition ?? data.Definition,
    ExampleSentence: data.exampleSentence ?? data.ExampleSentence,
    Pronunciation: data.pronunciation ?? data.Pronunciation,
  }, { params: { unitId: data.unitId ?? data.UnitId } }),
  delete: (wordId, unitId) => api.delete(`/api/Word/${wordId}`, { params: { unitId } }),
}

export const vocabularyService = {
  getSaved: () => api.get('/api/Vocabulary/me'),
  getStats: () => api.get('/api/Vocabulary/me/stats'),
  getRecent: (take = 10) => api.get('/api/Vocabulary/me/recent', { params: { take } }),
  getKnown: () => api.get('/api/Vocabulary/me/known'),
  search: (q) => api.get('/api/Vocabulary/me/search', { params: { q } }),
  exportCsv: () => api.get('/api/Vocabulary/me/export', { responseType: 'blob' }),
  clear: () => api.post('/api/Vocabulary/me/clear'),
  deleteWord: (wordId) => api.delete(`/api/Vocabulary/${wordId}`),
  saveWord: (wordId) => wordService.save(wordId),
}

export const quizService = {
  getAll: (params) => api.get('/api/Quiz', { params }),
  getById: (id) => api.get(`/api/Quiz/${id}`),
  getByUnit: (unitId) => api.get(`/api/Quiz/unit/${unitId}`),
  submit: ({ quizId, answers, timeTakenSeconds = 0 }) =>
    api.post('/api/Quiz/submit', {
      QuizId: quizId,
      TimeTakenSeconds: timeTakenSeconds,
      Answers: list(answers).map(answer => ({
        QuestionId: answer.questionId ?? answer.QuestionId,
        SelectedOption: answer.selectedOption ?? answer.SelectedOption,
      })),
    }),
  getResult: (attemptId) => api.get(`/api/Quiz/result/${attemptId}`),
  getHistory: (quizId) => api.get(`/api/Quiz/history/${quizId}`),
  getMyAttempts: () => api.get('/api/Quiz/my-attempts'),
  getAttemptDetail: (attemptId) => api.get(`/api/Quiz/my-attempts/${attemptId}`),
  create: (data) => api.post('/api/Quiz', {
    UnitId: data.unitId ?? data.UnitId,
    Title: data.title ?? data.Title,
    PassingScore: Number(data.passingScore ?? data.PassingScore ?? 70),
    Questions: list(data.questions ?? data.Questions).map(question => ({
      Id: question.id ?? question.Id ?? 0,
      QuestionText: question.questionText ?? question.QuestionText,
      OptionA: question.optionA ?? question.OptionA,
      OptionB: question.optionB ?? question.OptionB,
      OptionC: question.optionC ?? question.OptionC,
      OptionD: question.optionD ?? question.OptionD,
      CorrectOption: question.correctOption ?? question.CorrectOption,
    })),
  }),
  update: (id, data) => api.patch(`/api/Quiz/${id}`, {
    Title: data.title ?? data.Title,
    PassingScore: data.passingScore ?? data.PassingScore,
    Questions: data.questions || data.Questions ? list(data.questions ?? data.Questions).map(question => ({
      QuestionText: question.questionText ?? question.QuestionText,
      OptionA: question.optionA ?? question.OptionA,
      OptionB: question.optionB ?? question.OptionB,
      OptionC: question.optionC ?? question.OptionC,
      OptionD: question.optionD ?? question.OptionD,
      CorrectOption: question.correctOption ?? question.CorrectOption,
    })) : undefined,
  }),
  delete: (id) => api.delete(`/api/Quiz/${id}`),
  generate: (unitId) => {
    const nextUnitId = unitId == null ? '' : String(unitId).trim()
    if (!nextUnitId) return Promise.reject(new Error('Missing unitId'))
    return api.post('/api/Quiz/generate', null, { params: { unitId: nextUnitId } })
  },
}

export const flashcardService = {
  getDeck: (unitId) => unitId ? api.get(`/api/Flashcards/unit/${unitId}`) : api.get('/api/Flashcards/me'),
  getStats: (unitId) => unitId ? api.get(`/api/Flashcards/unit/${unitId}/stats`) : api.get('/api/Flashcards/me/stats'),
  getHistory: () => api.get('/api/Flashcards/me/history'),
  complete: (unitId) => api.post(`/api/Flashcards/unit/${unitId}/complete`),
  flip: (cardId) => api.post(`/api/Flashcards/${cardId}/flip`),
  getLeaderboard: (unitId) => api.get(`/api/Flashcards/unit/${unitId}/leaderboard`),
}

export const leaderboardService = {
  getGlobal: (params) => api.get('/api/Leaderboard/global', { params }),
  getWeekly: (take = 50) => api.get('/api/Leaderboard/weekly', { params: { take } }),
  getByLevel: (level, params) => api.get(`/api/Leaderboard/level/${level}`, { params }),
}

export const notificationService = {
  getAll: () => api.get('/api/Notifications/me'),
  markRead: (id) => api.post(`/api/Notifications/${id}/read`),
  markAllRead: () => api.post('/api/Notifications/read-all'),
  delete: (id) => api.delete(`/api/Notifications/${id}`),
}

export const followService = {
  getFollowers: () => api.get('/api/Follow/followers'),
  getFollowing: () => api.get('/api/Follow/following'),
  getUserFollowing: (userId) => api.get(`/api/Follow/${userId}/following`),
  getStatus: (userId) => api.get(`/api/Follow/status/${userId}`),
  follow: (userId) => api.post(`/api/Follow/${userId}`),
  unfollow: (userId) => api.delete(`/api/Follow/${userId}`),
}

export const paymentService = {
  createCheckout: () => api.post('/api/Payment/create-checkout'),
  confirm: (sessionId) => api.post('/api/Payment/confirm', { SessionId: sessionId }),
  getStatus: () => api.get('/api/Payment/status'),
}

export const profileService = {
  getMe: () => api.get('/api/Profile/me'),
  updateMe: (data) => api.put('/api/Profile/me', {
    FullName: data.fullName ?? data.FullName,
    PhoneNumber: data.phoneNumber ?? data.PhoneNumber,
    UserName: data.userName ?? data.UserName,
  }),
  updateAvatar: (file) => api.put('/api/Profile/avatar', toFormData({ File: file }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAvatar: () => api.delete('/api/Profile/avatar'),
  getStats: () => api.get('/api/Profile/stats'),
  getActivity: () => api.get('/api/Profile/activity'),
  getBadges: () => api.get('/api/Profile/badges'),
  getCertificates: () => api.get('/api/Profile/certificates'),
  getXp: () => api.get('/api/Profile/xp'),
}

export const streakService = {
  checkIn: () => api.post('/api/Streak/check-in'),
  getMe: () => api.get('/api/Streak/me'),
}

export const levelQuizService = {
  getQuestions: () => api.get('/api/LevelQuiz/questions', { headers: { 'X-User-Id': getStoredUserId() } }),
  submit: (answers) => api.post('/api/LevelQuiz/submit', {
    Answers: list(answers).map(answer => ({
      QuestionId: answer.questionId ?? answer.QuestionId,
      SelectedOption: answer.selectedOption ?? answer.SelectedOption,
    })),
  }, { headers: { 'X-User-Id': getStoredUserId() } }),
  generate: () => api.post('/api/LevelQuiz/generate'),
}

export const chatService = {
  getConversations: () => api.get('/api/Chat/conversations'),
  getConversationWithUser: (userId) => api.get(`/api/Chat/conversations/${userId}`),
  startConversation: (userId) => api.post(`/api/Chat/conversations/${userId}`),
  getMessages: (conversationId) => api.get(`/api/Chat/messages/${conversationId}`),
  deleteMessage: (messageId) => api.delete(`/api/Chat/messages/${messageId}`),
  markMessageRead: (messageId) => api.put(`/api/Chat/messages/${messageId}/read`),
}

export const adminService = {
  getUserStats: () => api.get('/api/Admin/stats/users'),
  getContentStats: () => api.get('/api/Admin/stats/content'),
  getQuizStats: () => api.get('/api/Admin/stats/quiz'),
  getRetentionStats: () => api.get('/api/Admin/stats/retention'),
  getRevenueStats: () => api.get('/api/Admin/stats/revenue'),
  sendNotification: (data) => api.post('/api/Admin/notifications/send', {
    UserId: data.userId ?? data.UserId,
    Title: data.title ?? data.Title,
    Message: data.message ?? data.Message,
    ActionUrl: data.actionUrl ?? data.ActionUrl,
  }),

  getUsers: () => api.get('/api/Admin/users'),
  getUserById: (id) => api.get(`/api/Admin/users/${id}`),
  deleteUser: (id) => api.delete(`/api/Admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/api/Admin/users/${id}/role`, { Role: role }),
  banUser: (id, data) => api.put(`/api/Admin/users/${id}/ban`, { Reason: data?.reason ?? data?.Reason }),
  unbanUser: (id) => api.put(`/api/Admin/users/${id}/unban`),
}

export const healthService = {
  get: () => api.get('/api/Health'),
}
