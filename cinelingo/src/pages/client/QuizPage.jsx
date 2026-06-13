import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Check, CheckCircle, ChevronLeft, ChevronRight, Circle, XCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/PageHeader'
import { cn, getApiErrorMessage } from '../../utils/helpers'
import { quizService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const optionList = (question) => [
  { id: 'A', text: question.optionA },
  { id: 'B', text: question.optionB },
  { id: 'C', text: question.optionC },
  { id: 'D', text: question.optionD },
].filter(opt => opt.text)

export default function QuizPage() {
  const { t } = useLanguage()
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const ctx = useOutletContext()
  const setChatOpen = ctx?.setChatOpen ?? (() => {})
  const startedAt = useRef(Date.now())

  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = location.state?.unitId
          ? await quizService.getByUnit(location.state.unitId)
          : await quizService.getById(quizId)
        if (active) setQuiz(res.data)
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('quiz.loadError', 'Could not load quiz.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [location.state?.unitId, quizId])

  const questions = useMemo(() => Array.isArray(quiz?.questions) ? quiz.questions : [], [quiz])
  const q = questions[current]
  const total = questions.length
  const progress = total ? Math.round(((current + 1) / total) * 100) : 0
  const answeredCount = Object.values(answers).filter(Boolean).length

  const handleSelect = (optId) => {
    if (result || !q) return
    setAnswers(p => ({ ...p, [q.id]: optId }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setChatOpen(true)
    try {
      const payload = {
        quizId: quiz.id,
        timeTakenSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        answers: questions.map(question => ({
          questionId: question.id,
          selectedOption: answers[question.id],
        })),
      }
      const res = await quizService.submit(payload)
      setResult(res.data)
    } catch (err) {
      setError(getApiErrorMessage(err, t('quiz.submitError', 'Could not submit quiz.')))
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setCurrent(0)
    setAnswers({})
    setResult(null)
    startedAt.current = Date.now()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
        <div className="skeleton h-8 w-36" />
        <div className="skeleton mt-8 h-40 w-full" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map(item => <div key={item} className="skeleton h-14 w-full" />)}
        </div>
      </div>
    )
  }

  if (error || !q) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
        <EmptyState icon={XCircle} title={t('quiz.unavailableTitle', 'Quiz unavailable')} description={error || t('quiz.notFound', 'Quiz not found.')} />
      </div>
    )
  }

  if (result) {
    const score = result.score ?? 0
    const correct = result.correctCount ?? 0
    const totalCount = result.totalCount ?? total
    return (
      <div className="mx-auto max-w-screen-md px-5 py-12 text-center sm:px-6">
        <div className={cn('mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl', result.passed ? 'bg-brand-100 text-brand-600' : 'bg-red-100 text-red-600')}>
          {result.passed ? <CheckCircle size={38} /> : <XCircle size={38} />}
        </div>
        <p className="text-xs font-bold uppercase tracking-normal text-brand-600">{t('quizResult', 'Quiz Result')}</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-dark-900">
          {score >= 80 ? t('quiz.excellentWork', 'Excellent work') : score >= 60 ? t('quiz.solidProgress', 'Solid progress') : t('quiz.keepPracticing', 'Keep practicing')}
        </h1>
        <div className="mx-auto my-7 max-w-xs rounded-2xl border border-cream-200 bg-white p-6 shadow-card">
          <p className="text-6xl font-black tracking-normal text-brand-600">{score}%</p>
          <p className="mt-2 text-sm text-dark-500">{correct} {t('correctOutOf', 'correct out of')} {totalCount} {t('questions', 'questions')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={() => navigate(-1)}>{t('backToUnit', 'Back to Unit')}</Button>
          <Button onClick={reset}>{t('retryQuiz', 'Retry Quiz')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-semibold text-dark-600 transition-colors hover:bg-dark-900/5 hover:text-dark-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronLeft size={16} /> {t('exitQuiz', 'Exit Quiz')}
        </button>
        <span className="rounded-full border border-cream-200 bg-white px-3 py-1 text-xs font-bold text-dark-600">
          {answeredCount} / {total} {t('answered', 'answered')}
        </span>
      </div>

      <div className="mb-8 overflow-hidden rounded-full bg-cream-200">
        <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <section className="mb-6 rounded-2xl border border-cream-200 bg-white p-6 shadow-card sm:p-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-normal text-brand-600">{t('question', 'Question')} {current + 1}</p>
        <h1 className="text-2xl font-black leading-tight tracking-normal text-dark-900">{q.questionText}</h1>
      </section>

      <div className="mb-8 space-y-3">
        {optionList(q).map((opt, i) => {
          const selected = answers[q.id] === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                selected
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-cream-200 bg-white text-dark-800 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card',
              )}
            >
              <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black',
                selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-cream-300 bg-cream-50 text-dark-500',
              )}>
                {selected ? <Check size={15} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 flex-1 leading-6">{opt.text}</span>
              {!selected && <Circle size={16} className="text-dark-300" />}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          <ChevronLeft size={16} /> {t('previous', 'Previous')}
        </Button>
        {current < total - 1 ? (
          <Button className="sm:flex-1" onClick={() => setCurrent(c => c + 1)} disabled={!answers[q.id]}>
            {t('next', 'Next')} <ChevronRight size={16} />
          </Button>
        ) : (
          <Button className="sm:flex-1" variant="brand" loading={submitting} disabled={answeredCount < total} onClick={handleSubmit}>
            {t('submitQuiz', 'Submit Quiz')}
          </Button>
        )}
      </div>
    </div>
  )
}
