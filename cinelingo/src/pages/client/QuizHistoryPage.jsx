import { useEffect, useState } from 'react'
import { Clock3, History, Trophy } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader, { EmptyState } from '../../components/ui/PageHeader'
import { cn, formatDate, getApiErrorMessage, scoreColor } from '../../utils/helpers'
import { quizService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

export default function QuizHistoryPage() {
  const { t } = useLanguage()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await quizService.getMyAttempts()
        if (active) setHistory(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('quizHistory.loadError', 'Could not load quiz history.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const average = history.length
    ? Math.round(history.reduce((sum, item) => sum + Number(item.score ?? 0), 0) / history.length)
    : 0

  return (
    <div className="mx-auto max-w-screen-lg px-5 py-8 sm:px-6">
      <PageHeader
        eyebrow={t('progress', 'Progress')}
        title={t('quizHistory', 'Quiz History')}
        description={t('quizHistory.description', 'Review previous attempts, scores, and completion status across your learning sessions.')}
        action={
          <div className="rounded-2xl border border-cream-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('average', 'Average')}</p>
            <p className={cn('text-2xl font-black tracking-normal', scoreColor(average))}>{average}%</p>
          </div>
        }
      />

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(item => <div key={item} className="skeleton h-24 w-full" />)}
        </div>
      )}

      {!loading && error && <EmptyState icon={History} title={t('historyUnavailable', 'History unavailable')} description={error} />}

      {!loading && !error && history.length === 0 && <EmptyState icon={Trophy} title={t('noQuizAttemptsYet', 'No quiz attempts yet')} description={t('quizHistory.emptyDescription', 'Take a quiz after a unit and your results will show here.')} />}

      {!loading && !error && history.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
          {history.map((q) => {
            const score = q.score ?? 0
            return (
              <article
                key={q.attemptId || q.id}
                className="grid gap-4 border-b border-cream-100 px-5 py-5 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-50">
                  <span className={cn('text-xl font-black tracking-normal', scoreColor(score))}>{score}%</span>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-black tracking-normal text-dark-900">{q.unitTitle || q.quizTitle || t('quizAttempt', 'Quiz attempt')}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant={q.passed ? 'success' : 'danger'}>{q.passed ? t('passed', 'Passed') : t('needsWork', 'Needs Work')}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-dark-500">
                      <Clock3 size={13} /> {q.timeTakenSeconds ?? 0}s
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-dark-500 sm:text-right">
                  {q.attemptedAt ? formatDate(q.attemptedAt) : ''}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
