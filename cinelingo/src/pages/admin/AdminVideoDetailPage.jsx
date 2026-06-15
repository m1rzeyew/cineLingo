import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { videoService, unitService } from '../../services'
import { resolveBackendMediaUrl, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const normalizeSubtitle = (subtitle) => {
  const startTime = Number(subtitle.startTime ?? subtitle.StartTime)
  const endTime = Number(subtitle.endTime ?? subtitle.EndTime)
  const text = String(subtitle.text ?? subtitle.Text ?? '').trim()
  return { startTime, endTime, text }
}

const getSubtitleUrl = (video) => resolveBackendMediaUrl(
  video?.subtitleUrl ?? video?.SubtitleUrl ??
  video?.srtUrl ?? video?.SrtUrl ??
  video?.transcriptUrl ?? video?.TranscriptUrl ??
  video?.captionsUrl ?? video?.CaptionsUrl
)

export default function AdminVideoDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [unitTitle, setUnitTitle] = useState('')
  const [videoTime, setVideoTime] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await videoService.getById(id)
        const next = {
          ...res.data,
          id: res.data.id ?? res.data.Id,
          unitId: res.data.unitId ?? res.data.UnitId,
          title: res.data.title ?? res.data.Title,
          videoUrl: resolveBackendMediaUrl(res.data.videoUrl ?? res.data.VideoUrl),
          thumbnailUrl: resolveBackendMediaUrl(res.data.thumbnailUrl ?? res.data.ThumbnailUrl),
          durationSeconds: res.data.durationSeconds ?? res.data.DurationSeconds,
          isPublished: res.data.isPublished ?? res.data.IsPublished,
          subtitles: (Array.isArray(res.data.subtitles ?? res.data.Subtitles) ? (res.data.subtitles ?? res.data.Subtitles) : [])
            .map(normalizeSubtitle)
            .filter(item => Number.isFinite(item.startTime) && Number.isFinite(item.endTime) && item.text)
            .sort((a, b) => a.startTime - b.startTime),
        }
        if (!active) return
        setVideo(next)
        if (next.unitId) {
          const unitRes = await unitService.getById(next.unitId)
          if (active) setUnitTitle(unitRes.data.title ?? unitRes.data.Title ?? `#${next.unitId}`)
        }
      } catch (err) {
        showApiErrorOnce(err, t('admin.videos.detailLoadError', 'Could not load video detail.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  if (loading) return <p className="text-sm text-dark-500">{t('loadingVideoDetail', 'Loading video detail...')}</p>
  if (!video) return <p className="text-sm text-dark-500">{t('videoNotFound', 'Video not found.')}</p>

  const subtitleUrl = getSubtitleUrl(video)
  const activeSubtitle = video.subtitles.find(item => videoTime >= item.startTime && videoTime <= item.endTime)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{video.title}</h1>
          <p className="text-sm text-dark-600">{t('videoDetail', 'Video detail')}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/videos')}>{t('back', 'Back')}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('unit', 'Unit')}</p>
          <p className="mt-1 font-semibold text-dark-900">{unitTitle || `#${video.unitId}`}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('duration', 'Duration')}</p>
          <p className="mt-1 font-semibold text-dark-900">{video.durationSeconds ? `${Math.round(video.durationSeconds / 60)} ${t('min', 'min')}` : '-'}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('status', 'Status')}</p>
          <Badge variant={video.isPublished ? 'success' : 'default'}>{video.isPublished ? t('published', 'Published') : t('draft', 'Draft')}</Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-cream-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('rawId', 'Raw ID')}</p>
        <p className="mt-1 break-all text-sm font-semibold text-dark-900">{video.id}</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-card">
        {video.videoUrl ? (
          <>
            <div className="relative bg-slate-950">
              <video
                controls
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                className="aspect-video w-full bg-slate-950"
                onLoadedMetadata={() => setVideoTime(0)}
                onTimeUpdate={(event) => setVideoTime(event.currentTarget.currentTime)}
              >
                {subtitleUrl && <track kind="subtitles" src={subtitleUrl} srcLang="en" label="English" default />}
                {t('videoPlaybackUnsupported', 'Your browser does not support video playback.')}
              </video>
              {activeSubtitle && (
                <div className="pointer-events-none absolute inset-x-4 bottom-14 flex justify-center sm:bottom-16">
                  <p className="max-w-3xl rounded bg-slate-950/82 px-4 py-2 text-center text-base font-semibold leading-7 text-white shadow-lg sm:text-lg">
                    {activeSubtitle.text}
                  </p>
                </div>
              )}
            </div>
            {!subtitleUrl && video.subtitles.length === 0 && (
              <div className="border-t border-white/10 px-5 py-3 text-sm font-semibold text-white/60">
                {t('noSubtitlesAvailable', 'No subtitles available')}
              </div>
            )}
          </>
        ) : (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-white/60">
            <p className="text-sm font-semibold">{t('videoNotAvailable', 'Video is not available')}</p>
          </div>
        )}
      </section>
    </div>
  )
}
