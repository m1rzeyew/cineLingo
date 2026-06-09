import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Table  from '../../components/ui/Table'
import Modal  from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input  from '../../components/ui/Input'
import Badge  from '../../components/ui/Badge'
import toast  from 'react-hot-toast'

const INIT = [
  { id:'1', title:'Conversation Quiz',   unitTitle:'The Art of Conversation',       questionCount:5,  passingScore:70, createdAt:'2024-02-10' },
  { id:'2', title:'Urban Vocabulary',    unitTitle:'City Life & Urban Stories',      questionCount:10, passingScore:70, createdAt:'2024-02-15' },
  { id:'3', title:'Science Terms',       unitTitle:'Science & Discovery',            questionCount:8,  passingScore:75, createdAt:'2024-03-01' },
  { id:'4', title:'Food Vocabulary',     unitTitle:'Food Culture Around the World',  questionCount:6,  passingScore:70, createdAt:'2024-03-10' },
]
const EMPTY = { title:'', unitTitle:'', questionCount:0, passingScore:70 }

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState(INIT)
  const [modal, setModal]     = useState(null)
  const [target, setTarget]   = useState(null)
  const [form, setForm]       = useState(EMPTY)

  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const open = (q) => { setForm(q ? {...q} : EMPTY); setTarget(q??null); setModal('form') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!target) {
      setQuizzes(qs => [...qs, {
        ...form,
        id: Date.now().toString(),
        questionCount: Number(form.questionCount) || 0,
        createdAt: new Date().toISOString().slice(0,10)
      }])
      toast.success('Quiz created!')
    } else {
      setQuizzes(qs => qs.map(q => q.id===target.id ? {...q, ...form, questionCount: Number(form.questionCount) || 0} : q))
      toast.success('Quiz updated!')
    }
    setModal(null)
  }

  const handleDelete = () => {
    setQuizzes(qs => qs.filter(q => q.id !== target.id))
    toast.success('Quiz deleted')
    setModal(null)
  }

  const columns = [
    { key:'title',         label:'Quiz Title',  render: v => <span className="font-medium text-dark-900">{v}</span> },
    { key:'unitTitle',     label:'Unit',        render: v => <span className="text-sm text-dark-600">{v??'—'}</span> },
    { key:'questionCount', label:'Questions',   width:'100px', render: v => <Badge>{v??0}</Badge> },
    { key:'passingScore',  label:'Pass Score',  width:'100px', render: v => <span className="text-sm">{v??70}%</span> },
    { key:'createdAt',     label:'Created',     width:'110px', render: v => <span className="text-xs text-dark-500">{v}</span> },
    { key:'actions', label:'', width:'80px',
      render:(_,row) => (
        <div className="flex gap-1.5">
          <button onClick={() => open(row)} className="p-1.5 rounded-lg hover:bg-cream-100 text-dark-500 transition-colors"><Edit2 size={14}/></button>
          <button onClick={() => { setTarget(row); setModal('delete') }} className="p-1.5 rounded-lg hover:bg-red-50 text-dark-500 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
        </div>
      )},
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">Quizzes</h1>
          <p className="text-dark-600 text-sm mt-0.5">{quizzes.length} quizzes</p>
        </div>
        <Button onClick={() => open(null)}><Plus size={16}/> Create Quiz</Button>
      </div>

      <Table columns={columns} data={quizzes} />

      <Modal open={modal==='form'} onClose={() => setModal(null)} title={!target ? 'Create Quiz' : 'Edit Quiz'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Quiz Title"       value={form.title}         onChange={set('title')}         required />
          <Input label="Unit Title"       value={form.unitTitle}     onChange={set('unitTitle')}     />
          <Input label="Questions"        type="number" min="0"      value={form.questionCount}      onChange={set('questionCount')} />
          <Input label="Passing Score (%)" type="number" min="0" max="100" value={form.passingScore} onChange={set('passingScore')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{!target ? 'Create' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='delete'} onClose={() => setModal(null)} title="Delete Quiz" size="sm">
        <p className="text-dark-700 mb-5 text-sm">Delete <strong>"{target?.title}"</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger"    fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}