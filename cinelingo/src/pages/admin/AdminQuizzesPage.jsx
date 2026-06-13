import { useEffect, useState } from 'react'
import { Bot, Edit2, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { quizService, unitService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

const blankQuestion = () => ({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' })
const EMPTY = { unitId: '', title: '', passingScore: 70, questions: [blankQuestion()] }

const normalize = (quiz) => ({
  ...quiz,
  id: quiz.id ?? quiz.Id,
  unitId: quiz.unitId ?? quiz.UnitId,
  title: quiz.title ?? quiz.Title,
  passingScore: quiz.passingScore ?? quiz.PassingScore,
  questions: quiz.questions ?? quiz.Questions ?? [],
})

export default function AdminQuizzesPage() {
  const [unitId, setUnitId] = useState('')
  const [units, setUnits] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = unitId ? await quizService.getAll({ unitId }) : await quizService.getAll()
      setQuizzes((Array.isArray(res.data) ? res.data : []).map(normalize))
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not load quizzes.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [unitId])

  useEffect(() => {
    let active = true
    const loadUnits = async () => {
      try {
        const res = await unitService.getAll()
        if (!active) return
        setUnits((Array.isArray(res.data) ? res.data : []).map(item => ({
          id: item.id ?? item.Id,
          title: item.title ?? item.Title,
        })))
      } catch {
        if (active) setUnits([])
      }
    }
    loadUnits()
    return () => { active = false }
  }, [])

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))
  const setQuestion = (index, key, value) => setForm(prev => ({
    ...prev,
    questions: prev.questions.map((item, i) => i === index ? { ...item, [key]: value } : item),
  }))

  const openForm = (quiz = null) => {
    setTarget(quiz)
    setForm(quiz ? {
      unitId: quiz.unitId || '',
      title: quiz.title || '',
      passingScore: quiz.passingScore ?? 70,
      questions: (quiz.questions?.length ? quiz.questions : [blankQuestion()]).map(q => ({
        questionText: q.questionText ?? q.QuestionText ?? '',
        optionA: q.optionA ?? q.OptionA ?? '',
        optionB: q.optionB ?? q.OptionB ?? '',
        optionC: q.optionC ?? q.OptionC ?? '',
        optionD: q.optionD ?? q.OptionD ?? '',
        correctOption: q.correctOption ?? q.CorrectOption ?? 'A',
      })),
    } : { ...EMPTY, unitId })
    setModal('form')
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = target ? await quizService.update(target.id, form) : await quizService.create(form)
      const saved = normalize(res.data)
      setQuizzes(prev => target ? prev.map(item => item.id === target.id ? saved : item) : [...prev, saved])
      toast.success(target ? 'Quiz updated.' : 'Quiz created.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save quiz.'))
    }
  }

  const remove = async () => {
    try {
      await quizService.delete(target.id)
      setQuizzes(prev => prev.filter(item => item.id !== target.id))
      toast.success('Quiz deleted.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete quiz.'))
    }
  }

  const generateUnitQuiz = async () => {
    if (!unitId) return
    try {
      const res = await quizService.generate(unitId)
      setQuizzes(prev => [...prev, normalize(res.data)])
      toast.success('Unit quiz generated.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not generate quiz.'))
    }
  }

  const columns = [
    { key: 'title', label: 'Title', render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'unitId', label: 'Unit', render: v => <span className="text-sm">#{v}</span> },
    { key: 'questions', label: 'Questions', render: v => <Badge>{Array.isArray(v) ? v.length : 0}</Badge> },
    { key: 'passingScore', label: 'Pass', render: v => <span className="text-sm">{v ?? 70}%</span> },
    { key: 'actions', label: '', width: '90px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Quizzes</h1>
          <p className="mt-0.5 text-sm text-dark-600">{quizzes.length} quizzes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={unitId}
            onChange={e => setUnitId(e.target.value)}
            className="min-w-56 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">Select Unit</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={generateUnitQuiz} disabled={!unitId}><Bot size={16} /> Generate Unit Quiz</Button>
          <Button onClick={() => openForm()}><Plus size={16} /> Create Quiz</Button>
        </div>
      </div>

      <Table columns={columns} data={quizzes} loading={loading} emptyMessage="No quizzes found." />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? 'Edit Quiz' : 'Create Quiz'} size="xl">
        <form onSubmit={submit} className="space-y-4">
          {!target && (
            <div>
              <label className="field-label mb-1.5 block">Unit</label>
              <select
                value={form.unitId}
                onChange={set('unitId')}
                className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                required
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
                ))}
              </select>
            </div>
          )}
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Input label="Passing Score" type="number" min="1" max="100" value={form.passingScore} onChange={set('passingScore')} required />
          <div className="space-y-4">
            {form.questions.map((question, index) => (
              <div key={index} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <Input label={`Question ${index + 1}`} value={question.questionText} onChange={e => setQuestion(index, 'questionText', e.target.value)} required />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {['A', 'B', 'C', 'D'].map(letter => (
                    <Input key={letter} label={`Option ${letter}`} value={question[`option${letter}`]} onChange={e => setQuestion(index, `option${letter}`, e.target.value)} required />
                  ))}
                </div>
                <div className="mt-3">
                  <label className="field-label mb-1.5 block">Correct Option</label>
                  <select value={question.correctOption} onChange={e => setQuestion(index, 'correctOption', e.target.value)} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={() => setForm(prev => ({ ...prev, questions: [...prev.questions, blankQuestion()] }))}>Add Question</Button>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{target ? 'Save Changes' : 'Create Quiz'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete Quiz" size="sm">
        <p className="mb-5 text-sm text-dark-700">Delete <strong>{target?.title}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
