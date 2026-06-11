import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock, GraduationCap, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/PageHeader'
import { levelQuizService } from '../../services'
import { getApiErrorMessage, levelLabel } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

const LIMIT_SECONDS = 20 * 60

const options = (question) => [
  ['A', question.optionA ?? question.OptionA],
  ['B', question.optionB ?? question.OptionB],
  ['C', question.optionC ?? question.OptionC],
  ['D', question.optionD ?? question.OptionD],
].filter(([, text]) => text)

const formatTime = (seconds) => {
  const value = Math.max(0, seconds)
  const minutes = Math.floor(value / 60)
  const rest = value % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export default function LevelSelectionPage() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [remaining, setRemaining] = useState(LIMIT_SECONDS)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const question = questions[current]
  const selected = question ? answers[question.id ?? question.Id] : null
  const done = !!result

  const answerPayload = useMemo(() => questions.map(item => ({
    questionId: item.id ?? item.Id,
    selectedOption: answers[item.id ?? item.Id] || '',
  })), [answers, questions])

  const submitQuiz = async () => {
    if (submitting || done || questions.length === 0) return
    setSubmitting(true)
    try {
      const res = await levelQuizService.submit(answerPayload)
      setResult(res.data)
      await refreshUser()
      toast.success('Placement quiz completed.')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not submit placement quiz.'))
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!started || done) return undefined
    const timer = window.setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          window.clearInterval(timer)
          submitQuiz()
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, done, answerPayload])

  const startQuiz = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await levelQuizService.getQuestions()
      const nextQuestions = Array.isArray(res.data) ? res.data.slice(0, 15) : []
      setQuestions(nextQuestions)
      setStarted(true)
      setCurrent(0)
      setAnswers({})
      setRemaining(LIMIT_SECONDS)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load placement questions.'))
    } finally {
      setLoading(false)
    }
  }

  const choose = (option) => {
    if (!question || done) return
    setAnswers(prev => ({ ...prev, [question.id ?? question.Id]: option }))
  }

  const next = async () => {
    if (!selected) return
    if (current >= questions.length - 1) {
      await submitQuiz()
      return
    }
    setCurrent(value => value + 1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,125,60,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(155,115,85,0.16),transparent_32%)]" />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
            <GraduationCap size={18} />
          </div>
          <span className="text-xl font-black tracking-normal text-slate-950 dark:text-white">
            Cine<span className="text-brand-500">Lingo</span>
          </span>
        </div>

        {!started && !result && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <Play size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white">Start Placement Quiz</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Answer 15 multiple-choice questions in 20 minutes. CineLingo will assign your learning level automatically.
            </p>
            {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <Button className="mt-8 min-w-[180px]" size="lg" variant="brand" loading={loading} onClick={startQuiz}>
              Start Quiz <ArrowRight size={17} />
            </Button>
          </div>
        )}

        {started && !result && question && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-brand-600 dark:text-brand-300">
                  Question {current + 1} of {questions.length}
                </p>
                <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Clock size={15} className="text-brand-500" />
                {formatTime(remaining)}
              </div>
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-normal text-slate-950 dark:text-white">
              {question.question ?? question.Question}
            </h1>

            <div className="mt-6 grid gap-3">
              {options(question).map(([key, text]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => choose(key)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                    selected === key
                      ? 'border-brand-500 bg-brand-50 text-brand-800 ring-4 ring-brand-500/10 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-500'
                  }`}
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {key}
                  </span>
                  {text}
                </button>
              ))}
            </div>

            {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <div className="mt-8 flex justify-end">
              <Button variant="brand" disabled={!selected} loading={submitting} onClick={next}>
                {current >= questions.length - 1 ? 'Submit Quiz' : 'Next Question'} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {started && !result && !question && !loading && (
          <EmptyState icon={GraduationCap} title="Placement quiz unavailable" description={error || 'No placement questions were returned.'} />
        )}

        {result && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <CheckCircle size={26} />
            </div>
            <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white">
              Your Level: {levelLabel(result.assignedLevel ?? result.AssignedLevel)}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your dashboard is ready with learning units matched to your placement.
            </p>
            <Button className="mt-8 min-w-[190px]" size="lg" variant="brand" onClick={() => navigate('/dashboard', { replace: true })}>
              Go to Dashboard <ArrowRight size={17} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
