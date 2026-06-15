import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { unitService, videoService } from '../../services'
import { showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const EMPTY = { unitId: '', title: '', videoFile: null, subtitleFile: null }

const normalize = (video) => ({
  ...video,
  id: video.id ?? video.Id,
  unitId: video.unitId ?? video.UnitId,
  title: video.title ?? video.Title,
  isPublished: video.isPublished ?? video.IsPublished,
  durationSeconds: video.durationSeconds ?? video.DurationSeconds,
})

export default function AdminVideosPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [units, setUnits] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unitFilter, setUnitFilter] = useState('')

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.type === 'file' ? e.target.files?.[0] : e.target.value }))

  const load = async () => {
    setLoading(true)
    try {
      const params = unitFilter ? { unitId: unitFilter } : undefined
      const [videosRes, unitsRes] = await Promise.all([videoService.getAll(params), unitService.getAll()])
      setVideos((Array.isArray(videosRes.data) ? videosRes.data : []).map(normalize))
      setUnits((Array.isArray(unitsRes.data) ? unitsRes.data : []).map(unit => ({ id: unit.id ?? unit.Id, title: unit.title ?? unit.Title })))
    } catch (err) {
      showApiErrorOnce(err, t('admin.videos.loadError', 'Could not load videos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [unitFilter])

  const openForm = (video = null) => {
    setTarget(video)
    setForm(video ? { unitId: video.unitId || '', title: video.title || '', videoFile: null, subtitleFile: null } : EMPTY)
    setModal('form')
  }

  const openDetail = (video) => {
    if (video?.id) navigate(`/admin/videos/${video.id}`)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      target ? await videoService.update(target.id, form) : await videoService.create(form)
      await load()
      toast.success(target ? t('admin.videos.updated', 'Video updated.') : t('admin.videos.uploaded', 'Video uploaded.'))
      setModal(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.videos.saveError', 'Could not save video.'))
    }
  }

  const remove = async () => {
    try {
      await videoService.delete(target.id)
      await load()
      toast.success(t('admin.videos.deleted', 'Video deleted.'))
      setModal(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.videos.deleteError', 'Could not delete video.'))
    }
  }

  const togglePublish = async (video) => {
    try {
      await (video.isPublished ? videoService.unpublish(video.id) : videoService.publish(video.id))
      await load()
      toast.success(video.isPublished ? t('admin.videos.unpublished', 'Video unpublished.') : t('admin.videos.published', 'Video published.'))
    } catch (err) {
      showApiErrorOnce(err, t('admin.videos.statusError', 'Could not update video status.'))
    }
  }

  const columns = [
    { key: 'title', label: t('title', 'Title'), render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'unitId', label: t('unit', 'Unit'), render: v => {
      const unit = units.find(item => String(item.id) === String(v))
      return <span className="text-sm">{unit?.title || `#${v}`}</span>
    } },
    { key: 'durationSeconds', label: t('duration', 'Duration'), render: v => <span className="text-sm">{v ? `${Math.round(v / 60)} ${t('min', 'min')}` : '-'}</span> },
    { key: 'isPublished', label: t('status', 'Status'), render: v => <Badge variant={v ? 'success' : 'default'}>{v ? t('published', 'Published') : t('draft', 'Draft')}</Badge> },
    { key: 'actions', label: '', width: '140px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => openDetail(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-brand-50 hover:text-brand-700" aria-label={t('view', 'View')}><Eye size={14} /></button>
        <button onClick={() => togglePublish(row)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-dark-500 hover:bg-brand-50 hover:text-brand-700" aria-label={row.isPublished ? t('unpublish', 'Unpublish') : t('publish', 'Publish')}>{row.isPublished ? <EyeOff size={14} /> : <CheckCircle2 size={14} />}{row.isPublished ? t('unpublish', 'Unpublish') : t('publish', 'Publish')}</button>
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">{t('videos', 'Videos')}</h1>
          <p className="mt-0.5 text-sm text-dark-600">{videos.length} {t('lessonVideos', 'lesson videos')}</p>
        </div>
        <div className="flex gap-2">
          <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)} className="min-w-56 rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm text-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">{t('allUnits', 'All units')}</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
            ))}
          </select>
          <Button onClick={() => openForm()}><Plus size={16} /> {t('addVideo', 'Add Video')}</Button>
        </div>
      </div>

      <Table columns={columns} data={videos} loading={loading} emptyMessage={t('noVideosFound', 'No videos found.')} onRowClick={openDetail} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? t('editVideo', 'Edit Video') : t('addVideo', 'Add Video')}>
        <form onSubmit={submit} className="space-y-4">
          {!target && (
            <div>
              <label className="field-label mb-1.5 block">{t('unit', 'Unit')}</label>
              <select value={form.unitId} onChange={set('unitId')} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" required>
                <option value="">{t('selectUnit', 'Select a unit')}</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
                ))}
              </select>
            </div>
          )}
          <Input label={t('title', 'Title')} value={form.title} onChange={set('title')} required />
          <Input label={t('videoFile', 'Video File')} type="file" accept="video/*" onChange={set('videoFile')} required={!target} />
          <Input label={t('subtitleFile', 'Subtitle File')} type="file" accept=".srt,.vtt" onChange={set('subtitleFile')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
            <Button type="submit" fullWidth>{target ? t('saveChanges', 'Save Changes') : t('uploadVideo', 'Upload Video')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title={t('deleteVideo', 'Delete Video')} size="sm">
        <p className="mb-5 text-sm text-dark-700">{t('deleteConfirmPrefix', 'Delete')} <strong>{target?.title}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel', 'Cancel')}</Button>
          <Button variant="danger" fullWidth onClick={remove}>{t('delete', 'Delete')}</Button>
        </div>
      </Modal>
    </div>
  )
}
