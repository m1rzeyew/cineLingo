import { Routes, Route, Navigate } from 'react-router-dom'

// ── Layouts ──────────────────────────────────────────────────────────
import GuestLayout  from './layouts/GuestLayout'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout  from './layouts/AdminLayout'

// ── Guest pages ──────────────────────────────────────────────────────
import LandingPage        from './pages/guest/LandingPage'
import LoginPage          from './pages/guest/LoginPage'
import RegisterPage       from './pages/guest/RegisterPage'
import LevelSelectionPage from './pages/guest/LevelSelectionPage'

// ── Client pages ─────────────────────────────────────────────────────
import DashboardPage   from './pages/client/DashboardPage'
import UnitsPage       from './pages/client/UnitsPage'
import UnitDetailPage  from './pages/client/UnitDetailPage'
import QuizPage        from './pages/client/QuizPage'
import QuizHistoryPage from './pages/client/QuizHistoryPage'
import VocabularyPage  from './pages/client/VocabularyPage'
import FlashcardsPage  from './pages/client/FlashcardsPage'
import ProfilePage     from './pages/client/ProfilePage'
import LeaderboardPage from './pages/client/LeaderboardPage'
import StatsPage   from './pages/client/StatsPage'
import FriendsPage from './pages/client/FriendsPage'

// ── Admin pages ──────────────────────────────────────────────────────
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage     from './pages/admin/AdminUsersPage'
import AdminLevelsPage    from './pages/admin/AdminLevelsPage'
import AdminUnitsPage     from './pages/admin/AdminUnitsPage'
import AdminQuizzesPage   from './pages/admin/AdminQuizzesPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'

const NotFound = () => (
  <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-center px-6">
    <p className="text-7xl mb-4">🎬</p>
    <h1 className="text-3xl font-bold font-display text-white mb-2">Scene Not Found</h1>
    <p className="text-white/40 mb-6">This page doesn't exist in our screenplay.</p>
    <a href="/" className="bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors shadow-amber">
      Go Home
    </a>
  </div>
)

export default function App() {
  return (
    <Routes>
      {/* ── Root → Landing ─────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ══════════════════════════════════════════════════════════
          GUEST LAYOUT — dark bg, transparent navbar
          ═════════════════════════════════════════════════════════ */}
      <Route element={<GuestLayout />}>
        <Route path="/home"     element={<LandingPage        />} />
        <Route path="/login"    element={<LoginPage          />} />
        <Route path="/register" element={<RegisterPage       />} />
        <Route path="/select-level" element={<LevelSelectionPage />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════
          CLIENT LAYOUT — sticky dark navbar + chat sidebar
          ═════════════════════════════════════════════════════════ */}
      <Route element={<ClientLayout />}>
        <Route path="/dashboard"    element={<DashboardPage   />} />
        <Route path="/units"        element={<UnitsPage       />} />
        <Route path="/units/:id"    element={<UnitDetailPage  />} />
        <Route path="/quiz/:quizId" element={<QuizPage        />} />
        <Route path="/quizzes"      element={<QuizHistoryPage />} />
        <Route path="/vocabulary"   element={<VocabularyPage  />} />
        <Route path="/flashcards"   element={<FlashcardsPage  />} />
        <Route path="/profile"  element={<ProfilePage  />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/stats"    element={<StatsPage    />} />
        <Route path="/friends"  element={<FriendsPage  />} />
      </Route>

      {/* ══════════════════════════════════════════════════════════
          ADMIN LAYOUT — fixed left sidebar
          ═════════════════════════════════════════════════════════ */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index               element={<AdminDashboardPage />} />
        <Route path="users"        element={<AdminUsersPage     />} />
        <Route path="levels"       element={<AdminLevelsPage    />} />
        <Route path="units"        element={<AdminUnitsPage     />} />
        <Route path="quizzes"      element={<AdminQuizzesPage   />} />
        <Route path="analytics"    element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* ── 404 ────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
