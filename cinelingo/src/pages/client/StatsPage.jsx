import { useEffect, useState } from 'react'
import { Activity, BarChart3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { profileService, streakService, vocabularyService } from '../../services'

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(null)
  const [xp, setXp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [profileRes, vocabRes, streakRes, xpRes] = await Promise.allSettled([
        profileService.getStats(),
        vocabularyService.getStats(),
        streakService.getMe(),
        profileService.getXp(),
      ])

      if (!active) return
      setStats({ ...(profileRes.value?.data || {}), ...(vocabRes.value?.data || {}) })
      setStreak(streakRes.value?.data || null)
      setXp(xpRes.value?.data?.xp ?? xpRes.value?.data?.XP ?? null)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  const values = [
    ['Total Points', xp ?? user?.totalPoints ?? 0],
    ['Words Saved', stats?.totalSavedWords ?? stats?.savedWords ?? user?.wordsSaved ?? 0],
    ['Units Started', stats?.totalUnitsStarted ?? 0],
    ['Units Completed', stats?.totalUnitsCompleted ?? user?.unitsCompleted ?? 0],
    ['Quizzes Taken', stats?.totalQuizzesTaken ?? user?.quizzesTaken ?? 0],
    ['Quizzes Passed', stats?.totalQuizzesPassed ?? 0],
    ['Best Streak', streak?.bestStreak ?? user?.bestStreak ?? 0],
    ['Current Streak', streak?.currentStreak ?? streak?.streak ?? user?.streak ?? 0],
  ]

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        eyebrow="Progress"
        title="My stats"
        description="A compact summary of your learning activity, saved words, quiz performance, and streaks."
      />

      <Card>
        {loading ? (
          <p className="text-sm text-dark-500">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {values.map(([label, val], index) => (
              <div key={label} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                  {index % 2 === 0 ? <BarChart3 size={17} /> : <Activity size={17} />}
                </div>
                <p className="text-3xl font-black tracking-normal text-dark-900">{val ?? 0}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-normal text-dark-400">{label}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
