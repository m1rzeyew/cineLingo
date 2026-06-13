import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { unitService } from '../../services'
import { getApiErrorMessage, levelLabel } from '../../utils/helpers'

const EMPTY = { title: '', description: '', englishLevel: 0, imageFile: null }

const normalize = (unit) => ({
  ...unit,
  id: unit.id ?? unit.Id,
  title: unit.title ?? unit.Title,
  description: unit.description ?? unit.Description,
  englishLevel: unit.englishLevel ?? unit.EnglishLevel,
  status: unit.status ?? unit.Status,
})

export default function AdminUnitsPage() {
  const navigate = useNavigate()
  const [units, setUnits] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(true)

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.type === 'file' ? e.target.files?.[0] : e.target.value }))

  const load = async () => {
    setLoading(true)
    try {
      const res = await unitService.getAll()
      setUnits((Array.isArray(res.data) ? res.data : []).map(normalize))
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not load units.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openForm = (unit = null) => {
    setTarget(unit)
    setForm(unit ? {
      title: unit.title || '',
      description: unit.description || '',
      englishLevel: unit.englishLevel ?? 0,
      imageFile: null,
    } : EMPTY)
    setModal('form')
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = target ? await unitService.update(target.id, form) : await unitService.create(form)
      const saved = normalize(res.data)
      setUnits(prev => target ? prev.map(item => item.id === target.id ? saved : item) : [...prev, saved])
      toast.success(target ? 'Unit updated.' : 'Unit created.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save unit.'))
    }
  }

  const remove = async () => {
    try {
      await unitService.delete(target.id)
      setUnits(prev => prev.filter(item => item.id !== target.id))
      toast.success('Unit deleted.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete unit.'))
    }
  }

  const togglePublish = async (unit) => {
    const published = unit.status === 'Published'
    try {
      await (published ? unitService.unpublish(unit.id) : unitService.publish(unit.id))
      setUnits(prev => prev.map(item => item.id === unit.id ? { ...item, status: published ? 'Draft' : 'Published' } : item))
      toast.success(published ? 'Unit unpublished.' : 'Unit published.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update unit status.'))
    }
  }

  const filtered = level === '' ? units : units.filter(unit => String(unit.englishLevel) === level)
  const openDetail = (unit) => {
    if (unit?.id) navigate(`/admin/units/${unit.id}`)
  }
  const columns = [
    { key: 'title', label: 'Title', render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'englishLevel', label: 'Level', render: v => <Badge variant="brand">{levelLabel(v)}</Badge> },
    { key: 'status', label: 'Status', render: v => <Badge variant={v === 'Published' ? 'success' : 'default'}>{v || 'Draft'}</Badge> },
    { key: 'actions', label: '', width: '140px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => togglePublish(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-brand-50 hover:text-brand-700">{row.status === 'Published' ? <EyeOff size={14} /> : <Eye size={14} />}</button>
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Units</h1>
          <p className="mt-0.5 text-sm text-dark-600">{filtered.length} learning units</p>
        </div>
        <div className="flex gap-2">
          <select value={level} onChange={e => setLevel(e.target.value)} className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">All levels</option>
            <option value="0">Beginner</option>
            <option value="1">Intermediate</option>
            <option value="2">Advanced</option>
          </select>
          <Button onClick={() => openForm()}><Plus size={16} /> Create Unit</Button>
        </div>
      </div>

      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No units found." onRowClick={openDetail} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? 'Edit Unit' : 'Create Unit'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <div>
            <label className="field-label mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" required />
          </div>
          <div>
            <label className="field-label mb-1.5 block">English Level</label>
            <select value={form.englishLevel} onChange={set('englishLevel')} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
              <option value="0">Beginner</option>
              <option value="1">Intermediate</option>
              <option value="2">Advanced</option>
            </select>
          </div>
          <Input label="Image" type="file" accept="image/*" onChange={set('imageFile')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{target ? 'Save Changes' : 'Create Unit'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete Unit" size="sm">
        <p className="mb-5 text-sm text-dark-700">Delete <strong>{target?.title}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
