import api from '../api/axiosConfig'

const list = (value) => Array.isArray(value) ? value : []
const toId = (value) => {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10)
  return Number.isFinite(parsed) ? parsed : null
}
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
const toUserId = (value) => {
  const parsed = String(value ?? '').trim()
  return parsed.length ? parsed : null
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
  getById: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.get(`/api/Unit/${unitId}`)
  },
  start: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.post(`/api/Unit/${unitId}/start`)
  },
  complete: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.post(`/api/Unit/${unitId}/complete`)
  },
  review: (id, data) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.post(`/api/Unit/${unitId}/review`, data)
  },
  create: (data) => api.post('/api/Unit', toFormData({
    Title: data.title ?? data.Title,
    Description: data.description ?? data.Description,
    EnglishLevel: data.englishLevel ?? data.EnglishLevel,
    ImageFile: data.imageFile ?? data.ImageFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.patch(`/api/Unit/${unitId}`, toFormData({
      Title: data.title ?? data.Title,
      Description: data.description ?? data.Description,
      EnglishLevel: data.englishLevel ?? data.EnglishLevel,
      ImageFile: data.imageFile ?? data.ImageFile,
    }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.delete(`/api/Unit/${unitId}`)
  },
  publish: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.patch(`/api/Unit/${unitId}/publish`)
  },
  unpublish: (id) => {
    const unitId = toId(id)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.patch(`/api/Unit/${unitId}/unpublish`)
  },
}

export const videoService = {
  getAll: (params) => api.get('/api/Video', { params }),
  getById: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.get(`/api/Video/${videoId}`)
  },
  getByUnit: (unitId) => {
    const nextUnitId = toId(unitId)
    if (nextUnitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.get(`/api/Video/unit/${nextUnitId}`)
  },
  getPopular: (take = 10) => api.get('/api/Video/popular', { params: { take } }),
  getRecent: (take = 10) => api.get('/api/Video/recent', { params: { take } }),
  search: (q) => api.get('/api/Video/search', { params: { q } }),
  getWatchProgress: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.get(`/api/Video/${videoId}/watch-progress`)
  },
  markWatched: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.post(`/api/Video/${videoId}/watch`)
  },
  updateWatchProgress: (id, watched) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.post(`/api/Video/${videoId}/watch-progress`, { Watched: watched })
  },
  create: (data) => api.post('/api/Video', toFormData({
    UnitId: data.unitId ?? data.UnitId,
    Title: data.title ?? data.Title,
    VideoFile: data.videoFile ?? data.VideoFile,
    SubtitleFile: data.subtitleFile ?? data.SubtitleFile,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.patch(`/api/Video/${videoId}`, toFormData({
      Title: data.title ?? data.Title,
      VideoFile: data.videoFile ?? data.VideoFile,
      SubtitleFile: data.subtitleFile ?? data.SubtitleFile,
    }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.delete(`/api/Video/${videoId}`)
  },
  publish: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.patch(`/api/Video/${videoId}/publish`)
  },
  unpublish: (id) => {
    const videoId = toId(id)
    if (videoId == null) return Promise.reject(new Error('Missing video id'))
    return api.patch(`/api/Video/${videoId}/unpublish`)
  },
}

export const wordService = {
  getAll: (params) => api.get('/api/Word', { params }),
  getById: (wordId, params) => {
    const nextWordId = toId(wordId)
    const nextUnitId = toId(params?.unitId ?? params?.UnitId)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    if (nextUnitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.get(`/api/Word/${nextWordId}`, { params: { unitId: nextUnitId } })
  },
  getByUnit: (unitId) => {
    const nextUnitId = toId(unitId)
    if (nextUnitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.get(`/api/Word/unit/${nextUnitId}`)
  },
  save: (wordId) => {
    const nextWordId = toId(wordId)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    return api.post(`/api/Word/${nextWordId}/save`)
  },
  unsave: (wordId) => {
    const nextWordId = toId(wordId)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    return api.delete(`/api/Word/${nextWordId}/save`)
  },
  markKnown: (id) => {
    const nextWordId = toId(id)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    return api.post(`/api/Word/${nextWordId}/known`)
  },
  unmarkKnown: (id) => {
    const nextWordId = toId(id)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    return api.delete(`/api/Word/${nextWordId}/known`)
  },
  report: (id, data) => {
    const nextWordId = toId(id)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    return api.post(`/api/Word/${nextWordId}/report`, data)
  },
  getDaily: () => api.get('/api/Word/daily'),
  getReports: () => api.get('/api/Word/reports'),
  approveReport: (id) => api.patch(`/api/Word/reports/${id}/approve`),
  create: (data) => {
    const unitId = toId(data.unitId ?? data.UnitId)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.post('/api/Word', {
      Term: data.term ?? data.Term,
      Definition: data.definition ?? data.Definition,
      ExampleSentence: data.exampleSentence ?? data.ExampleSentence,
      Pronunciation: data.pronunciation ?? data.Pronunciation,
    }, { params: { unitId } })
  },
  update: (wordId, data) => {
    const nextWordId = toId(wordId)
    const unitId = toId(data.unitId ?? data.UnitId)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.patch(`/api/Word/${nextWordId}`, {
      Term: data.term ?? data.Term,
      Definition: data.definition ?? data.Definition,
      ExampleSentence: data.exampleSentence ?? data.ExampleSentence,
      Pronunciation: data.pronunciation ?? data.Pronunciation,
    }, { params: { unitId } })
  },
  delete: (wordId, unitId) => {
    const nextWordId = toId(wordId)
    const nextUnitId = toId(unitId)
    if (nextWordId == null) return Promise.reject(new Error('Missing word id'))
    if (nextUnitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.delete(`/api/Word/${nextWordId}`, { params: { unitId: nextUnitId } })
  },
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
  getById: (id) => {
    const quizId = toId(id)
    if (quizId == null) return Promise.reject(new Error('Missing quiz id'))
    return api.get(`/api/Quiz/${quizId}`)
  },
  getByUnit: (unitId) => {
    const nextUnitId = toId(unitId)
    if (nextUnitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.get(`/api/Quiz/unit/${nextUnitId}`)
  },
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
  create: (data) => {
    const unitId = toId(data.unitId ?? data.UnitId)
    if (unitId == null) return Promise.reject(new Error('Missing unit id'))
    return api.post('/api/Quiz', {
      UnitId: unitId,
      Title: data.title ?? data.Title,
      PassingScore: Number(data.passingScore ?? data.PassingScore ?? 70),
      Questions: list(data.questions ?? data.Questions).map(question => ({
        QuestionText: question.questionText ?? question.QuestionText,
        OptionA: question.optionA ?? question.OptionA,
        OptionB: question.optionB ?? question.OptionB,
        OptionC: question.optionC ?? question.OptionC,
        OptionD: question.optionD ?? question.OptionD,
        CorrectOption: question.correctOption ?? question.CorrectOption,
      })),
    })
  },
  update: (id, data) => {
    const quizId = toId(id)
    if (quizId == null) return Promise.reject(new Error('Missing quiz id'))
    return api.patch(`/api/Quiz/${quizId}`, {
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
    })
  },
  delete: (id) => {
    const quizId = toId(id)
    if (quizId == null) return Promise.reject(new Error('Missing quiz id'))
    return api.delete(`/api/Quiz/${quizId}`)
  },
  generate: (unitId) => {
    const nextUnitId = toId(unitId)
    if (nextUnitId == null) return Promise.reject(new Error('Missing unitId'))
    return api.post(`/api/Quiz/generate/${nextUnitId}`)
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
  getUserById: (id) => {
    const userId = toUserId(id)
    if (!userId) return Promise.reject(new Error('Missing user id'))
    return api.get(`/api/Admin/users/${encodeURIComponent(userId)}`)
  },
  deleteUser: (id) => {
    const userId = toUserId(id)
    if (!userId) return Promise.reject(new Error('Missing user id'))
    return api.delete(`/api/Admin/users/${encodeURIComponent(userId)}`)
  },
  updateUserRole: (id, role) => {
    const userId = toUserId(id)
    if (!userId) return Promise.reject(new Error('Missing user id'))
    return api.patch(`/api/Admin/users/${encodeURIComponent(userId)}/role`, { Role: role })
  },
  banUser: (id, data) => {
    const userId = toUserId(id)
    if (!userId) return Promise.reject(new Error('Missing user id'))
    return api.put(`/api/Admin/users/${encodeURIComponent(userId)}/ban`, { Reason: data?.reason ?? data?.Reason })
  },
  unbanUser: (id) => {
    const userId = toUserId(id)
    if (!userId) return Promise.reject(new Error('Missing user id'))
    return api.put(`/api/Admin/users/${encodeURIComponent(userId)}/unban`)
  },
}

export const healthService = {
  get: () => api.get('/api/Health'),
}
