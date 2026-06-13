import { useEffect, useState } from 'react'
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { unitService, wordService } from '../../services'
import { showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

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
  const { t } = useLanguage()
  const [unitId, setUnitId] = useState('')
  const [units, setUnits] = useState([])
  const [words, setWords] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [detailWord, setDetailWord] = useState(null)
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
      showApiErrorOnce(err, t('admin.words.loadError', 'Could not load words.'))
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
        setUnits((Array.isArray(res.data) ? res.data : []).map(unit => ({
          id: unit.id ?? unit.Id,
          title: unit.title ?? unit.Title,
        })))
      } catch {
        if (active) setUnits([])
      }
    }
    loadUnits()
    return () => { active = false }
  }, [])

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
      target ? await wordService.update(target.id, form) : await wordService.create(form)
      await load()
      toast.success(target ? t('admin.words.updated', 'Word updated.') : t('admin.words.created', 'Word created.'))
      setModal(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.words.saveError', 'Could not save word.'))
    }
  }

  const remove = async () => {
    try {
      await wordService.delete(target.id, target.unitId || unitId)
      await load()
      toast.success(t('admin.words.deleted', 'Word deleted.'))
      setModal(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.words.deleteError', 'Could not delete word.'))
    }
  }

  const openDetail = async (word) => {
    const nextUnitId = word?.unitId || unitId
    if (!word?.id || !nextUnitId) {
      showApiErrorOnce(new Error(t('admin.words.missingUnit', 'Select a unit before viewing this word.')))
      return
    }
    try {
      const res = await wordService.getById(word.id, { unitId: nextUnitId })
      setDetailWord({ ...normalize(res.data), unitId: nextUnitId })
      setModal('detail')
    } catch (err) {
      showApiErrorOnce(err, t('admin.words.detailLoadError', 'Could not load word detail.'))
    }
  }

  const columns = [
    { key: 'term', label: t('term', 'Term'), render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'definition', label: t('definition', 'Definition'), render: v => <span className="text-sm">{v || '-'}</span> },
    { key: 'pronunciation', label: t('pronunciation', 'Pronunciation'), render: v => <span className="font-mono text-xs text-brand-600">{v || '-'}</span> },
    { key: 'actions', label: '', width: '90px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => openDetail(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-brand-50 hover:text-brand-700" aria-label={t('view', 'View')}><Eye size={14} /></button>
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">{t('words', 'Words')}</h1>
          <p className="mt-0.5 text-sm text-dark-600">{t('admin.words.subtitle', 'Manage vocabulary by unit')}</p>
        </div>
        <div className="flex gap-2">
          <select value={unitId} onChange={e => setUnitId(e.target.value)} className="min-w-56 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">{t('selectUnit', 'Select Unit')}</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
            ))}
          </select>
          <Button onClick={() => openForm()}><Plus size={16} /> {t('addWord', 'Add Word')}</Button>
        </div>
      </div>

      <Table columns={columns} data={words} loading={loading} emptyMessage={unitId ? t('noWordsFoundForUnit', 'No words found for this unit.') : t('selectUnitToLoadWords', 'Select a unit to load words.')} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? t('editWord', 'Edit Word') : t('addWord', 'Add Word')}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label mb-1.5 block">{t('unit', 'Unit')}</label>
            <select value={form.unitId} onChange={set('unitId')} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" required>
              <option value="">{t('selectUnit', 'Select Unit')}</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
              ))}
            </select>
          </div>
          <Input label={t('term', 'Term')} value={form.term} onChange={set('term')} required />
          <Input label={t('definition', 'Definition')} value={form.definition} onChange={set('definition')} required />
          <Input label={t('pronunciation', 'Pronunciation')} value={form.pronunciation} onChange={set('pronunciation')} />
          <div>
            <label className="field-label mb-1.5 block">{t('exampleSentence', 'Example Sentence')}</label>
            <textarea value={form.exampleSentence} onChange={set('exampleSentence')} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
            <Button type="submit" fullWidth>{target ? t('saveChanges', 'Save Changes') : t('createWord', 'Create Word')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title={t('deleteWord', 'Delete Word')} size="sm">
        <p className="mb-5 text-sm text-dark-700">{t('deleteConfirmPrefix', 'Delete')} <strong>{target?.term}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
          <Button variant="danger" fullWidth onClick={remove}>{t('delete', 'Delete')}</Button>
        </div>
      </Modal>

      <Modal open={modal === 'detail'} onClose={() => setModal(null)} title={t('wordDetail', 'Word Detail')}>
        {detailWord && (
          <div className="space-y-3">
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('term', 'Term')}</p>
              <p className="mt-1 font-semibold text-dark-900">{detailWord.term || '-'}</p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('definition', 'Definition')}</p>
              <p className="mt-1 text-sm text-dark-700">{detailWord.definition || '-'}</p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('pronunciation', 'Pronunciation')}</p>
              <p className="mt-1 font-mono text-sm text-brand-700">{detailWord.pronunciation || '-'}</p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('exampleSentence', 'Example Sentence')}</p>
              <p className="mt-1 text-sm text-dark-700">{detailWord.exampleSentence || '-'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
