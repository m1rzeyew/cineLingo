import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Flame, Lock, Play, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PaywallModal from '../../components/common/PaywallModal'
import { EmptyState } from '../../components/ui/PageHeader'
import { cn, levelLabel } from '../../utils/helpers'
import { profileService, quizService, streakService, unitService, vocabularyService } from '../../services'

const list = (value) => Array.isArray(value) ? value : []

const normalizeUnit = (unit) => ({
  ...unit,
  levelName: unit.levelName || unit.level || levelLabel(unit.englishLevel),
  requiresPremium: unit.requiresPremium ?? Number(unit.englishLevel) > 0,
  isCompleted: unit.isCompleted || unit.status === 'Completed',
})

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [units, setUnits] = useState([])
  const [quizHistory, setQuizHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      const [unitsRes, attemptsRes, statsRes, streakRes, vocabStatsRes] = await Promise.allSettled([
        unitService.getAll(),
        quizService.getMyAttempts(),
        profileService.getStats(),
        streakService.getMe(),
        vocabularyService.getStats(),
      ])

      if (!active) return

      setUnits(list(unitsRes.value?.data).map(normalizeUnit).slice(0, 4))
      setQuizHistory(list(attemptsRes.value?.data).slice(0, 3))
      setStats({ ...(statsRes.value?.data || {}), ...(vocabStatsRes.value?.data || {}) })
      setStreak(streakRes.value?.data || null)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  const handleContinue = (unit) => {
    if (unit.requiresPremium && !user?.isPremium) { setPaywallOpen(true); return }
    navigate(`/units/${unit.id}`)
  }

  const currentStreak = streak?.currentStreak ?? streak?.streak ?? user?.streak ?? 0
  const points = streak?.totalPoints ?? user?.totalPoints ?? 0

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:py-8">
      <section className="mb-8 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-500 via-brand-600 to-accent-600 shadow-amber dark:border-brand-500/30 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:shadow-dark">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-normal text-white/75">Learning dashboard</p>
            <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
              Welcome back, {user?.firstName || 'learner'}.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
              Continue your current unit, review saved vocabulary, and keep your streak alive from one focused workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="brand" onClick={() => navigate('/units')}>
                Browse Units <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/vocabulary')} className="border-white/25 bg-white/15 text-white hover:bg-white/25 hover:text-white dark:border-white/20 dark:bg-white/10">
                Vocabulary
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-white/40">Current streak</p>
                <p className="mt-2 text-4xl font-black tracking-normal text-white">{currentStreak} days</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-400/20 text-warning-200">
                <Flame size={24} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/60">
              <Star size={15} className="fill-warning-300 text-warning-300" />
              <span className="font-bold text-warning-200">{Number(points).toLocaleString()} XP</span>
              <span>earned so far</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Words Saved" value={stats?.totalSavedWords ?? stats?.savedWords ?? user?.wordsSaved ?? 0} />
        <StatCard label="Available Units" value={units.length} />
        <StatCard label="Completed" value={stats?.totalUnitsCompleted ?? user?.unitsCompleted ?? 0} />
        <StatCard label="Level" value={user?.levelName || levelLabel(user?.englishLevel)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black tracking-normal text-slate-950 dark:text-white">Continue Learning</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/units')}>View all</Button>
          </div>

          <div className="space-y-3">
            {loading && <p className="text-sm text-dark-500">Loading units...</p>}
            {!loading && units.length === 0 && (
              <EmptyState icon={BookOpen} title="No units available yet" description="Once units are published, they will appear here." />
            )}
            {units.map((unit) => {
              const locked = unit.requiresPremium && !user?.isPremium
              return (
                <article key={unit.id} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-500">
                  <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl', locked ? 'bg-slate-800' : 'bg-brand-50 dark:bg-brand-500/10')}>
                    {unit.imageUrl ? <img src={unit.imageUrl} alt="" className="h-full w-full object-cover" /> : locked ? <Lock size={18} className="text-white/60" /> : <Play size={18} className="text-brand-600 dark:text-brand-300" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-950 dark:text-white">{unit.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="brand">{unit.levelName}</Badge>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{unit.wordCount ?? 0} words</span>
                      {unit.isCompleted && <Badge variant="success">Done</Badge>}
                      {locked && <Badge variant="warning">Premium</Badge>}
                    </div>
                  </div>
                  <Button size="sm" variant={unit.isCompleted ? 'secondary' : 'primary'} onClick={() => handleContinue(unit)}>
                    {locked ? 'Unlock' : unit.isCompleted ? 'Review' : 'Continue'}
                  </Button>
                </article>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-black tracking-normal text-slate-950 dark:text-white">Recent Quizzes</h2>
          <div className="space-y-3">
            {!loading && quizHistory.length === 0 && (
              <EmptyState icon={BookOpen} title="No quiz attempts yet" description="Your latest quiz scores will appear after your first attempt." />
            )}
            {quizHistory.map((q) => {
              const score = q.score ?? 0
              const color = score >= 80 ? 'text-brand-600 dark:text-brand-300' : score >= 50 ? 'text-warning-600 dark:text-warning-300' : 'text-red-600 dark:text-red-300'
              return (
                <article key={q.attemptId || q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{q.unitTitle || q.quizTitle || 'Quiz attempt'}</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className={`text-4xl font-black tracking-normal ${color}`}>{score}%</p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {q.correctCount ?? q.correctAnswers ?? 0}/{q.totalCount ?? q.totalQuestions ?? '-'} correct
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} onSuccess={() => setPaywallOpen(false)} />
    </div>
  )
}
