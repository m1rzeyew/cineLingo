import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { videoService, unitService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

export default function AdminVideoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [unitTitle, setUnitTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await videoService.getById(id)
        const next = { ...res.data, id: res.data.id ?? res.data.Id, unitId: res.data.unitId ?? res.data.UnitId, title: res.data.title ?? res.data.Title }
        if (!active) return
        setVideo(next)
        if (next.unitId) {
          const unitRes = await unitService.getById(next.unitId)
          if (active) setUnitTitle(unitRes.data.title ?? unitRes.data.Title ?? `#${next.unitId}`)
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Could not load video detail.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) return <p className="text-sm text-dark-500">Loading video detail...</p>
  if (!video) return <p className="text-sm text-dark-500">Video not found.</p>

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{video.title}</h1>
          <p className="text-sm text-dark-600">GET api/Video/{id}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/videos')}>Back</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Unit</p>
          <p className="mt-1 font-semibold text-dark-900">{unitTitle || `#${video.unitId}`}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Duration</p>
          <p className="mt-1 font-semibold text-dark-900">{video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} min` : '-'}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Status</p>
          <Badge variant={video.isPublished ? 'success' : 'default'}>{video.isPublished ? 'Published' : 'Draft'}</Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-cream-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Raw ID</p>
        <p className="mt-1 break-all text-sm font-semibold text-dark-900">{video.id}</p>
      </div>
    </div>
  )
}
