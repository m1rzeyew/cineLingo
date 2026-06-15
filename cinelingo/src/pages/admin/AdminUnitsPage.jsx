import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { quizService, unitService, videoService, wordService } from '../../services'
import { levelLabel, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const EMPTY = { title: '', description: '', englishLevel: 0, imageFile: null }
const VIDEO_EMPTY = { title: '', videoFile: null, subtitleFile: null }
const blankWord = () => ({ term: '', definition: '', exampleSentence: '', pronunciation: '' })
const QUIZ_QUESTION_COUNT = 10
const QUIZ_OPTIONS = ['A', 'B', 'C', 'D']
const blankQuestion = () => ({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' })
const blankQuestions = () => Array.from({ length: QUIZ_QUESTION_COUNT }, blankQuestion)
const quizEmpty = () => ({ title: '', passingScore: 70, questions: blankQuestions() })

const normalize = (unit) => ({
  ...unit,
  id: unit.id ?? unit.Id,
  title: unit.title ?? unit.Title,
  description: unit.description ?? unit.Description,
  englishLevel: unit.englishLevel ?? unit.EnglishLevel,
  status: unit.status ?? unit.Status,
})

export default function AdminUnitsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [units, setUnits] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardUnit, setWizardUnit] = useState(null)
  const [videoForm, setVideoForm] = useState(VIDEO_EMPTY)
  const [wordForms, setWordForms] = useState([blankWord()])
  const [quizForm, setQuizForm] = useState(quizEmpty)

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.type === 'file' ? e.target.files?.[0] : e.target.value }))
  const setVideo = key => e => setVideoForm(prev => ({ ...prev, [key]: e.target.type === 'file' ? e.target.files?.[0] : e.target.value }))
  const setWord = (index, key, value) => setWordForms(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item))
  const setQuiz = key => e => setQuizForm(prev => ({ ...prev, [key]: key === 'passingScore' ? Number(e.target.value) : e.target.value }))
  const setQuestion = (index, key, value) => setQuizForm(prev => ({
    ...prev,
    questions: prev.questions.map((item, i) => i === index ? { ...item, [key]: value } : item),
  }))

  const load = async () => {
    setLoading(true)
    try {
      const res = await unitService.getAll()
      setUnits((Array.isArray(res.data) ? res.data : []).map(normalize))
    } catch (err) {
      showApiErrorOnce(err, t('admin.units.loadError', 'Could not load units.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resetWizard = () => {
    setWizardStep(0)
    setWizardUnit(null)
    setVideoForm(VIDEO_EMPTY)
    setWordForms([blankWord()])
    setQuizForm(quizEmpty())
  }

  const openForm = (unit = null) => {
    setTarget(unit)
    resetWizard()
    setForm(unit ? {
      title: unit.title || '',
      description: unit.description || '',
      englishLevel: unit.englishLevel ?? 0,
      imageFile: null,
    } : EMPTY)
    setModal('form')
  }

  const validateQuizForm = () => {
    if (!String(quizForm.title || '').trim()) return t('admin.quizzes.validation.title', 'Quiz title is required.')
    const score = Number(quizForm.passingScore)
    if (!Number.isFinite(score) || score < 1 || score > 100) return t('admin.quizzes.validation.passingScore', 'Passing score must be between 1 and 100.')
    if (!Array.isArray(quizForm.questions) || quizForm.questions.length !== QUIZ_QUESTION_COUNT) return t('admin.quizzes.validation.questionCount', 'Quiz must have exactly 10 questions.')
    const invalid = quizForm.questions.some(question => ![
      question.questionText,
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ].every(value => String(value || '').trim()) || !QUIZ_OPTIONS.includes(question.correctOption))
    return invalid ? t('admin.quizzes.validation.questions', 'Each question must include text, options A-D, and a valid correct option.') : null
  }

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      if (target) {
        await unitService.update(target.id, form)
        await load()
        toast.success(t('admin.units.updated', 'Unit updated.'))
        setModal(null)
        return
      }

      if (wizardStep === 0) {
        const res = await unitService.create(form)
        const created = normalize(res.data || {})
        if (!created.id) throw new Error(t('admin.units.missingCreatedId', 'Backend did not return the created Unit ID.'))
        setWizardUnit(created)
        setVideoForm(prev => ({ ...prev, title: created.title || form.title || '' }))
        setQuizForm(prev => ({ ...prev, title: `${created.title || form.title} Quiz` }))
        setWizardStep(1)
        await load()
        return
      }

      const unitId = wizardUnit?.id
      if (!unitId) throw new Error(t('admin.units.missingCreatedId', 'Backend did not return the created Unit ID.'))

      if (wizardStep === 1) {
        if (!videoForm.videoFile) throw new Error(t('admin.videos.validation.file', 'Video file is required.'))
        await videoService.create({ ...videoForm, unitId })
        setWizardStep(2)
        return
      }

      if (wizardStep === 2) {
        const filled = wordForms.filter(word => String(word.term || '').trim() || String(word.definition || '').trim())
        if (filled.length === 0) throw new Error(t('admin.words.validation.required', 'Add at least one word.'))
        const hasPartial = filled.some(word => !String(word.term || '').trim() || !String(word.definition || '').trim())
        if (hasPartial) throw new Error(t('admin.words.validation.termDefinition', 'Each word needs a term and definition.'))
        await Promise.all(filled.map(word => wordService.create({ ...word, unitId })))
        setWizardStep(3)
        return
      }

      const quizError = validateQuizForm()
      if (quizError) throw new Error(quizError)
      await quizService.create({ ...quizForm, unitId })
      await load()
      toast.success(t('admin.units.created', 'Unit created.'))
      setModal(null)
      resetWizard()
    } catch (err) {
      showApiErrorOnce(err, t('admin.units.saveError', 'Could not save unit.'))
    } finally {
      setSaving(false)
    }
  }

  const generateWizardQuiz = async () => {
    if (saving) return
    const unitId = wizardUnit?.id
    if (!unitId) {
      showApiErrorOnce(new Error(t('admin.units.missingCreatedId', 'Backend did not return the created Unit ID.')))
      return
    }

    setSaving(true)
    try {
      await quizService.generate(unitId)
      await load()
      toast.success(t('admin.units.created', 'Unit created.'))
      setModal(null)
      resetWizard()
    } catch (err) {
      showApiErrorOnce(err, t('admin.quizzes.generateError', 'Could not generate quiz.'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!target || saving) return
    setSaving(true)
    try {
      await unitService.delete(target.id)
      await load()
      toast.success(t('admin.units.deleted', 'Unit deleted.'))
      setModal(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.units.deleteError', 'Could not delete unit.'))
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (unit) => {
    const published = unit.status === 'Published'
    try {
      await (published ? unitService.unpublish(unit.id) : unitService.publish(unit.id))
      await load()
      toast.success(published ? t('admin.units.unpublished', 'Unit unpublished.') : t('admin.units.published', 'Unit published.'))
    } catch (err) {
      showApiErrorOnce(err, t('admin.units.statusError', 'Could not update unit status.'))
    }
  }

  const filtered = level === '' ? units : units.filter(unit => String(unit.englishLevel) === level)
  const openDetail = (unit) => {
    if (unit?.id) navigate(`/admin/units/${unit.id}`)
  }
  const columns = [
    { key: 'title', label: t('title', 'Title'), render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'englishLevel', label: t('level', 'Level'), render: v => <Badge variant="brand">{t(levelLabel(v), levelLabel(v))}</Badge> },
    { key: 'status', label: t('status', 'Status'), render: v => <Badge variant={v === 'Published' ? 'success' : 'default'}>{v ? t(v, v) : t('draft', 'Draft')}</Badge> },
    { key: 'actions', label: '', width: '140px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => openDetail(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-brand-50 hover:text-brand-700" aria-label={t('view', 'View')}><Eye size={14} /></button>
        <button onClick={() => togglePublish(row)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-dark-500 hover:bg-brand-50 hover:text-brand-700" aria-label={row.status === 'Published' ? t('unpublish', 'Unpublish') : t('publish', 'Publish')}>{row.status === 'Published' ? <EyeOff size={14} /> : <CheckCircle2 size={14} />}{row.status === 'Published' ? t('unpublish', 'Unpublish') : t('publish', 'Publish')}</button>
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">{t('units', 'Units')}</h1>
          <p className="mt-0.5 text-sm text-dark-600">{filtered.length} {t('learningUnits', 'learning units')}</p>
        </div>
        <div className="flex gap-2">
          <select value={level} onChange={e => setLevel(e.target.value)} className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">{t('allLevels', 'All levels')}</option>
            <option value="0">{t('beginner', 'Beginner')}</option>
            <option value="1">{t('intermediate', 'Intermediate')}</option>
            <option value="2">{t('advanced', 'Advanced')}</option>
          </select>
          <Button onClick={() => openForm()}><Plus size={16} /> {t('createUnit', 'Create Unit')}</Button>
        </div>
      </div>

      <Table columns={columns} data={filtered} loading={loading} emptyMessage={t('noUnitsFound', 'No units found.')} onRowClick={openDetail} />

      <Modal open={modal === 'form'} onClose={() => !saving && setModal(null)} title={target ? t('editUnit', 'Edit Unit') : t('createUnit', 'Create Unit')} size={target ? 'md' : 'xl'}>
        <form onSubmit={submit} className="space-y-4">
          {!target && (
            <div className="grid gap-2 sm:grid-cols-4">
              {[t('unit', 'Unit'), t('video', 'Video'), t('words', 'Words'), t('quiz', 'Quiz')].map((label, index) => (
                <div key={label} className={`rounded-xl border px-3 py-2 text-xs font-bold ${wizardStep === index ? 'border-brand-300 bg-brand-50 text-brand-700' : wizardStep > index ? 'border-brand-200 bg-white text-brand-600' : 'border-cream-200 bg-cream-50 text-dark-400'}`}>
                  {index + 1}. {label}
                </div>
              ))}
            </div>
          )}

          {(target || wizardStep === 0) && (
            <>
              <Input label={t('title', 'Title')} value={form.title} onChange={set('title')} required />
              <div>
                <label className="field-label mb-1.5 block">{t('description', 'Description')}</label>
                <textarea value={form.description} onChange={set('description')} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" required />
              </div>
              <div>
                <label className="field-label mb-1.5 block">{t('englishLevel', 'English Level')}</label>
                <select value={form.englishLevel} onChange={set('englishLevel')} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                  <option value="0">{t('beginner', 'Beginner')}</option>
                  <option value="1">{t('intermediate', 'Intermediate')}</option>
                  <option value="2">{t('advanced', 'Advanced')}</option>
                </select>
              </div>
              <Input label={t('image', 'Image')} type="file" accept="image/*" onChange={set('imageFile')} />
            </>
          )}

          {!target && wizardStep === 1 && (
            <>
              <Input label={t('title', 'Title')} value={videoForm.title} onChange={setVideo('title')} required />
              <Input label={t('videoFile', 'Video File')} type="file" accept="video/*" onChange={setVideo('videoFile')} required />
              <Input label={t('subtitleFile', 'Subtitle File')} type="file" accept=".srt,.vtt" onChange={setVideo('subtitleFile')} />
            </>
          )}

          {!target && wizardStep === 2 && (
            <div className="space-y-4">
              {wordForms.map((word, index) => (
                <div key={index} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-dark-800">{t('word', 'Word')} {index + 1}</span>
                    <button type="button" disabled={wordForms.length <= 1} onClick={() => setWordForms(prev => prev.filter((_, i) => i !== index))} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40" aria-label={t('delete', 'Delete')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input label={t('term', 'Term')} value={word.term} onChange={e => setWord(index, 'term', e.target.value)} required />
                    <Input label={t('definition', 'Definition')} value={word.definition} onChange={e => setWord(index, 'definition', e.target.value)} required />
                    <Input label={t('pronunciation', 'Pronunciation')} value={word.pronunciation} onChange={e => setWord(index, 'pronunciation', e.target.value)} />
                    <Input label={t('exampleSentence', 'Example Sentence')} value={word.exampleSentence} onChange={e => setWord(index, 'exampleSentence', e.target.value)} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => setWordForms(prev => [...prev, blankWord()])}><Plus size={16} /> {t('addWord', 'Add Word')}</Button>
            </div>
          )}

          {!target && wizardStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                <Input label={t('title', 'Title')} value={quizForm.title} onChange={setQuiz('title')} required />
                <Input label={t('passingScore', 'Passing Score')} type="number" min="1" max="100" value={quizForm.passingScore} onChange={setQuiz('passingScore')} required />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-dark-500">{quizForm.questions.length} / {QUIZ_QUESTION_COUNT} {t('questions', 'Questions')}</p>
                <Button type="button" variant="secondary" size="sm" loading={saving} onClick={generateWizardQuiz}>{t('generateUnitQuiz', 'Generate Unit Quiz')}</Button>
              </div>
              <div className="space-y-4">
                {quizForm.questions.map((question, index) => (
                  <div key={index} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                    <Input label={`${t('question', 'Question')} ${index + 1}`} value={question.questionText} onChange={e => setQuestion(index, 'questionText', e.target.value)} required />
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {QUIZ_OPTIONS.map(letter => (
                        <Input key={letter} label={`${t('option', 'Option')} ${letter}`} value={question[`option${letter}`]} onChange={e => setQuestion(index, `option${letter}`, e.target.value)} required />
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className="field-label mb-1.5 block">{t('correctOption', 'Correct Option')}</label>
                      <select value={question.correctOption} onChange={e => setQuestion(index, 'correctOption', e.target.value)} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                        {QUIZ_OPTIONS.map(letter => <option key={letter} value={letter}>{letter}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth disabled={saving} onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
            <Button type="submit" fullWidth loading={saving}>
              {target ? t('saveChanges', 'Save Changes') : wizardStep >= 3 ? t('createQuiz', 'Create Quiz') : t('next', 'Next')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title={t('deleteUnit', 'Delete Unit')} size="sm">
        <p className="mb-5 text-sm text-dark-700">{t('deleteConfirmPrefix', 'Delete')} <strong>{target?.title}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)} disabled={saving}>{t('cancel', 'Cancel')}</Button>
          <Button variant="danger" fullWidth onClick={remove} loading={saving}>{t('delete', 'Delete')}</Button>
        </div>
      </Modal>
    </div>
  )
}
