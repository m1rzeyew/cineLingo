import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { unitService } from '../../services'
import { levelLabel, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const normalize = (item) => ({
  ...item,
  id: item.id ?? item.Id,
  title: item.title ?? item.Title,
})

export default function AdminUnitDetailPage() {
  const { t } = useLanguage()
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
        const unitRes = await unitService.getById(id)
        if (!active) return
        const nextUnit = unitRes.data || {}
        const unitVideo = nextUnit.videoClip ?? nextUnit.VideoClip
        const unitWords = nextUnit.words ?? nextUnit.Words
        setUnit({
          ...normalize(nextUnit),
          description: nextUnit.description ?? nextUnit.Description,
          englishLevel: nextUnit.englishLevel ?? nextUnit.EnglishLevel,
          status: nextUnit.status ?? nextUnit.Status,
        })
        setVideos(unitVideo ? [normalize(unitVideo)] : [])
        setWords((Array.isArray(unitWords) ? unitWords : []).map(normalize))
      } catch (err) {
        showApiErrorOnce(err, t('admin.units.detailLoadError', 'Could not load unit detail.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) return <p className="text-sm text-dark-500">{t('loadingUnitDetail', 'Loading unit detail...')}</p>
  if (!unit) return <p className="text-sm text-dark-500">{t('unitNotFound', 'Unit not found.')}</p>

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{unit.title}</h1>
          <p className="text-sm text-dark-600">{t('unitDetail', 'Unit detail')}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/units')}>{t('back', 'Back')}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('title', 'Title')}</p>
          <p className="mt-1 font-semibold text-dark-900">{unit.title}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('level', 'Level')}</p>
          <Badge variant="brand">{levelLabel(unit.englishLevel)}</Badge>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('description', 'Description')}</p>
          <p className="mt-1 text-sm text-dark-700">{unit.description || '-'}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-dark-900">{t('videos', 'Videos')}</h2>
        <div className="grid gap-3">
          {videos.length === 0 ? <p className="text-sm text-dark-500">{t('noVideosForUnit', 'No videos found for this unit.')}</p> : videos.map(video => (
            <div key={video.id} className="rounded-2xl border border-cream-200 bg-white p-4">
              <p className="font-semibold text-dark-900">{video.title}</p>
          <p className="text-sm text-dark-500">{video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} ${t('min', 'min')}` : '-'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-dark-900">{t('words', 'Words')}</h2>
        <div className="grid gap-3">
          {words.length === 0 ? <p className="text-sm text-dark-500">{t('noWordsForUnit', 'No words found for this unit.')}</p> : words.map(word => (
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
