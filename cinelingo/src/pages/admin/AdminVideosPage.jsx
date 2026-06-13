import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { unitService, videoService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

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
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [units, setUnits] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [target, setTarget] = useState(null)
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.type === 'file' ? e.target.files?.[0] : e.target.value }))

  const load = async () => {
    setLoading(true)
    try {
      const [videosRes, unitsRes] = await Promise.all([videoService.getAll(), unitService.getAll()])
      setVideos((Array.isArray(videosRes.data) ? videosRes.data : []).map(normalize))
      setUnits((Array.isArray(unitsRes.data) ? unitsRes.data : []).map(unit => ({ id: unit.id ?? unit.Id, title: unit.title ?? unit.Title })))
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not load videos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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
      const res = target ? await videoService.update(target.id, form) : await videoService.create(form)
      const saved = normalize(res.data)
      setVideos(prev => target ? prev.map(item => item.id === target.id ? saved : item) : [...prev, saved])
      toast.success(target ? 'Video updated.' : 'Video uploaded.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save video.'))
    }
  }

  const remove = async () => {
    try {
      await videoService.delete(target.id)
      setVideos(prev => prev.filter(item => item.id !== target.id))
      toast.success('Video deleted.')
      setModal(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete video.'))
    }
  }

  const togglePublish = async (video) => {
    try {
      await (video.isPublished ? videoService.unpublish(video.id) : videoService.publish(video.id))
      setVideos(prev => prev.map(item => item.id === video.id ? { ...item, isPublished: !video.isPublished } : item))
      toast.success(video.isPublished ? 'Video unpublished.' : 'Video published.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update video status.'))
    }
  }

  const columns = [
    { key: 'title', label: 'Title', render: v => <span className="font-semibold text-dark-900">{v || '-'}</span> },
    { key: 'unitId', label: 'Unit', render: v => {
      const unit = units.find(item => String(item.id) === String(v))
      return <span className="text-sm">{unit?.title || `#${v}`}</span>
    } },
    { key: 'durationSeconds', label: 'Duration', render: v => <span className="text-sm">{v ? `${Math.round(v / 60)} min` : '-'}</span> },
    { key: 'isPublished', label: 'Status', render: v => <Badge variant={v ? 'success' : 'default'}>{v ? 'Published' : 'Draft'}</Badge> },
    { key: 'actions', label: '', width: '140px', render: (_, row) => (
      <div className="flex gap-1.5">
        <button onClick={() => togglePublish(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-brand-50 hover:text-brand-700">{row.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}</button>
        <button onClick={() => openForm(row)} className="rounded-lg p-1.5 text-dark-500 hover:bg-cream-100"><Edit2 size={14} /></button>
        <button onClick={() => { setTarget(row); setModal('delete') }} className="rounded-lg p-1.5 text-dark-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Videos</h1>
          <p className="mt-0.5 text-sm text-dark-600">{videos.length} lesson videos</p>
        </div>
        <Button onClick={() => openForm()}><Plus size={16} /> Add Video</Button>
      </div>

      <Table columns={columns} data={videos} loading={loading} emptyMessage="No videos found." onRowClick={openDetail} />

      <Modal open={modal === 'form'} onClose={() => setModal(null)} title={target ? 'Edit Video' : 'Add Video'}>
        <form onSubmit={submit} className="space-y-4">
          {!target && (
            <div>
              <label className="field-label mb-1.5 block">Unit</label>
              <select value={form.unitId} onChange={set('unitId')} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" required>
                <option value="">Select a unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.title || `Unit #${unit.id}`}</option>
                ))}
              </select>
            </div>
          )}
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Input label="Video File" type="file" accept="video/*" onChange={set('videoFile')} required={!target} />
          <Input label="Subtitle File" type="file" accept=".srt,.vtt,.txt" onChange={set('subtitleFile')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
            <Button type="submit" fullWidth>{target ? 'Save Changes' : 'Upload Video'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete Video" size="sm">
        <p className="mb-5 text-sm text-dark-700">Delete <strong>{target?.title}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
