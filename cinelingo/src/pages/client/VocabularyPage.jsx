import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { BookMarked, Search, Trash2 } from 'lucide-react'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import PageHeader, { EmptyState } from '../../components/ui/PageHeader'
import { vocabularyService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const normalizeWord = (word) => ({
  id: word.wordId ?? word.id,
  english: word.term ?? word.english,
  translation: word.definition ?? word.translation,
  phonetic: word.pronunciation ?? word.phonetic,
  imageUrl: word.imageUrl,
  savedAt: word.savedAt,
})

export default function VocabularyPage() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = search.trim()
          ? await vocabularyService.search(search.trim())
          : await vocabularyService.getSaved()
        if (active) setWords((Array.isArray(res.data) ? res.data : []).map(normalizeWord))
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('vocabulary.loadError', 'Could not load vocabulary.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    const timer = setTimeout(load, search.trim() ? 250 : 0)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search])

  const filtered = useMemo(() => words.filter(w =>
    search === '' ||
    w.english?.toLowerCase().includes(search.toLowerCase()) ||
    w.translation?.toLowerCase().includes(search.toLowerCase())
  ), [search, words])

  const removeWord = async (wordId) => {
    try {
      await vocabularyService.deleteWord(wordId)
      setWords(w => w.filter(x => x.id !== wordId))
      toast.success(t('wordRemoved', 'Word removed.'))
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('vocabulary.removeError', 'Could not remove word.')))
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        eyebrow={t('vocabulary', 'Vocabulary')}
        title={t('savedWords', 'Saved words')}
        description={t('vocabulary.description', 'Your personal word bank from units and video lessons. Search, review, and prune it as you learn.')}
        action={
          <div className="w-full md:w-72">
            <Input placeholder={t('searchWords', 'Search words...')} prefix={<Search size={14} />} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        }
      />

      {loading && <p className="text-sm text-dark-500">{t('loadingVocabulary', 'Loading vocabulary...')}</p>}
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{getApiErrorMessage(error)}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && filtered.map((word) => (
          <article key={word.id} className="group rounded-2xl border border-cream-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-normal text-dark-900">{word.english}</p>
                {word.phonetic && <p className="mt-1 font-mono text-xs text-brand-600">{word.phonetic}</p>}
              </div>
              <button
                onClick={() => removeWord(word.id)}
                className="rounded-xl p-2 text-dark-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label={t('removeWord', 'Remove {{name}}').replace('{{name}}', word.english)}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="min-h-12 text-sm leading-6 text-dark-600">{word.translation}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Badge>{t('saved', 'Saved')}</Badge>
              <BookMarked size={16} className="text-dark-300" />
            </div>
          </article>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <EmptyState icon={BookMarked} title={t('noSavedWordsFound', 'No saved words found')} description={t('vocabulary.emptyDescription', 'Save words from unit pages and they will appear in this vocabulary bank.')} />
      )}
    </div>
  )
}
