import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Table  from '../../components/ui/Table'
import Modal  from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input  from '../../components/ui/Input'
import Badge  from '../../components/ui/Badge'
import toast  from 'react-hot-toast'

const INIT = [
  { id:'1', title:'The Art of Conversation',       levelName:'Intermediate',       wordCount:6,  duration:24 },
  { id:'2', title:'City Life & Urban Stories',     levelName:'Intermediate',       wordCount:12, duration:31 },
  { id:'3', title:'Science & Discovery',           levelName:'Upper-Intermediate', wordCount:18, duration:28 },
  { id:'4', title:'Food Culture Around the World', levelName:'Intermediate',       wordCount:9,  duration:22 },
  { id:'5', title:'Music & Emotions',              levelName:'Beginner',           wordCount:7,  duration:18 },
  { id:'6', title:'Travel & Adventure',            levelName:'Upper-Intermediate', wordCount:15, duration:35 },
]
const EMPTY = { title:'', levelName:'', wordCount:'', duration:'', description:'' }

export default function AdminUnitsPage() {
  const [units, setUnits]   = useState(INIT)
  const [modal, setModal]   = useState(null)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const open = (u) => { setForm(u ? {...u} : EMPTY); setTarget(u??null); setModal('form') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!target) {
      setUnits(us => [...us, { ...form, id: Date.now().toString() }])
      toast.success('Unit created!')
    } else {
      setUnits(us => us.map(u => u.id===target.id ? {...u,...form} : u))
      toast.success('Unit updated!')
    }
    setModal(null)
  }

  const handleDelete = () => {
    setUnits(us => us.filter(u => u.id !== target.id))
    toast.success('Unit deleted')
    setModal(null)
  }

  const columns = [
    { key:'title',     label:'Title',    render: v => <span className="font-medium text-dark-900">{v}</span> },
    { key:'levelName', label:'Level',    render: v => v ? <Badge variant="brand">{v}</Badge> : '—' },
    { key:'wordCount', label:'Words',    render: v => <span className="text-sm">{v ?? '—'}</span> },
    { key:'duration',  label:'Duration', render: v => <span className="text-sm">{v ? `${v} min` : '—'}</span> },
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
          <h1 className="text-2xl font-bold font-display text-dark-900">Units</h1>
          <p className="text-dark-600 text-sm mt-0.5">{units.length} learning units</p>
        </div>
        <Button onClick={() => open(null)}><Plus size={16}/> Create Unit</Button>
      </div>

      <Table columns={columns} data={units} />

      <Modal open={modal==='form'} onClose={() => setModal(null)} title={!target ? 'Create Unit' : 'Edit Unit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Input label="Level Name" value={form.levelName} onChange={set('levelName')} placeholder="e.g. Intermediate" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Duration (min)" type="number" value={form.duration}  onChange={set('duration')}  />
            <Input label="Word Count"     type="number" value={form.wordCount} onChange={set('wordCount')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{!target ? 'Create Unit' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='delete'} onClose={() => setModal(null)} title="Delete Unit" size="sm">
        <p className="text-dark-700 mb-5 text-sm">Delete <strong>"{target?.title}"</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
