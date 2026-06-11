import { useEffect, useState } from 'react'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { wordService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

const EMPTY = { unitId: '', term: '', definition: '', exampleSentence: '', pronunciation: '' }

const normalize = (word) => ({
  ...word,
  id: word.id ?? word.Id ?? word.wordId,
  term: word.term ?? word.Term,
  definition: word.definition ?? word.Definition,
  exampleSentence: word.exampleSentence ?? word.ExampleSentence,
  pronunciation: word.pronunciation ?? word.Pronunciation,
})

export default function AdminWordsPage() {
  const [unitId, setUnitId] = useState('')
  const [words, setWords] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const load = async () => {
    if (!unitId) return
    setLoading(true)
    try {
      const res = await wordService.getAll({ unitId })
      setWords((Array.isArray(res.data) ? res.data : []).map(item => ({ ...normalize(item), unitId })))
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not load words.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [unitId])

  const openForm = (word = null) => {
    setTarget(word)
    setForm(word ? {
      unitId: word.unitId || unitId || '',
      term: word.term || '',
      definition: word.definition || '',
      exampleSentence: word.exampleSentence || '',
      pronunciation: word.pronunciation || '',
    } : { ...EMPTY, unitId })
    setModal('form')
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = target ? await wordService.update(target.id, form) : await wordService.create(form)
      const saved = { ...normalize(res.data), unitId: form.unitId }
      setWords(prev => target ? prev.map(item => item.id === target.id ? saved : item) : [...prev, saved])
      toast.success(target ? 'Word updated.' : 'Word created.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save word.'))
    }
  }

  const remove = async () => {
    try {
      await wordService.delete(target.id, target.unitId || unitId)
      setWords(prev => prev.filter(item => item.id !== target.id))
      toast.success('Word deleted.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete word.'))
    }
  }

  const columns = [
    { key: 'term', label: 'Term', render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'definition', label: 'Definition', render: v => <span className="text-sm">{v || '-'}</span> },
    { key: 'pronunciation', label: 'Pronunciation', render: v => <span className="font-mono text-xs text-brand-600">{v || '-'}</span> },
    { key: 'actions', label: '', width: '90px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Words</h1>
          <p className="mt-0.5 text-sm text-dark-600">Manage vocabulary by unit</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Unit ID" type="number" min="1" prefix={<Search size={14} />} value={unitId} onChange={e => setUnitId(e.target.value)} />
          <Button onClick={() => openForm()} disabled={!unitId}><Plus size={16} /> Add Word</Button>
        </div>
      </div>

      <Table columns={columns} data={words} loading={loading} emptyMessage={unitId ? 'No words found for this unit.' : 'Enter a unit ID to load words.'} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? 'Edit Word' : 'Add Word'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Unit ID" type="number" min="1" value={form.unitId} onChange={set('unitId')} required />
          <Input label="Term" value={form.term} onChange={set('term')} required />
          <Input label="Definition" value={form.definition} onChange={set('definition')} required />
          <Input label="Pronunciation" value={form.pronunciation} onChange={set('pronunciation')} />
          <div>
            <label className="field-label mb-1.5 block">Example Sentence</label>
            <textarea value={form.exampleSentence} onChange={set('exampleSentence')} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{target ? 'Save Changes' : 'Create Word'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete Word" size="sm">
        <p className="mb-5 text-sm text-dark-700">Delete <strong>{target?.term}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
