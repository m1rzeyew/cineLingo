import { useEffect, useState } from 'react'
import { Medal, Trophy, Users } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import PageHeader, { EmptyState } from '../../components/ui/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { cn, getApiErrorMessage, getInitials } from '../../utils/helpers'
import { leaderboardService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const rankTone = {
  1: 'bg-brand-500 text-white border-brand-500',
  2: 'bg-dark-900 text-white border-dark-900',
  3: 'bg-accent-500 text-white border-accent-500',
}

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [tab, setTab] = useState('weekly')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = tab === 'weekly'
          ? await leaderboardService.getWeekly()
          : await leaderboardService.getGlobal({ period: 'AllTime' })
        if (active) setData(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('leaderboard.loadError', 'Could not load leaderboard.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [tab])

  const maxScore = Math.max(...data.map(row => row.points ?? row.score ?? 0), 1)
  const topThree = data.slice(0, 3)
  const rest = data.slice(3)

  return (
    <div className="mx-auto max-w-screen-lg px-5 py-8 sm:px-6">
      <PageHeader
        eyebrow={t('community', 'Community')}
        title={t('leaderboard', 'Leaderboard')}
        description={t('leaderboard.description', 'Track the most consistent learners across the weekly board and all-time standings.')}
        action={
          <div className="inline-flex rounded-xl border border-cream-200 bg-white p-1 shadow-sm">
            {[
              { key: 'weekly', label: t('weekly', 'Weekly') },
              { key: 'alltime', label: t('allTime', 'All Time') },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  tab === key ? 'bg-dark-900 text-white' : 'text-dark-500 hover:bg-cream-50 hover:text-dark-900',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      {loading && (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(item => <div key={item} className="skeleton h-48" />)}
        </div>
      )}

      {!loading && error && <EmptyState icon={Trophy} title={t('leaderboardUnavailable', 'Leaderboard unavailable')} description={error} />}

      {!loading && !error && data.length === 0 && (
        <EmptyState icon={Users} title={t('noRankingsYet', 'No rankings yet')} description={t('leaderboard.emptyDescription', 'Complete quizzes to start building the board.')} />
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            {topThree.map((entry) => {
              const score = entry.points ?? entry.score ?? 0
              const name = entry.fullName || entry.name || t('learner', 'Learner')
              const isMe = entry.userId === user?.id || entry.email === user?.email
              return (
                <article
                  key={entry.userId || entry.rank}
                  className={cn(
                    'rounded-2xl border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover',
                    isMe ? 'border-brand-400 ring-2 ring-brand-100' : 'border-cream-200',
                  )}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black', rankTone[entry.rank] || 'border-cream-200 bg-cream-50 text-dark-700')}>
                      {entry.rank}
                    </span>
                    <Medal size={20} className={entry.rank === 1 ? 'text-brand-500' : 'text-dark-300'} />
                  </div>
                  <Avatar src={entry.avatarUrl} name={name} size="lg" />
                  <h2 className="mt-4 truncate text-lg font-black tracking-normal text-dark-900">
                    {entry.avatarUrl ? name : getInitials(name) && name}
                  </h2>
                  {isMe && <p className="mt-1 text-xs font-bold uppercase tracking-normal text-brand-600">{t('you', 'You')}</p>}
                  <p className="mt-4 text-2xl font-black tracking-normal text-dark-900">{Number(score).toLocaleString()} {t('pts', 'pts')}</p>
                </article>
              )
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
            {rest.map((entry) => {
              const score = entry.points ?? entry.score ?? 0
              const name = entry.fullName || entry.name || t('learner', 'Learner')
              const isMe = entry.userId === user?.id || entry.email === user?.email
              return (
                <div
                  key={entry.userId || entry.rank}
                  className={cn(
                    'grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-cream-100 px-4 py-4 last:border-b-0 sm:px-5',
                    isMe && 'bg-brand-50',
                  )}
                >
                  <span className="w-8 text-center text-sm font-black text-dark-500">{entry.rank}</span>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar src={entry.avatarUrl} name={name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-dark-900">{name}</p>
                      {isMe && <p className="text-xs font-semibold text-brand-600">{t('you', 'You')}</p>}
                    </div>
                  </div>
                  <div className="flex min-w-[112px] items-center gap-3">
                    <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-cream-200 sm:block">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.round((score / maxScore) * 100)}%` }} />
                    </div>
                    <span className="w-16 text-right text-xs font-black tabular-nums text-dark-600">{Number(score).toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
