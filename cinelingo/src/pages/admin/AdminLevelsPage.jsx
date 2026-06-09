import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Table  from '../../components/ui/Table'
import Modal  from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input  from '../../components/ui/Input'
import Badge  from '../../components/ui/Badge'
import toast  from 'react-hot-toast'

const INIT = [
  { id:'1', order:1, name:'Beginner',           description:'For complete beginners',         isFree:true,  unitCount:4 },
  { id:'2', order:2, name:'Elementary',          description:'Basic everyday vocabulary',       isFree:false, unitCount:5 },
  { id:'3', order:3, name:'Pre-Intermediate',    description:'Building sentence structures',    isFree:false, unitCount:4 },
  { id:'4', order:4, name:'Intermediate',        description:'Conversational English',          isFree:false, unitCount:6 },
  { id:'5', order:5, name:'Upper-Intermediate',  description:'Complex grammar & vocabulary',    isFree:false, unitCount:3 },
  { id:'6', order:6, name:'Advanced',            description:'Near-native fluency',             isFree:false, unitCount:2 },
]
const EMPTY = { name:'', description:'', order:'', isFree:false }

export default function AdminLevelsPage() {
  const [levels, setLevels] = useState(INIT)
  const [modal, setModal]   = useState(null)
  const [target, setTarget] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }))
  const open = (l) => { setForm(l ? {...l} : EMPTY); setTarget(l??null); setModal('form') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!target) { setLevels(ls => [...ls, { ...form, id:Date.now().toString(), unitCount:0 }]); toast.success('Level created!') }
    else          { setLevels(ls => ls.map(l => l.id===target.id ? {...l,...form} : l));          toast.success('Level updated!') }
    setModal(null)
  }

  const handleDelete = () => {
    setLevels(ls => ls.filter(l => l.id !== target.id))
    toast.success('Level deleted')
    setModal(null)
  }

  const columns = [
    { key:'order',       label:'#',           width:'48px', render: v => <span className="font-mono text-sm">{v}</span> },
    { key:'name',        label:'Level Name',  render: v => <span className="font-medium text-dark-900">{v}</span> },
    { key:'description', label:'Description', render: v => <span className="text-sm text-dark-600">{v}</span> },
    { key:'isFree',      label:'Access',      width:'100px', render: v => <Badge variant={v?'success':'brand'}>{v?'Free':'Premium'}</Badge> },
    { key:'unitCount',   label:'Units',       width:'70px',  render: v => <span className="text-sm">{v??0}</span> },
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
          <h1 className="text-2xl font-bold font-display text-dark-900">Levels</h1>
          <p className="text-dark-600 text-sm mt-0.5">{levels.length} levels configured</p>
        </div>
        <Button onClick={() => open(null)}><Plus size={16}/> Create Level</Button>
      </div>
      <Table columns={columns} data={levels} />
      <Modal open={modal==='form'} onClose={() => setModal(null)} title={!target?'Create Level':'Edit Level'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Level Name" value={form.name} onChange={set('name')} required />
          <Input label="Order" type="number" value={form.order} onChange={set('order')} required />
          <div>
            <label className="text-sm font-medium text-dark-800 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={2}
              className="w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!form.isFree} onChange={set('isFree')} className="w-4 h-4 accent-brand-500" />
            <span className="text-sm text-dark-800">Free level (no subscription required)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{!target?'Create':'Save'}</Button>
          </div>
        </form>
      </Modal>
      <Modal open={modal==='delete'} onClose={() => setModal(null)} title="Delete Level" size="sm">
        <p className="text-dark-700 mb-5 text-sm">Delete level <strong>"{target?.name}"</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
