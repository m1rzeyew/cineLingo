import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { unitService, videoService, wordService } from '../../services'
import { getApiErrorMessage, levelLabel } from '../../utils/helpers'

const normalize = (item) => ({
  ...item,
  id: item.id ?? item.Id,
  title: item.title ?? item.Title,
})

export default function AdminUnitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [unit, setUnit] = useState(null)
  const [videos, setVideos] = useState([])
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const [unitRes, videosRes, wordsRes] = await Promise.all([
          unitService.getById(id),
          videoService.getByUnit(id),
          wordService.getByUnit(id),
        ])
        if (!active) return
        setUnit(normalize(unitRes.data))
        setVideos((Array.isArray(videosRes.data) ? videosRes.data : []).map(normalize))
        setWords((Array.isArray(wordsRes.data) ? wordsRes.data : []).map(normalize))
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Could not load unit detail.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) return <p className="text-sm text-dark-500">Loading unit detail...</p>
  if (!unit) return <p className="text-sm text-dark-500">Unit not found.</p>

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{unit.title}</h1>
          <p className="text-sm text-dark-600">Unit detail</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/units')}>Back</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Title</p>
          <p className="mt-1 font-semibold text-dark-900">{unit.title}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Level</p>
          <Badge variant="brand">{levelLabel(unit.englishLevel)}</Badge>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Description</p>
          <p className="mt-1 text-sm text-dark-700">{unit.description || '-'}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-dark-900">Videos</h2>
        <div className="grid gap-3">
          {videos.length === 0 ? <p className="text-sm text-dark-500">No videos found for this unit.</p> : videos.map(video => (
            <div key={video.id} className="rounded-2xl border border-cream-200 bg-white p-4">
              <p className="font-semibold text-dark-900">{video.title}</p>
              <p className="text-sm text-dark-500">{video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} min` : '-'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-dark-900">Words</h2>
        <div className="grid gap-3">
          {words.length === 0 ? <p className="text-sm text-dark-500">No words found for this unit.</p> : words.map(word => (
            <div key={word.id} className="rounded-2xl border border-cream-200 bg-white p-4">
              <p className="font-semibold text-dark-900">{word.term || word.title || word.word || '-'}</p>
              <p className="text-sm text-dark-500">{word.definition || '-'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
