import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Layers3, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import Button from '../../components/ui/Button'
import PageHeader, { EmptyState } from '../../components/ui/PageHeader'
import { cn, getApiErrorMessage } from '../../utils/helpers'
import { flashcardService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const normalizeCard = (card) => ({
  id: card.id ?? card.wordId,
  english: card.term ?? card.english,
  phonetic: card.pronunciation ?? card.phonetic,
  translation: card.definition ?? card.translation,
  exampleSentence: card.exampleSentence,
  partOfSpeech: card.partOfSpeech || 'Word',
})

export default function FlashcardsPage() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await flashcardService.getDeck()
        if (active) setCards((Array.isArray(res.data) ? res.data : []).map(normalizeCard))
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('flashcards.loadError', 'Could not load flashcards.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const card = cards[index]
  const total = cards.length
  const progress = total ? Math.round(((index + 1) / total) * 100) : 0
  const isDone = total > 0 && index >= total - 1 && done.includes(index)

  const next = async () => {
    if (card?.id) {
      try { await flashcardService.flip(card.id) } catch {}
    }
    setFlipped(false)
    setDone(p => p.includes(index) ? p : [...p, index])
    setTimeout(() => { if (index < total - 1) setIndex(i => i + 1) }, 180)
  }

  const restart = () => {
    setIndex(0)
    setFlipped(false)
    setDone([])
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg px-5 py-8 sm:px-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton mt-8 h-80 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
        <EmptyState icon={Layers3} title={t('flashcardsUnavailable', 'Flashcards unavailable')} description={error} />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-8 sm:px-6">
        <EmptyState
          icon={Layers3}
          title={t('noFlashcardsYet', 'No flashcards yet')}
          description={t('flashcards.emptyDescription', 'Save vocabulary from units and your review deck will appear here.')}
        />
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="mx-auto max-w-screen-md px-5 py-16 text-center sm:px-6">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <Sparkles size={28} />
        </div>
        <h1 className="text-3xl font-black tracking-normal text-dark-900">{t('sessionComplete', 'Session complete')}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-dark-500">
          {t('flashcards.reviewedMessage', 'You reviewed {{count}} flashcards. Nice momentum for long-term recall.').replace('{{count}}', String(total))}
        </p>
        <div className="mt-7">
          <Button size="lg" onClick={restart}><RotateCcw size={16} /> {t('restartSession', 'Restart Session')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-lg px-5 py-8 sm:px-6">
      <PageHeader
        eyebrow={t('reviewDeck', 'Review Deck')}
        title={t('flashcards', 'Flashcards')}
        description={t('flashcards.description', 'Flip each card, check your recall, then move through the deck at a steady pace.')}
        action={<span className="rounded-full border border-cream-200 bg-white px-4 py-2 text-sm font-semibold text-dark-700">{index + 1} / {total}</span>}
      />

      <div className="mb-7 overflow-hidden rounded-full bg-cream-200">
        <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <button
        type="button"
        onClick={() => setFlipped(v => !v)}
        className="group relative mb-6 block min-h-[320px] w-full overflow-hidden rounded-2xl border border-cream-200 bg-white text-left shadow-card outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-pressed={flipped}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,125,60,0.14),transparent_32%),linear-gradient(135deg,rgba(26,22,18,0.04),transparent)]" />
        <div className="relative flex min-h-[320px] flex-col justify-between p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-cream-200 bg-cream-50 px-3 py-1 text-xs font-bold uppercase tracking-normal text-brand-600">
              {flipped ? t('translation', 'Translation') : card.partOfSpeech}
            </span>
            <span className="text-xs font-semibold text-dark-400">{t('tapTo', 'Tap to')} {flipped ? t('hide', 'hide') : t('reveal', 'reveal')}</span>
          </div>

          <div className="mx-auto max-w-2xl py-8 text-center">
            {!flipped ? (
              <>
                <h2 className="text-4xl font-black tracking-normal text-dark-900 sm:text-5xl">{card.english}</h2>
                {card.phonetic && <p className="mt-4 font-mono text-base text-brand-600">{card.phonetic}</p>}
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black tracking-normal text-dark-900 sm:text-4xl">{card.translation}</h2>
                {card.exampleSentence && <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-dark-500">"{card.exampleSentence}"</p>}
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-dark-400">
            <span className={cn('h-2 w-2 rounded-full', flipped ? 'bg-dark-300' : 'bg-brand-500')} />
            {flipped ? t('backSide', 'Back side') : t('frontSide', 'Front side')}
          </div>
        </div>
      </button>

      {flipped ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" size="lg" className="border-red-200 text-red-600 hover:bg-red-50" onClick={next}>
            <ThumbsDown size={17} /> {t('reviewAgain', 'Review Again')}
          </Button>
          <Button variant="brand" size="lg" onClick={next}>
            <ThumbsUp size={17} /> {t('gotIt', 'Got It')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={() => { setFlipped(false); setIndex(i => Math.max(0, i - 1)) }} disabled={index === 0}>
            <ChevronLeft size={16} /> {t('previous', 'Previous')}
          </Button>
          <Button onClick={() => setFlipped(true)}>{t('flipCard', 'Flip Card')}</Button>
          <Button variant="ghost" onClick={next}>{t('skip', 'Skip')} <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  )
}
