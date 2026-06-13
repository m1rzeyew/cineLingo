import { Navigate, Route, Routes } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'

import GuestLayout from './layouts/GuestLayout'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'

import LandingPage from './pages/guest/LandingPage'
import LoginPage from './pages/guest/LoginPage'
import RegisterPage from './pages/guest/RegisterPage'
import LevelSelectionPage from './pages/guest/LevelSelectionPage'

import DashboardPage from './pages/client/DashboardPage'
import UnitsPage from './pages/client/UnitsPage'
import UnitDetailPage from './pages/client/UnitDetailPage'
import QuizPage from './pages/client/QuizPage'
import QuizHistoryPage from './pages/client/QuizHistoryPage'
import VocabularyPage from './pages/client/VocabularyPage'
import FlashcardsPage from './pages/client/FlashcardsPage'
import ProfilePage from './pages/client/ProfilePage'
import LeaderboardPage from './pages/client/LeaderboardPage'
import StatsPage from './pages/client/StatsPage'
import FriendsPage from './pages/client/FriendsPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage'
import AdminUnitsPage from './pages/admin/AdminUnitsPage'
import AdminUnitDetailPage from './pages/admin/AdminUnitDetailPage'
import AdminVideosPage from './pages/admin/AdminVideosPage'
import AdminVideoDetailPage from './pages/admin/AdminVideoDetailPage'
import AdminWordsPage from './pages/admin/AdminWordsPage'
import AdminQuizzesPage from './pages/admin/AdminQuizzesPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
      <Clapperboard size={30} />
    </div>
    <h1 className="mb-2 text-3xl font-black tracking-normal text-slate-950 dark:text-white">Scene Not Found</h1>
    <p className="mb-6 text-slate-500 dark:text-slate-400">This page does not exist in our screenplay.</p>
    <a href="/" className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-amber transition-colors hover:bg-brand-600">
      Go Home
    </a>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<GuestLayout />}>
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/placement" element={<ProtectedRoute><LevelSelectionPage /></ProtectedRoute>} />
      <Route path="/select-level" element={<Navigate to="/placement" replace />} />

      <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<ProtectedRoute redirectAdmin><DashboardPage /></ProtectedRoute>} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/units/:id" element={<UnitDetailPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/quizzes" element={<QuizHistoryPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserDetailPage />} />
        <Route path="units" element={<AdminUnitsPage />} />
        <Route path="units/:id" element={<AdminUnitDetailPage />} />
        <Route path="videos" element={<AdminVideosPage />} />
        <Route path="videos/:id" element={<AdminVideoDetailPage />} />
        <Route path="words" element={<AdminWordsPage />} />
        <Route path="quizzes" element={<AdminQuizzesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
