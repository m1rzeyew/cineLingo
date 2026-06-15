import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { BookmarkPlus, BookOpen, ChevronLeft, Clock, Play, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/PageHeader'
import { getApiErrorMessage, levelLabel, resolveBackendMediaUrl } from '../../utils/helpers'
import { quizService, unitService, videoService, wordService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const secondsToMinutes = (seconds) => Math.max(1, Math.round((Number(seconds) || 0) / 60))
const getBackendVideoUrl = (video) => {
  const value = video?.videoUrl ?? video?.VideoUrl
  return resolveBackendMediaUrl(value)
}
const getVideoId = (video) => video?.id ?? video?.Id
const getThumbnailUrl = (video) => resolveBackendMediaUrl(video?.thumbnailUrl ?? video?.ThumbnailUrl)
const getSubtitleUrl = (video) =>
  resolveBackendMediaUrl(
    video?.subtitleUrl ?? video?.SubtitleUrl ??
    video?.srtUrl ?? video?.SrtUrl ??
    video?.transcriptUrl ?? video?.TranscriptUrl ??
    video?.captionsUrl ?? video?.CaptionsUrl
  )
const getVideoSubtitles = (video) => {
  const subtitles = video?.subtitles ?? video?.Subtitles
  if (!Array.isArray(subtitles)) return []

  return subtitles
    .map((subtitle) => {
      const startTime = Number(subtitle.startTime ?? subtitle.StartTime)
      const endTime = Number(subtitle.endTime ?? subtitle.EndTime)
      const text = String(subtitle.text ?? subtitle.Text ?? '').trim()
      return { startTime, endTime, text }
    })
    .filter((subtitle) => Number.isFinite(subtitle.startTime) && Number.isFinite(subtitle.endTime) && subtitle.text)
    .sort((a, b) => a.startTime - b.startTime)
}
const getActiveSubtitle = (subtitles, currentTime) =>
  subtitles.find((subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime)

export default function UnitDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  const ctx = useOutletContext()
  const setChatOpen = ctx?.setChatOpen ?? (() => {})
  const [videoOpen, setVideoOpen] = useState(false)
  const [video, setVideo] = useState(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [unit, setUnit] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setVideoOpen(false)
    setVideo(null)
    setVideoLoading(false)
    setVideoTime(0)

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [unitRes, quizRes] = await Promise.allSettled([
          unitService.getById(id),
          quizService.getByUnit(id),
        ])

        if (!active) return
        if (unitRes.status === 'rejected') throw unitRes.reason
        setUnit(unitRes.value.data)
        if (quizRes.status === 'fulfilled') setQuiz(quizRes.value.data)
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('unitDetail.loadError', 'Could not load this unit.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [id])

  const handleWatch = async () => {
    setVideoOpen(true)
    setChatOpen(true)
    setVideo(null)
    setVideoTime(0)
    setVideoLoading(true)
    try {
      await unitService.start(id)
      const res = await videoService.getByUnit(id)
      const nextVideo = res.data

      setVideo(nextVideo)
      const nextVideoUrl = getBackendVideoUrl(nextVideo)
      if (!nextVideoUrl) {
        return
      }

      const nextVideoId = getVideoId(nextVideo)
      if (nextVideoId) await videoService.markWatched(nextVideoId)
    } catch (err) {
      setVideo(null)
      if (err?.response?.status !== 404) {
        toast.error(getApiErrorMessage(err, t('unitDetail.videoLoadError', 'Could not load the video.')))
      }
    } finally {
      setVideoLoading(false)
    }
  }

  const handleSaveWord = async (wordId) => {
    try {
      await wordService.save(wordId)
      toast.success(t('wordSaved', 'Word saved.'))
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('unitDetail.saveWordError', 'Could not save word.')))
    }
  }

  const handleCompleteUnit = async () => {
    try {
      await unitService.complete(id)
      toast.success(t('unitCompleted', 'Unit completed.'))
      setUnit(prev => prev ? { ...prev, isCompleted: true, IsCompleted: true } : prev)
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('unitDetail.completeError', 'Could not complete this unit.')))
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-5 py-8 sm:px-6">
        <div className="skeleton h-9 w-36" />
        <div className="skeleton mt-6 aspect-[16/9] w-full" />
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
        <EmptyState icon={BookOpen} title={t('unitUnavailable', 'Unit unavailable')} description={error || t('unitNotFound', 'Unit not found.')} />
      </div>
    )
  }

  const levelName = unit.levelName || (typeof unit.level === 'number' ? levelLabel(unit.level) : unit.level) || levelLabel(unit.englishLevel)
  const words = (Array.isArray(unit.words ?? unit.Words) ? (unit.words ?? unit.Words) : []).map(word => ({
    ...word,
    id: word.id ?? word.Id,
    term: word.term ?? word.Term,
    definition: word.definition ?? word.Definition,
    pronunciation: word.pronunciation ?? word.Pronunciation,
    exampleSentence: word.exampleSentence ?? word.ExampleSentence,
  }))
  const duration = secondsToMinutes(unit.videoClip?.durationSeconds)
  const heroImage = resolveBackendMediaUrl(unit.imageUrl ?? unit.ImageUrl) || getThumbnailUrl(unit.videoClip)
  const videoUrl = getBackendVideoUrl(video)
  const posterUrl = getThumbnailUrl(video) || getThumbnailUrl(unit.videoClip)
  const subtitleUrl = getSubtitleUrl(video)
  const subtitles = getVideoSubtitles(video)
  const activeSubtitle = getActiveSubtitle(subtitles, videoTime)

  return (
    <div className="mx-auto max-w-screen-xl px-5 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-semibold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ChevronLeft size={16} /> {t('backToUnits', 'Back to Units')}
      </button>

      <section className="relative mb-6 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-500 to-accent-600 shadow-amber dark:border-slate-700 dark:from-slate-800 dark:to-slate-950">
        <div className="aspect-[16/10] min-h-[420px]">
          {heroImage ? (
            <img src={heroImage} alt="" className="h-full w-full object-cover opacity-75" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-accent-600 text-6xl font-black tracking-normal text-white/20">
              CineLingo
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="dark">{levelName}</Badge>
            {unit.status && <Badge variant={unit.status === 'Published' ? 'success' : 'default'}>{t(unit.status, unit.status)}</Badge>}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-normal text-white sm:text-5xl">{unit.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/70">
                <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {duration} {t('min', 'min')}</span>
                <span className="inline-flex items-center gap-1.5"><Volume2 size={15} /> {words.length} {t('vocabularyWords', 'vocabulary words')}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button size="lg" variant={videoOpen ? 'secondary' : 'brand'} onClick={handleWatch}>
                <Play size={17} /> {videoOpen ? t('watching', 'Watching') : t('watchVideo', 'Watch Video')}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate(`/flashcards/${unit.id}`)}>
                <BookmarkPlus size={17} /> {t('flashcards', 'Flashcards')}
              </Button>
              <Button size="lg" variant="secondary" disabled={!quiz?.id} onClick={() => { setChatOpen(true); navigate(`/quiz/unit/${unit.id}`) }}>
                <BookOpen size={17} /> {t('takeQuiz', 'Take Quiz')}
              </Button>
              <Button size="lg" variant="secondary" onClick={handleCompleteUnit}>
                <BookOpen size={17} /> {t('completeUnit', 'Complete Unit')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {videoOpen && (
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-card">
          {videoLoading ? (
            <div className="flex aspect-video items-center justify-center px-6 text-center text-white/60">
              <div>
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
                <p className="text-sm font-semibold">{t('loadingVideo', 'Loading video...')}</p>
              </div>
            </div>
          ) : videoUrl ? (
            <>
              <div className="relative bg-slate-950">
                <video
                  key={videoUrl}
                  controls
                  src={videoUrl}
                  className="aspect-video w-full bg-slate-950"
                  poster={posterUrl}
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
              {!subtitleUrl && subtitles.length === 0 && (
                <div className="border-t border-white/10 px-5 py-3 text-sm font-semibold text-white/60">
                  {t('noSubtitlesAvailable', 'No subtitles available')}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-video items-center justify-center px-6 text-center text-white/60">
              <div>
                <Play size={44} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm font-semibold">{t('videoNotAvailable', 'Video is not available')}</p>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card padding="p-6">
          <h2 className="text-lg font-black tracking-normal text-dark-900">{t('aboutThisUnit', 'About this unit')}</h2>
          <p className="mt-3 text-sm leading-7 text-dark-600">{unit.description || t('noDescriptionYet', 'No description has been added yet.')}</p>
        </Card>

        <Card padding="p-6" className="bg-cream-50/70">
          <h2 className="text-lg font-black tracking-normal text-dark-900">{t('learningFocus', 'Learning Focus')}</h2>
          <div className="mt-4 space-y-3 text-sm font-semibold text-dark-600">
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span>{t('difficulty', 'Difficulty')}</span>
              <span className="text-dark-900">{levelName}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span>{t('words', 'Words')}</span>
              <span className="text-dark-900">{words.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span>{t('quiz', 'Quiz')}</span>
              <span className="text-dark-900">{quiz?.id ? t('available', 'Available') : t('notReady', 'Not ready')}</span>
            </div>
          </div>
        </Card>
      </div>

      <section className="mt-6 rounded-2xl border border-cream-200 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black tracking-normal text-dark-900">{t('keyVocabulary', 'Key Vocabulary')}</h2>
            <p className="text-sm text-dark-500">{t('unitDetail.vocabHint', 'Save useful words to your personal vocabulary list.')}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <article key={word.id} className="rounded-2xl border border-cream-200 bg-cream-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black tracking-normal text-dark-900">{word.term}</h3>
                  {word.pronunciation && <p className="mt-1 font-mono text-xs text-brand-600">{word.pronunciation}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveWord(word.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-dark-400 transition-colors hover:bg-brand-100 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={t('saveWord', 'Save {{name}}').replace('{{name}}', word.term)}
              >
                <BookmarkPlus size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-dark-600">{word.definition}</p>
          </article>
        ))}
        {words.length === 0 && (
            <p className="col-span-full rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-4 py-8 text-center text-sm text-dark-500">
              {t('unitDetail.noVocabYet', 'No vocabulary has been added to this unit yet.')}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
