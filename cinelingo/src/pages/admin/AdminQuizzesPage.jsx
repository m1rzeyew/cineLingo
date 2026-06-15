import { useEffect, useState } from 'react'
import { Bot, Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { levelQuizService, quizService, unitService } from '../../services'
import { getApiErrorMessage, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const QUIZ_QUESTION_COUNT = 10
const QUIZ_OPTIONS = ['A', 'B', 'C', 'D']
const blankQuestion = () => ({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' })
const blankQuestions = () => Array.from({ length: QUIZ_QUESTION_COUNT }, blankQuestion)
const EMPTY = { unitId: '', title: '', passingScore: 70, questions: blankQuestions() }

const normalizeQuestion = (question) => ({
  questionText: question.questionText ?? question.QuestionText ?? '',
  optionA: question.optionA ?? question.OptionA ?? '',
  optionB: question.optionB ?? question.OptionB ?? '',
  optionC: question.optionC ?? question.OptionC ?? '',
  optionD: question.optionD ?? question.OptionD ?? '',
  correctOption: question.correctOption ?? question.CorrectOption ?? 'A',
})

const normalize = (quiz) => ({
  ...quiz,
  id: quiz.id ?? quiz.Id,
  unitId: quiz.unitId ?? quiz.UnitId,
  title: quiz.title ?? quiz.Title,
  passingScore: quiz.passingScore ?? quiz.PassingScore,
  questions: Array.isArray(quiz.questions ?? quiz.Questions) ? (quiz.questions ?? quiz.Questions).map(normalizeQuestion) : [],
})

const safeNumber = (value) => {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10)
  return Number.isFinite(parsed) ? parsed : null
}

export default function AdminQuizzesPage() {
  const { t } = useLanguage()
  const [unitId, setUnitId] = useState('')
  const [units, setUnits] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [viewQuiz, setViewQuiz] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiDisabled, setAiDisabled] = useState(false)

  const loadUnits = async () => {
    try {
      const res = await unitService.getAll()
      setUnits((Array.isArray(res.data) ? res.data : []).map(item => ({
        id: item.id ?? item.Id,
        title: item.title ?? item.Title,
      })))
    } catch {
      setUnits([])
    }
  }

  const loadQuizzes = async (nextUnitId = unitId) => {
    setLoading(true)
    try {
      const params = nextUnitId ? { unitId: nextUnitId } : undefined
      const res = await quizService.getAll(params)
      setQuizzes((Array.isArray(res.data) ? res.data : []).map(normalize))
    } catch (err) {
      const status = err?.response?.status
      if (status === 500) {
        setQuizzes([])
      } else {
        showApiErrorOnce(err, t('admin.quizzes.loadError', 'Could not load quizzes.'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnits()
  }, [])

  useEffect(() => {
    loadQuizzes(unitId)
  }, [unitId])

  const set = key => e => setForm(prev => ({
    ...prev,
    [key]: key === 'passingScore' ? Number(e.target.value) : e.target.value,
  }))

  const setQuestion = (index, key, value) => setForm(prev => ({
    ...prev,
    questions: prev.questions.map((item, i) => i === index ? { ...item, [key]: value } : item),
  }))

  const hydrateQuiz = async (quiz) => {
    const quizId = safeNumber(quiz?.id ?? quiz?.Id)
    if (quizId == null) return null

    try {
      const res = await quizService.getById(quizId)
      return normalize(res.data)
    } catch {
      return normalize(quiz || {})
    }
  }

  const openForm = async (quiz = null) => {
    setModal('form')
    setTarget(quiz)

    if (!quiz) {
      setForm({ ...EMPTY, unitId, questions: blankQuestions() })
      return
    }

    try {
      const fullQuiz = await hydrateQuiz(quiz)
      setForm({
        unitId: String(fullQuiz?.unitId ?? fullQuiz?.UnitId ?? quiz.unitId ?? quiz.UnitId ?? ''),
        title: fullQuiz?.title ?? fullQuiz?.Title ?? '',
        passingScore: fullQuiz?.passingScore ?? fullQuiz?.PassingScore ?? 70,
        questions: (fullQuiz?.questions?.length ? fullQuiz.questions : blankQuestions()).map(normalizeQuestion),
      })
    } catch (err) {
      showApiErrorOnce(err, t('admin.quizzes.loadDetailError', 'Could not load quiz details.'))
    }
  }

  const openView = async (quiz) => {
    try {
      const fullQuiz = await hydrateQuiz(quiz)
      setViewQuiz(fullQuiz)
      setModal('view')
    } catch (err) {
      showApiErrorOnce(err, t('admin.quizzes.loadDetailError', 'Could not load quiz details.'))
    }
  }

  const validateForm = () => {
    const nextUnitId = safeNumber(form.unitId)
    const score = safeNumber(form.passingScore)
    const title = String(form.title || '').trim()
    const questions = Array.isArray(form.questions) ? form.questions : []

    if (nextUnitId == null) return t('admin.quizzes.validation.unit', 'Select a valid Unit.')
    if (!title) return t('admin.quizzes.validation.title', 'Quiz title is required.')
    if (score == null || score < 1 || score > 100) return t('admin.quizzes.validation.passingScore', 'Passing score must be between 1 and 100.')
    if (questions.length !== QUIZ_QUESTION_COUNT) return t('admin.quizzes.validation.questionCount', 'Quiz must have exactly 10 questions.')

    const invalidQuestion = questions.find(question => {
      const requiredText = [
        question.questionText,
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD,
      ].every(value => String(value || '').trim())
      return !requiredText || !QUIZ_OPTIONS.includes(question.correctOption)
    })

    return invalidQuestion ? t('admin.quizzes.validation.questions', 'Each question must include text, options A-D, and a valid correct option.') : null
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }
    setSaving(true)
    try {
      const res = target ? await quizService.update(target.id, form) : await quizService.create(form)
      const saved = normalize(res.data)
      setModal(null)
      setTarget(null)
      setForm({ ...EMPTY, questions: blankQuestions() })
      await loadQuizzes(saved.unitId || unitId)
      toast.success(target ? t('admin.quizzes.updated', 'Quiz updated.') : t('admin.quizzes.created', 'Quiz created.'))
    } catch (err) {
      showApiErrorOnce(err, t('admin.quizzes.saveError', 'Could not save quiz.'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!target) return
    if (saving) return
    setSaving(true)
    try {
      await quizService.delete(target.id)
      setModal(null)
      setTarget(null)
      await loadQuizzes(unitId)
      toast.success(t('admin.quizzes.deleted', 'Quiz deleted.'))
    } catch (err) {
      showApiErrorOnce(err, t('admin.quizzes.deleteError', 'Could not delete quiz.'))
    } finally {
      setSaving(false)
    }
  }

  const generateUnitQuiz = async () => {
    if (saving || aiDisabled) return
    const nextUnitId = safeNumber(unitId)
    if (nextUnitId == null) {
      toast.error(t('admin.selectUnitFirst', 'Select a Unit first'))
      return
    }

    setSaving(true)
    try {
      const res = await quizService.generate(nextUnitId)
      const saved = normalize(res.data)
      setUnitId(String(nextUnitId))
      setQuizzes(prev => {
        const next = prev.filter(item => String(item.unitId) !== String(saved.unitId))
        return [...next, saved]
      })
      toast.success(t('admin.quizzes.generated', 'Unit quiz generated.'))
    } catch (err) {
      const message = getApiErrorMessage(err, t('admin.quizzes.generateError', 'Could not generate quiz.'))
      if (message.toLowerCase().includes('groq')) setAiDisabled(true)
      showApiErrorOnce(err, message)
    } finally {
      setSaving(false)
    }
  }

  const generatePlacementQuiz = async () => {
    if (saving || aiDisabled) return
    setSaving(true)
    try {
      await levelQuizService.generate()
      toast.success(t('admin.quizzes.placementGenerated', 'Placement quiz generated.'))
    } catch (err) {
      const message = getApiErrorMessage(err, t('admin.quizzes.placementGenerateError', 'Could not generate placement quiz.'))
      if (message.toLowerCase().includes('groq')) setAiDisabled(true)
      showApiErrorOnce(err, message)
    } finally {
      setSaving(false)
    }
  }

  const getUnitTitle = (id) => units.find(item => String(item.id) === String(id))?.title

  const columns = [
    { key: 'title', label: t('title', 'Title'), render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    {
      key: 'unitId',
      label: t('unit', 'Unit'),
      render: v => {
        const unit = units.find(item => String(item.id) === String(v))
        return <span className="text-sm">{unit?.title || `#${v}`}</span>
      },
    },
    { key: 'questions', label: t('questions', 'Questions'), render: v => <Badge>{Array.isArray(v) ? v.length : 0}</Badge> },
    { key: 'passingScore', label: t('passingScore', 'Pass'), render: v => <span className="text-sm">{v ?? 70}%</span> },
    {
      key: 'actions',
      label: '',
      width: '120px',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openView(row)} className="rounded-lg p-1.5 text-dark-500 transition-colors hover:bg-brand-50 hover:text-brand-700" aria-label={t('view', 'View')}>
            <Eye size={14} />
          </button>
          <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 transition-colors hover:bg-cream-100" aria-label={t('edit', 'Edit')}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 transition-colors hover:bg-red-50 hover:text-red-600" aria-label={t('delete', 'Delete')}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">{t('quizzes', 'Quizzes')}</h1>
          <p className="mt-0.5 text-sm text-dark-600">{quizzes.length} {t('quizzes', 'quizzes')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={unitId}
            onChange={e => setUnitId(e.target.value)}
            className="min-w-56 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">{t('allUnits', 'All units')}</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={generateUnitQuiz} disabled={saving || aiDisabled || !safeNumber(unitId)}><Bot size={16} /> {t('generateUnitQuiz', 'Generate Unit Quiz')}</Button>
          <Button variant="secondary" onClick={generatePlacementQuiz} disabled={saving || aiDisabled}><Bot size={16} /> {t('generatePlacementQuiz', 'Generate Placement Quiz')}</Button>
          <Button onClick={() => openForm()} disabled={saving}><Plus size={16} /> {t('createQuiz', 'Create Quiz')}</Button>
        </div>
      </div>

      <Table columns={columns} data={quizzes} loading={loading} emptyMessage={t('noQuizzesFound', 'No quizzes found.')} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? t('editQuiz', 'Edit Quiz') : t('createQuiz', 'Create Quiz')} size="xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label mb-1.5 block">{t('unit', 'Unit')}</label>
            <select
              value={form.unitId}
              onChange={set('unitId')}
              className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              required
              disabled={!!target}
            >
              <option value="">{t('selectUnit', 'Select Unit')}</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
              ))}
            </select>
          </div>
          <Input label={t('title', 'Title')} value={form.title} onChange={set('title')} required />
          <Input label={t('passingScore', 'Passing Score')} type="number" min="1" max="100" value={form.passingScore} onChange={set('passingScore')} required />
          <p className="text-xs font-semibold text-dark-500">
            {form.questions.length} / {QUIZ_QUESTION_COUNT} {t('questions', 'Questions')}
          </p>
          <div className="space-y-4">
            {form.questions.map((question, index) => (
              <div key={index} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-dark-800">{t('question', 'Question')} {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }))}
                    className="rounded-lg p-1.5 text-dark-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t('removeQuestion', 'Remove question')}
                    disabled={form.questions.length <= 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <Input label={t('questionText', 'Question Text')} value={question.questionText} onChange={e => setQuestion(index, 'questionText', e.target.value)} required />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {['A', 'B', 'C', 'D'].map(letter => (
                    <Input key={letter} label={`${t('option', 'Option')} ${letter}`} value={question[`option${letter}`]} onChange={e => setQuestion(index, `option${letter}`, e.target.value)} required />
                  ))}
                </div>
                <div className="mt-3">
                  <label className="field-label mb-1.5 block">{t('correctOption', 'Correct Option')}</label>
                  <select value={question.correctOption} onChange={e => setQuestion(index, 'correctOption', e.target.value)} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" disabled={form.questions.length >= QUIZ_QUESTION_COUNT} onClick={() => setForm(prev => ({ ...prev, questions: [...prev.questions, blankQuestion()] }))}>
            {t('addQuestion', 'Add Question')}
          </Button>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
            <Button type="submit" fullWidth loading={saving}>{target ? t('saveChanges', 'Save Changes') : t('createQuiz', 'Create Quiz')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title={viewQuiz?.title || t('quizDetails', 'Quiz Details')} size="xl">
        {viewQuiz && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('unit', 'Unit')}</p>
                <p className="mt-1 text-sm font-semibold text-dark-900">{getUnitTitle(viewQuiz.unitId) || `#${viewQuiz.unitId}`}</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('passingScore', 'Passing Score')}</p>
                <p className="mt-1 text-sm font-semibold text-dark-900">{viewQuiz.passingScore ?? 70}%</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('questions', 'Questions')}</p>
                <p className="mt-1 text-sm font-semibold text-dark-900">{viewQuiz.questions.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {viewQuiz.questions.map((question, index) => (
                <div key={`${question.questionText}-${index}`} className="rounded-2xl border border-cream-200 bg-white p-4">
                  <p className="font-semibold text-dark-900">{index + 1}. {question.questionText}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[
                      ['A', question.optionA],
                      ['B', question.optionB],
                      ['C', question.optionC],
                      ['D', question.optionD],
                    ].map(([letter, value]) => (
                      <div key={letter} className={`rounded-xl border px-3 py-2 text-sm ${question.correctOption === letter ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-cream-200 bg-cream-50 text-dark-700'}`}>
                        <span className="mr-2 font-bold">{letter}.</span>
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title={t('deleteQuiz', 'Delete Quiz')} size="sm">
        <p className="mb-5 text-sm text-dark-700">
          {t('deleteQuizConfirm', 'Delete')} <strong>{target?.title}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
          <Button variant="danger" fullWidth onClick={remove} loading={saving}>{t('delete', 'Delete')}</Button>
        </div>
      </Modal>
    </div>
  )
}
